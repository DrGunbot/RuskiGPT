import React, { useState } from 'react';
import { Nav, NavLinks, NavItem, NavLinkStyle } from '../assets/styling/navbar/NavBar.styles';
import { Web3Button } from '@web3modal/react';
import { Web3Modal } from '@web3modal/react';
import { menuVariants, navItemVariants } from '../assets/animation/navbar/NavBar.variants';
import { AnimatePresence } from 'framer-motion';
import openAIImage from '../assets/images/homepage/openAI.png';
import axios from 'axios';

const NavBar = ({ projectId, ethereumClient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
              домашняя страница
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/contact" onClick={handleLinkClick}>
              связаться
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/buy" onClick={handleLinkClick}>
              Купить кредиты
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <Web3Button onClick={() => setModalOpen(true)}>
                Connect Wallet
              </Web3Button>
            </NavItem>
          </NavLinks>
        )}
      </AnimatePresence>
      <Web3Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        projectId={projectId}
        ethereumClient={ethereumClient}
        themeVariables={{
          '--w3m-font-family': 'Rubik, sans-serif',
          '--w3m-accent-color': '#378805',
          '--w3m-background-color': '#202121',
        }}
        onConnect={handleWalletConnect}
      />
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
