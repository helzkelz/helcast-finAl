
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface WordPreviewProps {
  word: string;
  isVerifying: boolean;
}

const WordPreview: React.FC<WordPreviewProps> = ({ word, isVerifying }) => {
  return (
    <div className="h-16 w-full max-w-md bg-medium-gray rounded-lg flex items-center justify-center text-3xl font-black tracking-widest relative overflow-hidden">
      <AnimatePresence>
        {word.split('').map((letter, index) => (
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.1, delay: index * 0.02 }}
            className="inline-block text-coral"
          >
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
      {isVerifying && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default WordPreview;
