import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ParticleEffect = ({ trigger, type = 'confetti' }) => {
  const particles = Array.from({ length: 30 }, (_, i) => i);

  const colors = type === 'confetti' 
    ? ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#fbbf24']
    : ['#3b82f6', '#10b981'];

  useEffect(() => {
    // Reset animation when trigger changes
  }, [trigger]);

  return (
    <div className="particle-container" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 9999 }}>
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="particle"
          initial={{
            x: '50%',
            y: '50%',
            opacity: 0,
            scale: 0
          }}
          animate={trigger ? {
            x: `${50 + (Math.random() * 200 - 100)}%`,
            y: `${50 + (Math.random() * 200 - 100)}%`,
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0],
            rotate: Math.random() * 360
          } : {}}
          transition={{
            duration: 2,
            delay: Math.random() * 0.5,
            ease: 'easeOut'
          }}
          style={{
            position: 'absolute',
            width: '10px',
            height: '10px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            borderRadius: type === 'confetti' ? '2px' : '50%',
            boxShadow: '0 0 10px currentColor'
          }}
        />
      ))}
    </div>
  );
};

export default ParticleEffect;

