export interface Game {
  id: number;
  title: string;
  imageUrl: string; // Changed from filename to imageUrl for web compatibility
  url: string;
}

export interface GameCardProps {
  game: Game;
}