import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface WordPreviewProps {
  word: string;
  isVerifying: boolean;
}

const WordPreview: React.FC<WordPreviewProps> = ({ word, isVerifying }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="h-20 w-full max-w-lg backdrop-blur-sm bg-glass border border-card-border rounded-2xl flex items-center justify-center text-4xl font-black tracking-widest relative overflow-hidden shadow-glass-sm"
    >
      <AnimatePresence mode="wait">
        {word ? (
          <motion.div
            key="word"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-1"
          >
            {word.split('').map((letter, index) => (
              <motion.span
                key={`${letter}-${index}`}
                initial={{ y: 20, opacity: 0, scale: 0.8 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -20, opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.03,
                  type: 'spring',
                  stiffness: 300
                }}
                className="inline-block bg-gradient-to-b from-coral to-coral-bright bg-clip-text text-transparent drop-shadow-sm"
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        ) : (
          <motion.span
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-text-muted text-lg"
          >
            Drag letters to form words
          </motion.span>
        )}
      </AnimatePresence>

      {isVerifying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 backdrop-blur-sm bg-dark-bg/80 flex items-center justify-center rounded-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin"></div>
            <span className="text-coral font-semibold">Validating...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WordPreview;
