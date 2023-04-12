import React from 'react';
import { Modal, ProgressBar } from 'react-bootstrap';
import { AnimatePresence, motion } from 'framer-motion';

const CryptoTransactionProgressModal = ({ show, onHide, progress, error }) => {
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <Modal
            show={show}
            onHide={onHide}
            centered
            aria-labelledby="crypto-transaction-progress-modal"
          >
            <Modal.Header closeButton>
              <Modal.Title id="crypto-transaction-progress-modal">
                Transaction Progress
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {error ? (
                <div>
                  <p>Transaction failed. Please try again.</p>
                  <p>Error message: {error}</p>
                </div>
              ) : (
                <div>
                  <p>Processing transaction...</p>
                  <ProgressBar now={progress} label={`${progress}%`} />
                </div>
              )}
            </Modal.Body>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CryptoTransactionProgressModal;
