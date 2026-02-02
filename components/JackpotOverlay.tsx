
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  type: 'SHARK' | 'WHALE' | 'NORMAL' | null;
  amount: number;
  onComplete: () => void;
}

const JackpotOverlay: React.FC<Props> = ({ type, amount, onComplete }) => {
  const [displayAmount, setDisplayAmount] = useState(0);

  useEffect(() => {
    if (!type) return;
    
    // Count up animation
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayAmount(Math.floor(amount * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);

    const timer = setTimeout(onComplete, 5000);
    return () => clearTimeout(timer);
  }, [type, amount, onComplete]);

  if (!type) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm"
      >
        {/* Fullscreen Flash Effect */}
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="absolute inset-0 bg-white pointer-events-none"
        />

        {type === 'SHARK' && (
           <motion.div
            initial={{ x: '-100vw', rotate: -10 }}
            animate={{ x: '100vw', rotate: 10 }}
            transition={{ duration: 3, ease: "linear" }}
            className="absolute text-[20rem] z-10 opacity-80"
           >
             🦈
           </motion.div>
        )}

        {type === 'WHALE' && (
           <motion.div
            initial={{ scale: 0.5, y: 100, opacity: 0 }}
            animate={{ scale: 1.5, y: -100, opacity: 0.8 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute text-[25rem] z-10"
           >
             🐋
           </motion.div>
        )}

        <div className="text-center z-20 space-y-4">
          <motion.h1 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-8xl md:text-9xl font-black font-arcade uppercase jackpot-glow tracking-tighter ${
              type === 'SHARK' ? 'text-red-500' : 'text-cyan-400'
            }`}
          >
            {type === 'SHARK' ? 'JACKPOT!!' : 'BIG WIN!!'}
          </motion.h1>

          <motion.div 
             className="text-6xl md:text-7xl font-bold font-arcade text-yellow-400"
          >
            {displayAmount.toLocaleString()} 코인
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-2xl text-white font-bold bg-white/10 px-6 py-2 rounded-full"
          >
             {type === 'SHARK' ? '전설의 상어 출현!' : '심해의 거대 고래 당첨!'}
          </motion.div>
        </div>

        {/* Floating coins particle effect (simplified) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: '110vh', x: `${Math.random() * 100}vw` }}
              animate={{ y: '-10vh' }}
              transition={{ duration: Math.random() * 2 + 1, repeat: Infinity, delay: Math.random() * 2 }}
              className="text-4xl absolute"
            >
              💰
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JackpotOverlay;
