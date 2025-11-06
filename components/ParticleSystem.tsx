import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ParticleEffect } from '../types';

interface ParticleSystemProps {
  particles: ParticleEffect[];
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 0.5
            }}
            animate={{
              y: particle.y - 100,
              opacity: 0,
              scale: 1.5
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2,
              ease: 'easeOut'
            }}
            className={`absolute font-bold text-2xl pointer-events-none ${
              particle.type === 'score' ? 'text-coral' :
              particle.type === 'combo' ? 'text-teal' :
              particle.type === 'achievement' ? 'text-purple' :
              'text-accent'
            }`}
            style={{
              color: particle.color,
              textShadow: '0 0 10px rgba(0,0,0,0.5)'
            }}
          >
            {particle.type === 'score' && '+'}
            {particle.value}
            {particle.type === 'combo' && '!'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ParticleSystem;