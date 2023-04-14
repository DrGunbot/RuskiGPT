import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import PaymentModal from './PaymentModal';
import { getAccount } from '@wagmi/core';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: none;
  position: relative;
  z-index: 0;
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

const letterVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 1 } },
  hover: { scale: 1.2, rotate: [0, 10, -10, 10, -10, 0], transition: { duration: 0.3 } },
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

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Container>
        <motion.div whileHover="hover">
          <motion.h1
            style={{ color: 'white', fontSize: '72px' }}
          >
            {Array.from(`Slide into my DM's`).map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
              >
                                {char}
              </motion.span>
            ))}
          </motion.h1>
        </motion.div>
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
              <h2>Slide me to select the amount of messages you'd like to buy</h2>
              <p>
                Click the pay button to purchase {tokens} messages for ${(tokens * tokenValue).toFixed(2)}
              </p>
              <div>
                <PayButton
                  onClick={handlePayButtonClick}
                >
                  Pay
                </PayButton>
                <ModalButton
                  style={{ background: "red", color: "#fff", cursor: "pointer" }}
                  onClick={() => updateTokens(0)}
                >
                  Cancel
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
      </Container>
    </motion.div>
  );
};

export default PurchaseTokens;

