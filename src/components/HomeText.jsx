import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: none;
  position: relative;
`;

const useLetterColor = () => {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ["#FFF", "#F00", "#FFF", "#00FFFF"];

  const nextColor = () => {
    setColorIndex((colorIndex + 1) % colors.length);
  };

  return { color: colors[colorIndex], nextColor };
};

const Letter = ({ char }) => {
  const { color, nextColor } = useLetterColor();

  return (
    <motion.span
      style={{ color }}
      initial={false}
      animate={{ color }}
      transition={{ duration: 1 }}
      onMouseEnter={nextColor}
      onTouchStart={nextColor}
      onTouchEnd={nextColor}
      whileHover={{ scale: 1.2, skewX: 10 }}
    >
      {char}
    </motion.span>
  );
};

const pageVariants = {
  initial: {
    y: 100,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

const RandomWords = () => {
  const loremIpsum =
    "Легко общайтесь с GPT-4 прямо из России. Чтобы начать, подключите свой кошелек через меню в правом верхнем углу, купите кредиты, а затем откройте чат в правом нижнем углу!";

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
    >
      <Container>
        <motion.h1
          style={{ color: 'white', fontSize: '72px', textAlign: 'center' }}
        >
          {Array.from(loremIpsum).map((char, index) => (
            <Letter key={index} char={char} />
          ))}
        </motion.h1>
      </Container>
    </motion.div>
  );
};

export default RandomWords;
