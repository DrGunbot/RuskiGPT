import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ModalOverlay = styled(motion.div)`
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

export const StateList = styled.ol`
  list-style-type: none;
  padding: 0;
  margin: 16px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const StateItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: ${(props) => (props.active ? '#000' : '#999')};
  font-weight: ${(props) => (props.active ? 'bold' : 'normal')};
`;

export const Spinner = styled(motion.div)`
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ModalContainer = styled(motion.div)`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 600px;
  border: 2px solid #4caf50;
  overflow: hidden;
  position: relative;
`;

export const CloseButton = styled.span`
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

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 20px;
  background-color: #f3f3f3;
  border-radius: 5px;
  margin-top: 10px;
`;

export const ProgressBar = styled(motion.div)`
  width: ${(props) => props.progress}%;
  height: 100%;
  background-color: #4caf50;
  border-radius: 5px;
`;

export const PaymentDetails = styled(motion.div)`
  margin-top: 10px;
`;

export const WalletAddress = styled.span`
  cursor: pointer;
  color: #4caf50;
  font-weight: bold;
  &:hover {
    color: #2e7d32;
  }
`;

export const CryptoDropdown = styled.select`
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #4caf50;
  font-size: 1.1rem;
  color: #4caf50;
  background: white;
`;

export const ConfirmButton = styled(motion.button)`
  position: absolute;
  bottom: 15px;
  right: 15px;
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


export const FinalMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

export const FinalMessage = styled.span`
  font-weight: bold;
  color: #4caf50;
`;

