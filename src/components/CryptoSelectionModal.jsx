import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Confetti from 'react-confetti';
import { getAccount } from '@wagmi/core';
import { createClient } from '@supabase/supabase-js';
import {
  ModalContainer,
  ModalOverlay,
  CloseButton,
  StateList,
  StateItem,
  Spinner,
  PaymentDetails,
  WalletAddress,
  CryptoDropdown,
  ConfirmButton,
} from '../assets/styling/cryptoSelectionModal/cryptoSelectionModal';

const supabaseUrl = 'https://jxyktcgpiwlirnfixrrd.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_API;
const supabase = createClient(supabaseUrl, supabaseKey);

const apiClient = axios.create({
  baseURL: 'http://localhost:5000',
});

const CryptoSelectionModal = ({
  onClose,
  onSelectCrypto,
  tokenAmount,
  ethereumClient,
}) => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [coinPrices, setCoinPrices] = useState({});
  const [tokenPrice, setTokenPrice] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isFetchingPaymentInfo, setIsFetchingPaymentInfo] = useState(false);
  const walletAddressRef = useRef(null);
  const [stateList, setStateList] = useState([
    { label: 'waiting', active: false },
    { label: 'confirming', active: false },
    { label: 'sending', active: false },
    { label: 'finished', active: false },
  ]);

  const [walletAddress, setWalletAddress] = useState(null);
  const wagmiClient = ethereumClient.wagmiClient;

  useEffect(() => {
    const fetchWalletAddress = async () => {
      try {
        const connectedAccount = await getAccount(wagmiClient);
        setWalletAddress(connectedAccount.address);
      } catch (error) {
        console.error('Error getting connected account:', error);
      }
    };

    fetchWalletAddress();
  }, [wagmiClient]);

  useEffect(() => {
    const fetchCoinListAndPrices = async () => {
      try {
        const coinListResponse = await apiClient.get('/api/coinList');
        const cryptoList = coinListResponse.data.currencies.map((crypto) => ({
          symbol: crypto,
          name: crypto.toUpperCase(),
        }));

        const sortedCryptoList = cryptoList.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setCryptos(sortedCryptoList);

        const tokenPricesResponse = await apiClient.get('/api/tokenPrices');
        setCoinPrices(tokenPricesResponse.data);
        setTokenPrice(tokenPricesResponse.data[cryptoList[0].symbol]);
      } catch (error) {
        console.error('Error fetching cryptocurrencies and token prices:', error);
      }
    };

    fetchCoinListAndPrices();
  }, []);

  const creditTokens = async (tokensToCredit) => {
    if (!walletAddress) {
      console.error('No wallet address found');
      return;
    }

    const { data: user_tokens, error } = await supabase
      .from('user_tokens')
      .select('*')
      .eq('wallet_address', walletAddress);

    if (error) {
      console.error('Error fetching user tokens:', error);
      return;
    }

    if (!user_tokens || user_tokens.length === 0) {
      console.error('No user token entry found for the connected wallet address');
      return;
    }

    const userToken = user_tokens[0];

    const updatedTokensOwned = (userToken.tokens_owned || 0) + tokensToCredit;
    const updatedTokensPurchased = (userToken.tokens_purchased || 0) + tokensToCredit;

    const { error: updateError } = await supabase
      .from('user_tokens')
      .update({ tokens_owned: updatedTokensOwned, tokens_purchased: updatedTokensPurchased })
      .eq('wallet_address', walletAddress);

    if (updateError) {
      console.error('Error updating user tokens:', updateError);
      return;
    }

    console.log(`Credited ${tokensToCredit} tokens to wallet address ${walletAddress}`);
  };

  const handleTokenPurchase = async (walletAddress, amountSpent) => {
    try {
      // Call the /api/purchase endpoint to update the user's tokens
      const response = await apiClient.post('/api/purchase', {
        walletAddress,
        amountSpent,
      });

      if (response.status === 200) {
        // Animate the process of adding the user's tokens
        setStateList((prevState) =>
          prevState.map((stateItem) =>
            stateItem.label === 'finished'
              ? { label: stateItem.label, active: true }
              : stateItem
          )
        );
        console.log(response.data.message);
      } else {
        console.error('Error updating tokens:', response.data);
      }
    } catch (error) {
      console.error('Error updating tokens:', error);
    }
  };

  const handleSelectCrypto = (e) => {
    const selected = e.target.value;
    const selectedCryptoObj = cryptos.find(
      (crypto) => crypto.symbol === selected
    );
    setSelectedCrypto(selectedCryptoObj);
  };

  const [showConfetti, setShowConfetti] = useState(false);

  const handleConfirmSelection = async () => {
    if (selectedCrypto) {
      try {
        setIsFetchingPaymentInfo(true);
        console.log('Selected crypto:', selectedCrypto);
        // Create the payment
        setIsFetchingPaymentInfo(true);
        const paymentResponse = await apiClient.post('/api/create-payment', {
          price_currency: 'usd',
          price_amount: tokenAmount * 0.1,
          pay_currency: selectedCrypto.symbol,
        });
        console.log('Payment response:', paymentResponse.data);

        // Set the payment details state with the received information
        setPaymentDetails(paymentResponse.data);
        setIsFetchingPaymentInfo(false);
        const paymentId = paymentResponse.data.payment_id;

        // Start the transaction progress updates
        setStateList((prevState) =>
          prevState.map((stateItem) =>
            stateItem.label === 'waiting'
              ? { label: stateItem.label, active: true }
              : stateItem
          )
        );

        const intervalId = setInterval(async () => {
          try {
            // Get the payment status
            const statusResponse = await apiClient.get(
              `/api/payment-status/${paymentId}`
            );
            const paymentStatus = statusResponse.data.payment_status;

            // Update the stateList based on the payment status
            setStateList((prevState) =>
              prevState.map((stateItem) =>
                stateItem.label === paymentStatus
                  ? { label: stateItem.label, active: true }
                  : stateItem
              )
            );

            if (
              paymentStatus === 'failed' ||
              paymentStatus === 'expired' ||
              paymentStatus === 'refunded'
            ) {
              clearInterval(intervalId);
              setTimeout(() => {
                onClose();
              }, 3000);
            } else if (paymentStatus === 'finished') {
              clearInterval(intervalId);

              //Call creditTokens function
              await creditTokens(tokenAmount);

              // Show confetti animation for 3 seconds before closing the modal
              setShowConfetti(true);
              setTimeout(() => {
                setShowConfetti(false);
                onSelectCrypto(selectedCrypto);
              }, 3000);
            }
          } catch (error) {
            console.error('Error fetching payment status:', error);
            clearInterval(intervalId);
          }
        }, 5000);
      } catch (error) {
        console.error('Error creating payment:', error);
        setIsFetchingPaymentInfo(false);
      }
    }
  };

  const handleCopyWalletAddress = () => {
    if (walletAddressRef.current) {
      const el = document.createElement('textarea');
      el.value = walletAddressRef.current.textContent;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  };

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <ModalContainer
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        >
          {isFetchingPaymentInfo && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              }}
            >
              <Spinner />
            </div>
          )}
          {!paymentDetails ? (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h2>What coin do you want to pay with?</h2>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </div>
              <CryptoDropdown onChange={handleSelectCrypto}>
                {cryptos.map((crypto, index) => (
                  <option key={index} value={crypto.symbol}>
                    {crypto.name}
                  </option>
                ))}
              </CryptoDropdown>
              <div>
                <p>Current exchange rate: ...</p>
                <p>Additional information: ...</p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <ConfirmButton
                    onClick={handleConfirmSelection}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    Confirm Selection
                  </ConfirmButton>
                </div>
              </div>
            </>
          ) : (
            <PaymentDetails>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3>Payment Details</h3>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </div>
              {isFetchingPaymentInfo ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Spinner />
                  <p style={{ marginTop: '10px', marginBottom: '10px' }}>
                    Grabbing payment details...
                  </p>
                </div>
              ) : (
                <>
                  <p>Send the payment to the following address:</p>
                  <p>
                    <WalletAddress
                      ref={walletAddressRef}
                      onClick={handleCopyWalletAddress}
                    >
                      {paymentDetails.pay_address}
                    </WalletAddress>
                  </p>
                  <p>Amount to send:</p>
                  <p>
                    {paymentDetails.pay_amount}{' '}
                    {paymentDetails.pay_currency.toUpperCase()}
                  </p>
                  <p>Payment ID:</p>
                  <p>{paymentDetails.payment_id}</p>
                  <p>Valid until:</p>
                  <p>{paymentDetails.valid_until}</p>
                </>
              )}
            </PaymentDetails>
          )}
          <StateList>
            {stateList.map((stateItem, index) => (
              <StateItem key={index} active={stateItem.active}>
                {stateItem.label}
                {!stateItem.active && <Spinner />}
              </StateItem>
            ))}
          </StateList>
          {showConfetti && <Confetti numberOfPieces={200} />}
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default CryptoSelectionModal;