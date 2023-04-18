import React from 'react';
import styled from '@emotion/styled';

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  width: 400px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InformWalletConnectionModal = ({ onClose }) => {
  return (
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <h2>Please connect your wallet</h2>
        <p>Connect your wallet to proceed with the payment.</p>
      </ModalContent>
    </ModalContainer>
  );
};

export default InformWalletConnectionModal;
