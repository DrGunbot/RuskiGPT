import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Star = styled(motion.div)`
  position: absolute;
  background-color: white;
  border-radius: 50%;
`;



const Background = () => {
    const [stars, setStars] = useState([]);
  
    useEffect(() => {
      createStars();
    }, []);
  
    const createStars = () => {
      const tempStars = [];
      for (let i = 0; i < 100; i++) {
        tempStars.push({
          id: i,
          size: Math.random() * 2,
          top: Math.random() * 100 + 'vh',
          left: Math.random() * 100 + 'vw',
          duration: Math.random() * 1 + 0.5,
        });
      }
      setStars(tempStars);
    };
  
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: 'black',
          zIndex: -1,
        }}
      >
        {stars.map((star) => (
          <Star
            key={star.id}
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: star.duration,
              repeatType: 'loop',
              repeatDelay: Math.random() * 2,
            }}
          />
        ))}
        
      </div>
    );
  };
  
  export default Background;
  