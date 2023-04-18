import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Confetti from 'react-confetti';
import { getAccount } from '@wagmi/core';
import CountUp from 'react-countup';
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
  PulsatingText,
  pulsate,
} from '../assets/styling/cryptoSelectionModal/cryptoSelectionModal';


const PaymentModal = ({
  onClose,
  onSelectCrypto,
  tokenAmount,
  ethereumClient,
}) => {
  const [cryptos, setCryptos] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [isFetchingPaymentInfo, setIsFetchingPaymentInfo] = useState(false);
  const walletAddressRef = useRef(null);
  const [stateList, setStateList] = useState([
    { label: 'waiting', active: false },
    { label: 'confirming', active: false },
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
        const coinListResponse = await axios.get('/api/coinList');
        
        if (coinListResponse.data && coinListResponse.data.currencies) {
          const cryptoList = coinListResponse.data.currencies.map((crypto) => ({
            symbol: crypto,
            name: crypto.toUpperCase(),
          }));
  
          const sortedCryptoList = cryptoList.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCryptos(sortedCryptoList);
        } else {
          console.error('Error: coinListResponse.data.currencies is undefined.');
        }
      } catch (error) {
        console.error(
          'Error fetching cryptocurrencies and token prices:',
          error
        );
      }
    };
  
    fetchCoinListAndPrices();
  }, []);
  

  const creditTokens = async (tokensToCredit) => {
    if (!walletAddress) {
      console.error('No wallet address found');
      return;
    }

    try {
      const response = await axios.post('/api/creditTokens', {
        walletAddress,
        tokensToCredit,
      });

      if (response.data.success) {
        console.log(
          `Credited ${tokensToCredit} tokens to wallet address ${walletAddress}`
        );
      } else {
        console.error('Error crediting tokens:', response.data.error);
      }
    } catch (error) {
      console.error('Error calling creditTokens API:', error);
    }
  };

  const handleSelectCrypto = (e) => {
    const selected = e.target.value;
    if (selected === '') {
      setSelectedCrypto(null);
    } else {
      const selectedCryptoObj = cryptos.find(
        (crypto) => crypto.symbol === selected
      );
      setSelectedCrypto(selectedCryptoObj);
    }
  };

  const [showConfetti, setShowConfetti] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handleConfirmSelection = async () => {
    if (selectedCrypto) {
      try {
        setIsFetchingPaymentInfo(true);
        console.log('Selected crypto:', selectedCrypto);
        // Create the payment
        setIsFetchingPaymentInfo(true);
        const paymentResponse = await axios.post('/api/payment', {
          price_currency: 'usd',
          price_amount: tokenAmount * 0.1,
          pay_currency: selectedCrypto.symbol,
          purchase_id: paymentDetails.purchase_id, // Add purchase_id
          payment_id: paymentDetails.payment_id, // Add txid
        });
        
        console.log('Payment response:', paymentResponse.data);

        // Set the payment details state with the received information
        setPaymentDetails(paymentResponse.data);
        setIsFetchingPaymentInfo(false);
        const paymentId = paymentResponse.data?.payment_id ?? '';


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
            const statusResponse = await axios.post('/api/payment', {
              payment_id: paymentId,
              check_status: true,
            });
            const paymentStatus = statusResponse.data.payment_status;
      
            setPaymentStatus(paymentStatus);
      
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
            } else if (paymentStatus === 'confirming') {
              clearInterval(intervalId);
      
              // Call creditTokens function
              await creditTokens(tokenAmount);
      
              // Show confetti animation for 10 seconds before closing the modal
              setShowConfetti(true);
              setTimeout(() => {
                setShowConfetti(false);
                onSelectCrypto(selectedCrypto);
                onClose();
              }, 10000);
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

  const confirmButtonText = () => {
    if (!selectedCrypto) {
      return 'Сначала вы должны выбрать монету.';
    } else {
      return `Оплатить с помощью ${selectedCrypto.name}`;
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
              <PulsatingText
        initial="initial"
        animate="animate"
        variants={pulsate}
        transition={{
          duration: 1,
          yoyo: Infinity,
        }}
      >
        Processing payment...
      </PulsatingText>
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
                <h2>Какой монетой вы хотите заплатить?</h2>
                <CloseButton onClick={onClose}>&times;</CloseButton>
              </div>
              <CryptoDropdown onChange={handleSelectCrypto}>
                <option value="">Выберите монету.</option>
                {cryptos.map((crypto, index) => (
                  <option key={index} value={crypto.symbol}>
                    {crypto.name}
                  </option>
                ))}
              </CryptoDropdown>
              
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: '1rem',
                }}
              >
                <ConfirmButton
                  onClick={handleConfirmSelection}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  disabled={!selectedCrypto}
                  style={{
                    backgroundColor: selectedCrypto ? 'green' : 'grey',
                  }}
                >
                  {confirmButtonText()}
                </ConfirmButton>
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
                  <p>Purchase ID:</p>
                  <p>{paymentDetails.purchase_id}</p>
                  <p>Valid until:</p>
                  <p>{paymentDetails.valid_until}</p>
                  <p>Amount received:</p>
                  <p>{paymentDetails.actually_paid}</p>
                </>
              )}

              {paymentStatus === 'confirming' && (
                <div>
                  <h3>Token deposit:</h3>
                  <CountUp start={0} end={tokenAmount} duration={5} />
                </div>
              )}
            </PaymentDetails>

          )}
          <StateList>
            {stateList.map((stateItem, index) => (
              <StateItem key={index} active={stateItem.active}>
                {stateItem.label}
              </StateItem>
            ))}
          </StateList>
          {showConfetti && <Confetti numberOfPieces={200} />}
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default PaymentModal;