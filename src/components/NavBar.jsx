import React, { useState, useEffect } from 'react';
import { Nav, NavLinks, NavItem, NavLinkStyle } from '../assets/styling/navbar/NavBar.styles';
import { Web3Button, useWeb3Modal } from '@web3modal/react';
import { menuVariants, navItemVariants } from '../assets/animation/navbar/NavBar.variants';
import { AnimatePresence } from 'framer-motion';
import openAIImage from '../assets/images/homepage/openAI.png';
import axios from 'axios';

const NavBar = ({ projectId, ethereumClient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { connect, disconnect, isConnected, provider } = useWeb3Modal();

  useEffect(() => {
    if (isConnected) {
      const walletAddress = provider.selectedAddress;
      handleWalletConnect(walletAddress);
    }
  }, [isConnected, provider]);

  const handleHamburgerClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleWalletConnect = async (walletAddress) => {
    try {
      const response = await axios.post('/api/addWallet', { walletAddress });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error adding wallet address:', error.message);
    }
  };

  const handleModalConnect = async () => {
    await connect();
    setModalOpen(false);
  };

  const handleModalClose = () => {
    if (isConnected) {
      disconnect();
    }
    setModalOpen(false);
  };

  return (
    <Nav>
      <AnimatePresence>
        {isOpen && (
          <NavLinks
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            onCloseComplete={() => setIsOpen(false)}
          >
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/" onClick={handleLinkClick} exact>
                Home
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/news" onClick={handleLinkClick}>
                Contact
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/buy" onClick={handleLinkClick}>
                Buy
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <Web3Button onClick={() => setModalOpen(true)}>
                {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
              </Web3Button>
            </NavItem>
          </NavLinks>
        )}
      </AnimatePresence>
      {modalOpen && (
        <div>
          <button onClick={handleModalConnect}>Connect</button>
          <button onClick={handleModalClose}>Close</button>
        </div>
      )}
      <img
        src={openAIImage}
        onClick={handleHamburgerClick}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        transition={{ duration: 0.3 }}
        alt="OpenAI Logo"
        style={{
          cursor: 'pointer',
          width: '40px',
          height: '40px',
          zIndex: '0',
        }}
      />
    </Nav>
  );
};

export default NavBar;
