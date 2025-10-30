
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface BonusBannerProps {
  text: string | null;
}

const BonusBanner: React.FC<BonusBannerProps> = ({ text }) => {
  return (
    <AnimatePresence>
      {text && (
        <motion.div
          initial={{ scale: 0.5, y: -50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.5, y: 50, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
        >
          <div className="bg-gradient-to-r from-teal to-coral p-4 rounded-lg shadow-2xl">
            <h2 className="text-4xl font-black text-white animate-sparkle tracking-wider drop-shadow-lg">
              {text}
            </h2>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BonusBanner;
