import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import CryptoSelectionModal from "./CryptoSelectionModal";

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

const CloseButton = styled.span`
  cursor: pointer;
  color: red;
  font-size: 24px;
  font-weight: bold;
`;

const PayButton = styled(ModalButton)`
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  background: green;
  color: #fff;
`;

const letterVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  hover: { y: -10, transition: { yoyo: Infinity, duration: 0.3 } },
};

const PurchaseTokens = () => {
  const [tokens, setTokens] = useState(0);
  const [showCryptoSelectionModal, setShowCryptoSelectionModal] = useState(false);
  const tokenValue = 0.1;
  //eslint-disable-next-line
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  const handleSelectCrypto = (crypto) => {
    setSelectedCrypto(crypto);
    // Close the modal after selecting the crypto
    closeCryptoSelectionModal();
    // You can also make the payment request here or do anything else with the selected crypto
  };

  const updateTokens = (amount) => {
    setTokens(amount);
  };

  const handlePayButtonClick = () => {
    setShowCryptoSelectionModal(true);
    setSelectedCrypto(null);
  };

  const closeCryptoSelectionModal = () => {
    setShowCryptoSelectionModal(false);
  };

  return (
    <Container>
      <motion.h1
        initial={{ y: -50 }}
        animate={{ y: 0, transition: { duration: 1 } }}
        style={{ color: 'white', fontSize: '72px' }}
      >
        {Array.from(`Slide into my DM's`).map((char, index) => (
          <motion.span
            key={index}
            custom={index}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            variants={letterVariants}
          >
            {char}
          </motion.span>
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
          appearance: 'none',
          height: '30px',
          borderRadius: '5px',
          background: '#4caf50',
          outline: 'none',
        }}
      />
      <AnimatePresence>
        {tokens > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 0,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 10,
                width: '400px',
                border: '2px solid #4caf50',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Payment</h2>
                <CloseButton onClick={() => updateTokens(0)}>&times;</CloseButton>
              </div>
              <p>
                You are purchasing {tokens} messages for ${(tokens * tokenValue).toFixed(2)}
              </p>
              <div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={tokens}
                  onChange={(e) => updateTokens(e.target.value)}
                  style={{
                    width: '100%',
                    appearance: 'none',
                    height: '15px',
                    borderRadius: '5px',
                    background: '#4caf50',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
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
          </motion.div>
        )}
      </AnimatePresence>
      {showCryptoSelectionModal && (
        <CryptoSelectionModal
          onClose={closeCryptoSelectionModal}
          onSelectCrypto={handleSelectCrypto}
          tokenAmount={tokens}
        />
      )}
    </Container>
  );
};

export default PurchaseTokens;
