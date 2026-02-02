
import { SymbolType, SymbolDef } from './types';

export const SYMBOLS: Record<SymbolType, SymbolDef> = {
  [SymbolType.SHARK]: {
    type: SymbolType.SHARK,
    label: '상어',
    icon: '🦈',
    color: 'from-red-600 to-yellow-500',
    multiplier: [0, 0, 100, 500, 2000] // Extremely high volatility payoff
  },
  [SymbolType.WHALE]: {
    type: SymbolType.WHALE,
    label: '고래',
    icon: '🐋',
    color: 'from-blue-600 to-cyan-400',
    multiplier: [0, 0, 50, 200, 1000]
  },
  [SymbolType.TURTLE]: {
    type: SymbolType.TURTLE,
    label: '거북이',
    icon: '🐢',
    color: 'from-green-600 to-lime-400',
    multiplier: [0, 0, 20, 80, 300]
  },
  [SymbolType.JELLYFISH]: {
    type: SymbolType.JELLYFISH,
    label: '해파리',
    icon: '🪼',
    color: 'from-purple-600 to-pink-400',
    multiplier: [0, 0, 10, 40, 150]
  },
  [SymbolType.STARFISH]: {
    type: SymbolType.STARFISH,
    label: '불가사리',
    icon: '⭐',
    color: 'from-yellow-500 to-orange-400',
    multiplier: [0, 0, 5, 15, 60]
  },
  [SymbolType.SHELL]: {
    type: SymbolType.SHELL,
    label: '조개',
    icon: '🐚',
    color: 'from-slate-400 to-slate-200',
    multiplier: [0, 0, 2, 8, 30]
  }
};

// 20 Paylines for a 5x3 grid
export const PAYLINES = [
  [0, 1, 2, 3, 4], // Row 0
  [5, 6, 7, 8, 9], // Row 1
  [10, 11, 12, 13, 14], // Row 2
  [0, 6, 12, 8, 4], // V shape
  [10, 6, 2, 8, 14], // Inverse V
  [0, 1, 7, 3, 4], // Zig zag
  [10, 11, 7, 13, 14],
  [5, 1, 2, 3, 9],
  [5, 11, 12, 13, 9],
  [0, 6, 7, 8, 4],
  [10, 6, 7, 8, 14],
  [0, 1, 7, 13, 14],
  [10, 11, 7, 1, 2],
  [5, 1, 0, 1, 5],
  [5, 11, 10, 11, 5],
  [0, 6, 2, 6, 0],
  [10, 6, 14, 6, 10],
  [2, 7, 12, 7, 2],
  [12, 7, 2, 7, 12],
  [4, 8, 12, 8, 4]
];

export const REEL_COUNT = 5;
export const ROW_COUNT = 3;
export const SPIN_DURATION = 1500; // ms
export const INITIAL_BALANCE = 10000;
export const DEFAULT_BET = 100;
