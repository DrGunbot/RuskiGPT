import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

const glowAnimation = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(255, 0, 0, 1), 0 0 10px rgba(0, 0, 255, 1);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 0, 0, 1), 0 0 20px rgba(0, 0, 255, 1);
  }
`;

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
  background-color: #e74c3c;
  padding: 20px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${pulseAnimation} 2s infinite, ${glowAnimation} 3s infinite;
`;

const Title = styled.h2`
  font-size: 24px;
  color: white;
  margin-bottom: 10px;
  text-transform: uppercase;
`;

const Text = styled.p`
  font-size: 18px;
  color: white;
  text-align: center;
  line-height: 1.5;
`;

const InformWalletConnectionModal = ({ onClose }) => {
  return (
    <ModalContainer onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>No wallet connected!</Title>
        <Text>
          A web3 connection is required in order to link your chat tokens to the correct account. You cannot purchase tokens until a valid wallet connection is obtained.
        </Text>
      </ModalContent>
    </ModalContainer>
  );
};

export default InformWalletConnectionModal;
