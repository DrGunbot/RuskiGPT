import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import styled from '@emotion/styled';
import axios from 'axios';



const apiClient = axios.create({
    baseURL: 'http://localhost:5000',
});

const ModalOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const ModalContainer = styled(motion.div)`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  border: 2px solid #4caf50;
  overflow: hidden;
  position: relative;
`;

const CloseButton = styled.span`
  cursor: pointer;
  color: red;
  font-size: 24px;
  font-weight: bold;
  position: absolute;
  top: 8px;
  right: 10px;
  &:hover {
    color: #ff7f7f;
  }
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f3f3f3;
  border-radius: 5px;
  margin-top: 10px;
`;

const ProgressBar = styled(motion.div)`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
`;

const PaymentDetails = styled(motion.div)`
  margin-top: 10px;
`;

const WalletAddress = styled.span`
  cursor: pointer;
  color: #4caf50;
  font-weight: bold;
  &:hover {
    color: #2e7d32;
  }
`;

const CryptoDropdown = styled.select`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #4caf50;
  font-size: 1.1rem;
  color: #4caf50;
  background: white;
`;

const ConfirmButton = styled(motion.button)`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
`;

const Spinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: #4caf50;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CryptoSelectionModal = ({ onClose, onSelectCrypto, tokenAmount }) => {
    const [cryptos, setCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [transactionProgress, setTransactionProgress] = useState(0);
    const [transactionError, setTransactionError] = useState(null);
    const [priceAmount, setPriceAmount] = useState(0);
    const [coinPrices, setCoinPrices] = useState({});
    const [tokenPrice, setTokenPrice] = useState(0);
    const [paymentDetails, setPaymentDetails] = useState(null);
    const [isFetchingPaymentInfo, setIsFetchingPaymentInfo] = useState(false);
    const walletAddressRef = useRef(null);
    const detailsAnimation = useAnimation();
    const progressAnimation = useAnimation();

    useEffect(() => {
        if (isFetchingPaymentInfo) {
            detailsAnimation.start({ opacity: 0.5 });
        } else {
            detailsAnimation.start({ opacity: 1 });
        }
    }, [isFetchingPaymentInfo, detailsAnimation]);

    useEffect(() => {
        progressAnimation.start({ width: `${transactionProgress}%` });
    }, [transactionProgress, progressAnimation]);

    const handleSelectCrypto = (e) => {
        const selected = e.target.value;
        const selectedCryptoObj = cryptos.find((crypto) => crypto.symbol === selected);
        setSelectedCrypto(selectedCryptoObj);

        // Calculate price_amount
        const coinPrice = coinPrices[selected]; // Make sure to import or fetch coinPrices
        const priceAmount = tokenAmount * tokenPrice / coinPrice;
        setPriceAmount(priceAmount.toFixed(2));
    };


    const handleConfirmSelection = async () => {
        if (selectedCrypto) {
            try {
                setIsFetchingPaymentInfo(true);
                console.log('Selected crypto:', selectedCrypto);
                // Create the payment
                setIsFetchingPaymentInfo(true); // Add this line
                const paymentResponse = await apiClient.post(
                    '/api/create-payment',
                    {
                        price_currency: 'usd',
                        price_amount: tokenAmount * 0.1,
                        pay_currency: selectedCrypto.symbol, // Send the selectedCrypto.symbol as pay_currency
                    }
                );
                console.log('Payment response:', paymentResponse.data);

                // Set the payment details state with the received information
                setPaymentDetails(paymentResponse.data);
                setIsFetchingPaymentInfo(false);
                const paymentId = paymentResponse.data.payment_id;

                // Start the transaction progress updates
                setTransactionProgress(0);

                const intervalId = setInterval(async () => {
                    try {
                        // Get the payment status
                        const statusResponse = await apiClient.get(`/api/payment-status/${paymentId}`);

                        const paymentStatus = statusResponse.data.payment_status;

                        // Update the transaction progress based on the payment status
                        if (paymentStatus === 'waiting') {
                            setTransactionProgress(25);
                        } else if (paymentStatus === 'confirming') {
                            setTransactionProgress(50);
                        } else if (paymentStatus === 'confirmed') {
                            setTransactionProgress(75);
                        } else if (paymentStatus === 'finished') {
                            setTransactionProgress(100);
                            clearInterval(intervalId);
                            onSelectCrypto(selectedCrypto);
                        } else if (paymentStatus === 'failed' || paymentStatus === 'expired' || paymentStatus === 'refunded') {
                            clearInterval(intervalId);
                            setTransactionError(new Error(`Payment ${paymentStatus}`));
                        }
                    } catch (error) {
                        clearInterval(intervalId);
                        setTransactionError(error);
                    }
                }, 5000);
                setIsFetchingPaymentInfo(false);
            } catch (error) {
                setTransactionError(error);
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

            // Show a temporary message to indicate the address has been copied
            detailsAnimation.start({ scale: 0.9 }).then(() => {
                detailsAnimation.start({ scale: 1 });
            });
        }
    };


    useEffect(() => {
        const fetchCoinListAndPrices = async () => {
            try {
                const coinListResponse = await axios.get('http://localhost:5000/api/coinList');
                const cryptoList = coinListResponse.data.currencies.map((crypto) => ({
                    symbol: crypto,
                    name: crypto.toUpperCase(),
                }));

                const sortedCryptoList = cryptoList.sort((a, b) => a.name.localeCompare(b.name));
                setCryptos(sortedCryptoList);

                const tokenPricesResponse = await axios.get('http://localhost:5000/api/tokenPrices');
                setCoinPrices(tokenPricesResponse.data);
                setTokenPrice(tokenPricesResponse.data[cryptoList[0].symbol]);
            } catch (error) {
                console.error('Error fetching cryptocurrencies and token prices:', error);
            }
        };

        fetchCoinListAndPrices();
    }, []);


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
                    {/* Add the conditional rendering of the Spinner */}
                    {isFetchingPaymentInfo && (
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                zIndex: 1,
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
                                <h2>Select Cryptocurrency</h2>
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
                                <p>Price Amount: {priceAmount}</p>
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
                        <PaymentDetails
                            initial={{ opacity: 0, y: -50 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
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
                    <ProgressBarContainer>
                        <ProgressBar progress={transactionProgress} />
                    </ProgressBarContainer>
                    {transactionError && (
                        <div>
                            <p>Error: {transactionError.message}</p>
                        </div>
                    )}
                </ModalContainer>
            </ModalOverlay>
        </AnimatePresence>
    );
};

export default CryptoSelectionModal;