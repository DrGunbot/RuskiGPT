import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import axios from 'axios';

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
  borderRadius: 10px;
  width: 600px;
  border: 2px solid #4caf50;
`;

const CloseButton = styled.span`
  cursor: pointer;
  color: red;
  font-size: 24px;
  font-weight: bold;
`;

const CryptoDropdown = styled.select`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #4caf50;
`;

const CryptoSelectionModal = ({ onClose, onSelectCrypto }) => {
    const [cryptos, setCryptos] = useState([]);
    const [selectedCrypto, setSelectedCrypto] = useState(null);
  
    useEffect(() => {
      // Replace this URL with your server-side API route
      axios.get('/api/nowpayments/get-cryptocurrencies')
        .then(response => {
          setCryptos(response.data);
          setSelectedCrypto(response.data[0]);
        })
        .catch(error => {
          console.error('Error fetching cryptocurrencies:', error);
        });
    }, []);
  
    const handleSelectCrypto = (e) => {
      const selected = e.target.value;
      setSelectedCrypto(selected);
      onSelectCrypto(selected);
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Select Cryptocurrency</h2>
            <CloseButton onClick={onClose}>&times;</CloseButton>
          </div>
          <CryptoDropdown onChange={handleSelectCrypto}>
            {cryptos.map((crypto, index) => (
              <option key={index} value={crypto.symbol}>{crypto.name}</option>
            ))}
          </CryptoDropdown>
          <div>
            <p>Current exchange rate: ...</p>
            <p>Additional information: ...</p>
          </div>
        </ModalContainer>
      </ModalOverlay>
    </AnimatePresence>
  );
};

export default CryptoSelectionModal;
