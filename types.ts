
export enum SymbolType {
  SHARK = 'SHARK',
  WHALE = 'WHALE',
  TURTLE = 'TURTLE',
  JELLYFISH = 'JELLYFISH',
  STARFISH = 'STARFISH',
  SHELL = 'SHELL'
}

export interface SymbolDef {
  type: SymbolType;
  label: string;
  icon: string;
  color: string;
  multiplier: number[];
}

export interface WinLine {
  indices: number[];
  type: SymbolType;
  count: number;
  amount: number;
}

export interface UserAccount {
  id: string;
  password?: string;
  balance: number;
  createdAt: number;
}

export interface GameState {
  user: UserAccount | null;
  bet: number;
  reels: SymbolType[][];
  isSpinning: boolean;
  lastWin: number;
  isAuto: boolean;
  showJackpot: 'SHARK' | 'WHALE' | 'NORMAL' | null;
  winningIndices: number[];
  rtp: number;
  volatility: number;
}
