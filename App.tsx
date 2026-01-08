import React from 'react';
import { GAMES } from './constants';
import { GameCard } from './components/GameCard';
import { Gamepad2 } from 'lucide-react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center bg-fixed bg-no-repeat relative">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm z-0"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 md:py-12 flex-grow flex flex-col">
        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600/20 rounded-full mb-4 border border-indigo-500/30">
            <Gamepad2 className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-4 tracking-tight drop-shadow-sm">
            Pragmatic
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Jump straight into your favorite games.
          </p>
        </header>

        {/* Game Grid */}
        <main className="flex-grow flex items-center justify-center">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
            {GAMES.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-16 text-center text-slate-500 text-sm py-6 border-t border-slate-800/50">
          <p>&copy; {new Date().getFullYear()} Pragmatic. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;