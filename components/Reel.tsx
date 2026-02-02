
import React from 'react';
import { motion } from 'framer-motion';
import { SymbolType } from '../types';
import { SYMBOLS, ROW_COUNT } from '../constants';

interface Props {
  symbols: SymbolType[];
  isSpinning: boolean;
  delay: number;
  columnIndex: number;
  winningIndices: number[];
}

const Reel: React.FC<Props> = ({ symbols, isSpinning, delay, columnIndex, winningIndices }) => {
  return (
    <div className="relative h-full w-full bg-blue-900/40 border-x border-blue-400/30 overflow-hidden flex flex-col items-center justify-around">
      <motion.div
        animate={isSpinning ? {
          y: [0, -2000],
        } : {
          y: 0,
        }}
        transition={isSpinning ? {
          duration: 0.5,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        } : {
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        className={`flex flex-col gap-4 py-4 ${isSpinning ? 'reel-blur' : ''}`}
      >
        {/* We repeat symbols to create a loop effect during spin */}
        {[...symbols, ...symbols, ...symbols].map((type, idx) => {
          // Only the first set of symbols (the actual result) should be checked for wins
          const isActualResult = idx < ROW_COUNT;
          const flatIndex = idx * 5 + columnIndex;
          const isWinner = !isSpinning && isActualResult && winningIndices.includes(flatIndex);
          const sym = SYMBOLS[type];

          return (
            <motion.div 
              key={idx}
              initial={false}
              animate={isWinner ? {
                scale: [1, 1.25, 1.15],
                rotate: [0, 5, -5, 0],
                filter: ["drop-shadow(0 0 0px #fff)", "drop-shadow(0 0 15px #fff)", "drop-shadow(0 0 5px #fff)"]
              } : {
                scale: 1,
                rotate: 0,
                filter: "drop-shadow(0 0 0px #fff)"
              }}
              transition={isWinner ? {
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse"
              } : { duration: 0.2 }}
              className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br ${sym.color} flex items-center justify-center text-5xl md:text-6xl shadow-xl border-2 ${isWinner ? 'border-yellow-400 z-30' : 'border-white/20'} relative group`}
            >
              <div className={`absolute inset-0 bg-white/10 rounded-2xl transition-opacity ${isWinner ? 'opacity-40 animate-pulse' : 'opacity-0 group-hover:opacity-100'}`} />
              <span className={`drop-shadow-lg ${isWinner ? 'animate-bounce' : ''}`}>{sym.icon}</span>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default Reel;
