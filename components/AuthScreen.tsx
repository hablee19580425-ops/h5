
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';
import { UserAccount } from '../types';

interface Props {
  onLogin: (user: UserAccount) => void;
  onOpenAdmin: () => void;
}

const AuthScreen: React.FC<Props> = ({ onLogin, onOpenAdmin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');

  const handleAction = () => {
    if (!id || !pw) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    const savedUsers = JSON.parse(localStorage.getItem('arcade_users') || '{}');

    if (isRegister) {
      if (savedUsers[id]) {
        setError('이미 존재하는 아이디입니다.');
      } else {
        const newUser: UserAccount = {
          id,
          password: pw,
          balance: 10000, 
          createdAt: Date.now()
        };
        savedUsers[id] = newUser;
        localStorage.setItem('arcade_users', JSON.stringify(savedUsers));
        onLogin(newUser);
      }
    } else {
      const user = savedUsers[id];
      if (user && user.password === pw) {
        onLogin(user);
      } else {
        setError('아이디 또는 비밀번호가 틀렸습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black">
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border-2 border-cyan-500/30 rounded-[2.5rem] shadow-[0_0_80px_rgba(6,182,212,0.15)] overflow-hidden"
      >
        <div className="p-8 text-center border-b border-white/5 bg-white/5">
          <motion.h1 
            animate={{ textShadow: ["0 0 10px #22d3ee", "0 0 20px #22d3ee", "0 0 10px #22d3ee"] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-3xl font-arcade text-cyan-400 italic tracking-tighter"
          >
            DEEP SEA ARCADE
          </motion.h1>
          <p className="text-xs text-blue-300 font-bold uppercase mt-2 tracking-[0.3em]">Player Terminal</p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 w-5 h-5" />
              <input 
                type="text" 
                placeholder="ID (아이디)"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 w-5 h-5" />
              <input 
                type="password" 
                placeholder="Password (비밀번호)"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:border-cyan-500/50 outline-none transition-all"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-xs text-center font-bold animate-bounce">{error}</p>}

          <button 
            onClick={handleAction}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-arcade text-xl rounded-2xl shadow-lg shadow-cyan-900/40 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isRegister ? <UserPlus size={20} /> : <LogIn size={20} />}
            {isRegister ? 'CREATE ACCOUNT' : 'INSERT COIN & START'}
          </button>

          <div className="pt-4 flex flex-col items-center gap-4">
            <div className="flex items-center w-full gap-4">
               <div className="h-[1px] flex-1 bg-white/10" />
               <button 
                 onClick={() => { setIsRegister(!isRegister); setError(''); }}
                 className="text-xs text-slate-400 hover:text-cyan-400 font-bold uppercase transition-colors"
               >
                 {isRegister ? '로그인하러 가기' : '새 아이디 만들기'}
               </button>
               <div className="h-[1px] flex-1 bg-white/10" />
            </div>

            <button 
              onClick={onOpenAdmin}
              className="mt-2 flex items-center gap-2 text-[10px] font-black text-red-500/60 hover:text-red-400 uppercase tracking-widest transition-colors"
            >
              <ShieldCheck size={12} /> ADMIN TERMINAL
            </button>
          </div>
        </div>

        <div className="p-4 bg-black/40 text-center">
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center justify-center gap-1">
             <Sparkles size={10} className="text-yellow-500" />
             Welcome to the Underwater World
           </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
