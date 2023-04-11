import styled from 'styled-components';
import { motion } from 'framer-motion';

export const MinimizedChatbot = styled(motion.button)`
  position: fixed;
  bottom: 2px;
  right: 2px;
  width: 60px;
  height: 60px;
  background-color: darkgray;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  outline: none;
  transition: background-color 0.3s;

  &:hover {
    background-color: gray;
  }
`;

export const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${({ user }) => (user ? 'flex-end' : 'flex-start')};
  margin-bottom: 10px;
`;

export const ChatContainer = styled(motion.div)`
  position: fixed;
  bottom: ${({ size }) => (size === 'small' ? '0px' : size === 'medium' ? '10%' : '0')};
  right: ${({ size }) => (size === 'small' ? '-7px' : size === 'medium' ? '10%' : '0')};
  width: ${({ size }) => (size === 'small' ? '300px' : size === 'medium' ? '80%' : '100%')};
  height: ${({ size }) => (size === 'small' ? '400px' : size === 'medium' ? '80%' : '100%')};
  background-color: #222;
  border-radius: ${({ size }) => (size === 'small' ? '10px' : '0')};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const Header = styled.header`
  background-color: #333;
  padding: 10px;
  display: flex;
  align-items: center;
`;

export const ButtonContainer = styled.div`
  display: flex;
  margin-right: 10px;
`;

export const ControlButton = styled.button`
  width: 20px;
  height: 20px;
  background-color: ${({ red, yellow, green }) =>
    red ? '#f44336' : yellow ? '#ffeb3b' : green ? '#4caf50' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  outline: none;
  margin-right: 5px;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const TypingStatus = styled.div`
  font-size: 14px;
  color: #ddd;
  display: flex;
  align-items: center;

  &:before {
    content: '';
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: #4caf50;
    border-radius: 50%;
    margin-right: 5px;
  }
`;

export const MessageList = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

export const MessageContent = styled.div`
  background-color: ${({ user }) => (user ? '#4caf50' : '#333')};
  color: #fff;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 70%;
  word-break: break-word;
`;

export const InputBar = styled.form`
  
background-color: #333;
padding: ${({ size }) => (size === 'small' ? '10px' : size === 'medium' ? '15px' : '20px')};
display: flex;

`;

export const UserInput = styled.input`
flex-grow: 1;
background-color: #222;
color: #fff;
padding: 8px 12px;
border: none;
border-radius: 12px;
outline: none;
font-size: 14px;
`;

export const SendButton = styled.button`
background-color: #4caf50;
color: #fff;
font-size: 14px;
padding: 8px 12px;
margin-left: 10px;
border: none;
border-radius: 12px;
cursor: pointer;
outline: none;
transition: background-color 0.3s;

&:hover {
  background-color: #3e8e41;
}
`;