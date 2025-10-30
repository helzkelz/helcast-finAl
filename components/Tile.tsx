
import React from 'react';
import { motion } from 'framer-motion';
import { TileData } from '../types';
import { LETTER_SCORES } from '../constants';

interface TileProps {
  tile: TileData;
  isSelected: boolean;
}

const Tile = React.forwardRef<HTMLDivElement, TileProps>(({ tile, isSelected }, ref) => {
  const { letter, multiplier } = tile;
  const score = LETTER_SCORES[letter] || 0;

  const baseClasses = "relative w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all duration-200 no-select";
  const selectedClasses = "bg-coral-bright ring-2 ring-coral-bright shadow-[0_0_15px_rgba(255,138,117,0.9)] scale-110 z-10";
  const defaultClasses = "bg-coral text-dark-bg shadow-lg hover:scale-105";

  const multiplierClasses: { [key: string]: string } = {
    'DL': 'bg-teal text-white',
    '2X': 'bg-teal text-white',
    '3X': 'bg-teal text-white animate-glow',
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`${baseClasses} ${isSelected ? selectedClasses : defaultClasses}`}
      whileTap={{ scale: 1.2 }}
    >
      <span className="absolute top-1 right-2 text-xs font-bold opacity-80">{score}</span>
      <span className="text-3xl sm:text-4xl font-black tracking-wider">{letter}</span>
      {multiplier && (
        <div className={`absolute bottom-0 left-0 right-0 text-center text-xs font-bold py-0.5 rounded-b-md ${multiplierClasses[multiplier] || ''}`}>
          {multiplier}
        </div>
      )}
    </motion.div>
  );
});

export default Tile;
