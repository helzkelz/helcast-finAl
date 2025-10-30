
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LETTER_SCORES, BONUS_POINTS } from '../constants';
import { XIcon } from './icons';

interface ScoringGuideProps {
  onClose: () => void;
}

const ScoringGuide: React.FC<ScoringGuideProps> = ({ onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-medium-gray rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative shadow-2xl border border-light-gray"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-3xl font-black text-coral mb-6 text-center">Scoring Guide</h2>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-teal mb-3">Letter Values</h3>
            <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 text-center">
              {Object.entries(LETTER_SCORES).map(([letter, score]) => (
                <div key={letter} className="bg-light-gray p-2 rounded-md">
                  <span className="font-bold text-lg">{letter}</span>
                  <span className="text-xs text-coral"> {score}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-teal mb-3">Multipliers</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-3"><div className="w-10 text-center font-bold bg-teal text-white rounded-md px-2 py-1">DL</div> Double Letter Score</li>
              <li className="flex items-center gap-3"><div className="w-10 text-center font-bold bg-teal text-white rounded-md px-2 py-1">2X</div> Double Word Score</li>
              <li className="flex items-center gap-3"><div className="w-10 text-center font-bold bg-teal text-white rounded-md px-2 py-1">3X</div> Triple Word Score</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-teal mb-3">Bonuses</h3>
            <ul className="space-y-2">
              <li><span className="font-bold text-coral">+{BONUS_POINTS.LENGTH_5_6} pts</span> for 5-6 letter words</li>
              <li><span className="font-bold text-coral">+{BONUS_POINTS.LENGTH_7_8} pts</span> for 7-8 letter words</li>
              <li><span className="font-bold text-coral">+{BONUS_POINTS.LENGTH_9_PLUS} pts</span> for words 9+ letters long (LONG WORD!)</li>
              <li><span className="font-bold text-coral">+{BONUS_POINTS.RARE_LETTER_COMBO} pts</span> for using 2+ rare letters (J, X, Q, Z)</li>
              <li><span className="font-bold text-coral">+{BONUS_POINTS.PERFECT_SWEEP} pts</span> for using all 16 letters</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ScoringGuide;
