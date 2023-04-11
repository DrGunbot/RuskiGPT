import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Main navigation container
export const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);
  color: #50ae55;
  font-size: 2rem;
`;

// Navigation title
export const NavTitle = styled(motion.h1)`
  margin: 0;
  cursor: pointer;
  font-size: 2rem;
  font-weight: bold;
`;

// Navigation links container
export const NavLinks = styled(motion.ul)`
  list-style: none;
  margin: 0;
  padding: 0;
  position: fixed;
  top: 0;
  right: 0;
  width: 30%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
`;

// Individual navigation item
export const NavItem = styled(motion.li)`
  margin: 1rem;
  padding: 1rem;
  font-size: 2rem;
`;

// Navigation link
export const NavLinkStyle = styled(NavLink)`
  text-decoration: none;
  color: #50ae55;
  font-weight: bold;
  font-size: 2rem;
  &:hover {
    color: white;
  }
  &.active {
    color: white;
  }
`;

// Hamburger menu button
export const Hamburger = styled(motion.div)`
  width: 30px;
  height: 5px;
  background-color: #50ae55;
  position: relative;
  cursor: pointer;
  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    background-color: #50ae55;
  }
  &:before {
    top: -10px;
  }
  &:after {
    top: 10px;
  }
`;

// Hamburger menu button lines
export const HamburgerLine = styled(motion.div)`
  width: 100%;
  height: 5px;
  background-color: #50ae55;
  &:nth-child(1) {
    top: ${props => (props.isopen ? "0" : "-10px")};
  }
  &:nth-child(2) {
    top: 0;
  }
  &:nth-child(3) {
    top: ${props => (props.isopen ? "0" : "10px")};
  }
  position: absolute;
`;


export const ConnectWeb3Button = styled.button`
  display: flex;
  background-color: #50ae55;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #3c8f47;
  }
`;