import React from "react";
import { motion } from "framer-motion";
import styled from "@emotion/styled";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-height: 100vh;
  padding: 0 30px;
`;

const Title = styled(motion.h1)`
  color: #2196f3;
  font-size: 3rem;
  margin-bottom: 20px;
  cursor: pointer;
`;

const Paragraph = styled(motion.p)`
  color: #2196f3;
  font-size: 1.5rem;
  margin-bottom: 30px;
  cursor: pointer;
`;

const Button = styled(motion.button)`
  background-color: #2196f3;
  color: white;
  font-size: 2rem;
  padding: 20px 40px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  }
`;

const textVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  hover: { scale: 1.1, color: "#42a5f5" },
};

const SupportPage = () => {
  const handleClick = () => {
    window.open("https://t.me/gptrusupport", "_blank");
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 1.5, repeat: Infinity },
    },
  };

  return (
    <Container>
      <Title
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={textVariants}
        transition={{ duration: 1 }}
      >
        Страница поддержки
      </Title>
      <Paragraph
        initial="hidden"
        animate="visible"
        whileHover="hover"
        variants={textVariants}
        transition={{ duration: 1, delay: 0.5 }}
      >
        Если у вас возникнут какие-либо вопросы или вам потребуется помощь, наша дружелюбная служба поддержки всегда готова помочь вам. Присоединяйтесь к нашей группе поддержки в Telegram, где вы сможете задавать вопросы, находить ответы и общаться с другими пользователями, которые могут столкнуться с подобными проблемами. Мы всегда здесь, чтобы помочь вам и сделать ваш опыт работы с нашим сервисом максимально комфортным!
      </Paragraph>
      <Button
        whileHover="hover"
        whileTap="tap"
        initial="pulse"
        animate="pulse"
        variants={buttonVariants}
        onClick={handleClick}
        >
          Присоединяйтесь к нашей группе поддержки
        </Button>
      </Container>
    );
  };
  
  export default SupportPage;
  
