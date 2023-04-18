import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import PaymentModal from './PaymentModal';
import InformWalletConnectionModal from './InformWalletConnectionModal';
import { getAccount } from '@wagmi/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: none;
  position: relative;
`;

const ModalButton = styled.button`
  border: none;
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 24px;
  font-weight: bold;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.3s all;
  &:hover {
    transform: scale(1.1);
  }
`;

const PayButton = styled(ModalButton)`
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  background: green;
  color: #fff;
`;

const useLetterColor = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#FFF", "#F00", "#FFF", "#00FFFF"];

  const nextColor = () => {
    setColorIndex((colorIndex + 1) % colors.length);
  };

  return { color: colors[colorIndex], nextColor };
};

const Letter = ({ char }) => {
  const { color, nextColor } = useLetterColor();

  return (
    <motion.span
      style={{ color }}
      initial={false}
      animate={{ color }}
      transition={{ duration: 1 }}
      onMouseEnter={nextColor}
      onTouchStart={nextColor}
      onTouchEnd={nextColor}
      whileHover={{ scale: 1.2, skewX: 10 }}
    >
      {char}
    </motion.span>
  );
};

const pageVariants = {
  initial: {
    y: 100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const infoVariants = {
  hidden: { opacity: 0, y: 100 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const PurchaseTokens = () => {
  const [tokens, setTokens] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWalletConnectionModal, setShowWalletConnectionModal] = useState(false);
  const tokenValue = 0.1;
  // eslint-disable-next-line
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const ethereumClient = getAccount();

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    closePaymentModal();
  };

  const updateTokens = (amount) => {
    setTokens(amount);
  };

  const handlePayButtonClick = () => {
    setShowPaymentModal(true);
    setSelectedCrypto(null);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handleWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          handlePayButtonClick();
        } else {
          setShowWalletConnectionModal(true);
        }
      } catch (err) {
        setShowWalletConnectionModal(true);
      }
    } else {
      setShowWalletConnectionModal(true);
    }
  };
  
  
  

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Container>
        <motion.h1
          style={{ color: 'white', fontSize: '72px', textAlign: 'center' }}
        >
          {Array.from(`Потяните чтобы выбрать количество сообщений`).map((char, index) => (
            <Letter key={index} char={char} />
          ))}
        </motion.h1>
        <input
          type="range"
          min="100"
          max="5000"
          step="100"
          value={tokens}
          onChange={(e) => updateTokens(e.target.value)}
          style={{
            width: '50%',
            margin: '2rem 0',
            height: '30px',
            borderRadius: '5px',
            background: '#4caf50',
            outline: 'none',
          }}
        />
        <AnimatePresence>
          {tokens > 0 && (
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={infoVariants}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 20,
                borderRadius: 10,
                background: "#fff",
                border: '2px solid #4caf50',
                marginTop: '1rem',
              }}
            >
              <h2>Потяните, чтобы выбрать количество сообщений, которое вы хотите купить.</h2>
              <p>
                Нажмите кнопку оплаты, чтобы купить {tokens} сообщений за ${(tokens * tokenValue).toFixed(2)}
              </p>
              <div>
              <PayButton onClick={() => handleWalletConnection()}>Payоплатить</PayButton>

                <ModalButton
                  style={{ background: "red", color: "#fff", cursor: "pointer" }}
                  onClick={() => updateTokens(0)}
                >
                  отменить
                </ModalButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {showPaymentModal && (
          <PaymentModal
            onClose={closePaymentModal}
            onSelectCrypto={handleSelectCrypto}
            tokenAmount={tokens}
            ethereumClient={ethereumClient}
          />
        )}
        {showWalletConnectionModal && (
          <InformWalletConnectionModal onClose={() => setShowWalletConnectionModal(false)} />
        )}
      </Container>
    </motion.div>
  );
};

export default PurchaseTokens;

       
