import React, { useState } from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";
import logo from "../assets/images/homepage/logo.png";

const ContainerHomePage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ImageHomePage = styled(motion.img)`
  max-width: 100%;
  max-height: 100%;
  z-index: 0;
`;

const Home = () => {
  const [animation, setAnimation] = useState(0);

  const animations = [
    { scale: 0.5 },
    { borderRadius: "50%" },
    { rotate: 360 },
    { x: -100 },
    { y: 100 },
    { skewX: 30 },
    { filter: "invert(100%)" },
    { scale: 1.2, transition: { duration: 0.5, yoyo: Infinity, ease: "easeInOut" } },
    { scale: 1, borderRadius: 0, rotate: 0, x: 0, y: 0, skewX: 0, filter: "none" },
    { scale: 0.8, x: 50, y: -50, transition: { duration: 0.5, ease: "backInOut" } },
    { scale: 1.1, rotate: 45, transition: { duration: 0.5, ease: "easeOut" } },
    { scale: 1, borderRadius: "50%", transition: { duration: 0.5, ease: "easeInOut" } },
    { scale: 1.2, skewX: 30, transition: { duration: 0.5, ease: "easeInOut" } },
    { scale: 0.5, y: -100, transition: { duration: 0.5, ease: "easeInOut" } },
    { x: [0, -100, 100, 0], y: [0, 100, -100, 0], transition: { duration: 1, repeat: Infinity } },
    { x: [0, 100, 0], y: [0, 0, -100], transition: { duration: 0.5, ease: "easeOut" } },
    { drag: true, transition: { duration: 0.5 } },
    { rotateX: 360, transition: { duration: 0.5, ease: "easeInOut" } },
    { rotateY: 360, transition: { duration: 0.5, ease: "easeInOut" } },
    { perspective: 200, rotateY: 180, transition: { duration: 0.5, ease: "easeInOut" } },
  ];

  const handleAnimation = () => {
    const newAnimation = Math.floor(Math.random() * animations.length);
    setAnimation(newAnimation);
  };

  return (
    <ContainerHomePage>
      <ImageHomePage
        src={logo}
        alt="Chat Logo"
        animate={animations[animation]}
        onClick={handleAnimation}
      />
    </ContainerHomePage>
  );
};

export default Home;
