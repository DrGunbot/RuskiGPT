import React, { useState } from 'react';
import { Nav, NavTitle, NavLinks, NavItem, NavLinkStyle, Hamburger, HamburgerLine } from '../assets/styling/navbar/NavBar.styles';
import { Web3Button } from '@web3modal/react';
import { Web3Modal } from '@web3modal/react';
import { menuVariants, navTitleVariants, navItemVariants, hamburgerLineVariants } from '../assets/animation/navbar/NavBar.variants';
import { AnimatePresence } from 'framer-motion';

const NavBar = ({ projectId, ethereumClient }) => {
  const [isopen, setisopen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const handleHamburgerClick = () => {
    setisopen(!isopen);
  };

  const handleLinkClick = () => {
    setisopen(false);
  };

  return (
    <Nav>
      <NavTitle
        initial={false}
        whileHover={navTitleVariants.hover}
      >
        ChatGPT разблокирован
      </NavTitle>
      <AnimatePresence>
        {isopen && (
          <NavLinks
            initial="closed"
            animate={isopen ? "open" : "closed"}
            exit="closed"
            variants={menuVariants}
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
                News
              </NavLinkStyle>
            </NavItem>
            <NavItem
              variants={navItemVariants}
              whileHover={navItemVariants.hover}
              whileTap={{ scale: 0.9 }}
            >
              <NavLinkStyle to="/prices" onClick={handleLinkClick}>
                Prices
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
      />
      <Hamburger
        onClick={handleHamburgerClick}
        initial={false}
        animate={isopen ? "open" : "closed"}
      >
        <HamburgerLine
          variants={hamburgerLineVariants}
          isopen={isopen ? "true" : "false"}
        />
        <HamburgerLine
          variants={hamburgerLineVariants}
          isopen={isopen ? "true" : "false"}
        />
        <HamburgerLine
          variants={hamburgerLineVariants}
          isopen={isopen ? "true" : "false"}
        />
      </Hamburger>
    </Nav>
  );
};

export default NavBar;
