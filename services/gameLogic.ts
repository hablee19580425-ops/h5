
import { SymbolType, WinLine } from '../types';
import { SYMBOLS, PAYLINES, ROW_COUNT, REEL_COUNT } from '../constants';

// Dynamic weight calculation based on RTP and Volatility
export const getDynamicWeights = (rtp: number, volatility: number): Record<SymbolType, number> => {
  // Base weights for 100% RTP Medium Volatility
  const baseWeights: Record<SymbolType, number> = {
    [SymbolType.SHARK]: 1,
    [SymbolType.WHALE]: 3,
    [SymbolType.TURTLE]: 10,
    [SymbolType.JELLYFISH]: 15,
    [SymbolType.STARFISH]: 25,
    [SymbolType.SHELL]: 55
  };

  const rtpMultiplier = rtp / 100;
  // Volatility adjustment: 1 is low (spread out), 10 is high (skewed to top and bottom)
  const volFactor = volatility / 5;

  const adjustedWeights: Record<SymbolType, number> = { ...baseWeights };

  // Adjust high value symbols based on RTP
  adjustedWeights[SymbolType.SHARK] *= rtpMultiplier;
  adjustedWeights[SymbolType.WHALE] *= rtpMultiplier;

  // Volatility logic: 
  // Higher volatility makes high symbols even rarer but their payouts are huge (payouts fixed in constants, so we just make them rarer here)
  // Low volatility makes everyone more similar in weight.
  if (volatility > 5) {
     const rarityPower = 1 + (volatility - 5) * 0.2;
     adjustedWeights[SymbolType.SHARK] /= rarityPower;
     adjustedWeights[SymbolType.WHALE] /= (rarityPower * 0.8);
     adjustedWeights[SymbolType.SHELL] *= rarityPower; // More trash hits
  } else if (volatility < 5) {
     const equalization = (5 - volatility) * 2;
     adjustedWeights[SymbolType.SHARK] += equalization;
     adjustedWeights[SymbolType.WHALE] += equalization;
     adjustedWeights[SymbolType.SHELL] -= (equalization * 2);
  }

  return adjustedWeights;
};

export const getRandomSymbol = (rtp: number, volatility: number): SymbolType => {
  const weights = getDynamicWeights(rtp, volatility);
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  
  let rand = Math.random() * totalWeight;
  const types = Object.keys(weights) as SymbolType[];
  for (const type of types) {
    if (rand < weights[type]) return type;
    rand -= weights[type];
  }
  return SymbolType.SHELL;
};

export const generateReels = (rtp: number = 100, volatility: number = 5): SymbolType[][] => {
  const reels: SymbolType[][] = [];
  for (let i = 0; i < REEL_COUNT; i++) {
    const reel: SymbolType[] = [];
    for (let j = 0; j < ROW_COUNT; j++) {
      reel.push(getRandomSymbol(rtp, volatility));
    }
    reels.push(reel);
  }
  return reels;
};

export const calculateWins = (reels: SymbolType[][], bet: number): WinLine[] => {
  const wins: WinLine[] = [];
  
  const getSymbolAt = (row: number, col: number) => reels[col][row];

  PAYLINES.forEach((lineIndices) => {
    const firstSymbol = getSymbolAt(Math.floor(lineIndices[0] / 5), lineIndices[0] % 5);
    let count = 1;
    for (let i = 1; i < lineIndices.length; i++) {
      const row = Math.floor(lineIndices[i] / 5);
      const col = lineIndices[i] % 5;
      if (getSymbolAt(row, col) === firstSymbol) {
        count++;
      } else {
        break;
      }
    }

    if (count >= 3) {
      const multiplier = SYMBOLS[firstSymbol].multiplier[count - 1];
      if (multiplier > 0) {
        wins.push({
          indices: lineIndices.slice(0, count),
          type: firstSymbol,
          count,
          amount: (bet / 20) * multiplier 
        });
      }
    }
  });

  return wins;
};

export const formatKoreanCurrency = (val: number): string => {
  if (val >= 100000000) {
    const eok = Math.floor(val / 100000000);
    const man = Math.floor((val % 100000000) / 10000);
    return `${eok}억 ${man > 0 ? man + '만' : ''} 코인`;
  }
  if (val >= 10000) {
    const man = Math.floor(val / 10000);
    const rest = val % 10000;
    return `${man}만 ${rest > 0 ? rest.toLocaleString() : ''} 코인`;
  }
  return `${val.toLocaleString()} 코인`;
};
