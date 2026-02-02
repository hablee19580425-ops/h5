
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Coins, ArrowRightLeft, UserPlus, Trash2, 
  RefreshCcw, ShieldCheck, CreditCard, User as UserIcon, 
  X, Copy, Check, Upload, Download, Globe
} from 'lucide-react';
import { UserAccount } from '../types';
import { formatKoreanCurrency } from '../services/gameLogic';

interface Props {
  onBackToLogin: () => void;
}

const AdminManagerPanel: React.FC<Props> = ({ onBackToLogin }) => {
  const [users, setUsers] = useState<Record<string, UserAccount>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newUserId, setNewUserId] = useState('');
  const [newUserPw, setNewUserPw] = useState('');
  const [chargeAmount, setChargeAmount] = useState('100000');
  const [showAddUser, setShowAddUser] = useState(false);
  const [showSync, setShowSync] = useState(false);
  const [syncCode, setSyncCode] = useState('');
  const [copied, setCopied] = useState(false);

  const loadUsers = () => {
    const saved = JSON.parse(localStorage.getItem('arcade_users') || '{}');
    setUsers(saved);
  };

  useEffect(() => { loadUsers(); }, []);

  const saveUsers = (updatedUsers: Record<string, UserAccount>) => {
    localStorage.setItem('arcade_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleCreateUser = () => {
    if (!newUserId || !newUserPw) return;
    const updated = { ...users };
    if (updated[newUserId]) { alert('이미 존재하는 ID입니다.'); return; }
    updated[newUserId] = { id: newUserId, password: newUserPw, balance: 10000, createdAt: Date.now() };
    saveUsers(updated);
    setNewUserId(''); setNewUserPw(''); setShowAddUser(false);
  };

  const handleUpdateBalance = (id: string, amount: number) => {
    const updated = { ...users };
    if (updated[id]) {
      updated[id].balance = Math.max(0, updated[id].balance + amount);
      saveUsers(updated);
    }
  };

  const handleDeleteUser = (id: string) => {
    if (window.confirm(`${id} 계정을 영구 삭제하시겠습니까?`)) {
      const updated = { ...users };
      delete updated[id];
      saveUsers(updated);
      setSelectedUserId(null);
    }
  };

  const generateSyncCode = () => {
    const code = btoa(JSON.stringify(users));
    setSyncCode(code);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const applySyncCode = () => {
    try {
      const decoded = JSON.parse(atob(syncCode));
      if (typeof decoded !== 'object') throw new Error();
      if (window.confirm('다른 기기의 데이터를 현재 기기로 덮어씌우겠습니까?')) {
        saveUsers(decoded);
        alert('동기화 성공! 이제 다른 기기에서 만든 아이디로 로그인이 가능합니다.');
        setShowSync(false);
      }
    } catch (e) {
      alert('유효하지 않은 동기화 코드입니다.');
    }
  };

  const filteredUsers = Object.values(users).filter(u => u.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[150] bg-slate-950 text-white flex flex-col">
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-red-500/20 p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-red-500" size={28} />
          <div>
            <h1 className="text-xl font-black font-arcade">MASTER TERMINAL</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Account Manager</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowSync(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl font-bold text-sm">
            <Globe size={16} /> SYNC DATA
          </button>
          <button onClick={onBackToLogin} className="p-2 bg-red-500/10 rounded-full text-red-500 border border-red-500/20">
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="p-6 bg-slate-900/50 border-b border-white/5 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" placeholder="아이디 검색..." value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:border-red-500/50"
          />
        </div>
        <button onClick={() => setShowAddUser(true)} className="px-6 bg-red-600 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-red-900/40">
          <UserPlus size={20} /> NEW PLAYER
        </button>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredUsers.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
            <Users size={64} className="mb-4" />
            <p>등록된 아이디가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUsers.map(user => (
              <motion.div 
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${selectedUserId === user.id ? 'bg-red-500/10 border-red-500' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <UserIcon size={20} className="text-slate-400" />
                    <h3 className="font-bold text-lg">{user.id}</h3>
                  </div>
                  <button onClick={(e) => {e.stopPropagation(); handleDeleteUser(user.id);}} className="text-slate-600 hover:text-red-500">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-black">Credits</span>
                    <p className="text-xl font-arcade text-yellow-400">{user.balance.toLocaleString()}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Sync Modal */}
      <AnimatePresence>
        {showSync && (
          <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="w-full max-w-2xl bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] space-y-6">
              <h2 className="text-2xl font-black flex items-center gap-3"><Globe className="text-blue-400" /> 기기간 데이터 동기화</h2>
              <p className="text-sm text-slate-400">다른 기기(컴퓨터)로 데이터를 옮기려면 코드를 복사해서 붙여넣으세요.</p>
              <textarea 
                value={syncCode} onChange={(e) => setSyncCode(e.target.value)}
                placeholder="여기에 동기화 코드를 입력하거나 위 버튼을 눌러 코드를 생성하세요..."
                className="w-full h-48 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-[10px] text-cyan-400"
              />
              <div className="grid grid-cols-2 gap-4">
                <button onClick={generateSyncCode} className="py-4 bg-blue-600 rounded-2xl font-black flex items-center justify-center gap-2">
                  {copied ? <Check /> : <Copy />} {copied ? 'COPIED!' : 'GENERATE & COPY'}
                </button>
                <button onClick={applySyncCode} className="py-4 bg-green-600 rounded-2xl font-black flex items-center justify-center gap-2">
                  <Upload /> APPLY SYNC CODE
                </button>
              </div>
              <button onClick={() => setShowSync(false)} className="w-full py-4 text-slate-500 font-bold uppercase">CLOSE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Charge Panel */}
      <AnimatePresence>
        {selectedUserId && users[selectedUserId] && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="bg-slate-900 border-t-2 border-red-500 p-8 flex flex-col md:flex-row gap-8 items-center justify-between"
          >
            <div className="flex flex-col">
              <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Selected Player</span>
              <h2 className="text-3xl font-bold">{selectedUserId}</h2>
              <p className="text-xl font-arcade text-yellow-500 mt-1">{users[selectedUserId].balance.toLocaleString()} Credits</p>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <input 
                type="number" value={chargeAmount} onChange={(e) => setChargeAmount(e.target.value)}
                className="flex-1 md:w-48 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 font-arcade text-xl text-center"
              />
              <button onClick={() => handleUpdateBalance(selectedUserId!, parseInt(chargeAmount))} className="px-8 bg-red-600 rounded-2xl font-black active:scale-95 transition-all">REMOTE CHARGE</button>
              <button onClick={() => handleUpdateBalance(selectedUserId!, -users[selectedUserId].balance)} className="px-8 bg-slate-800 rounded-2xl font-black active:scale-95 transition-all border border-white/10">FULL WITHDRAW</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUser && (
          <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-slate-900 p-8 rounded-[2rem] border border-white/10 w-full max-w-md space-y-6">
              <h2 className="text-xl font-black flex items-center gap-2"><UserPlus className="text-red-500" /> CREATE PLAYER ACCOUNT</h2>
              <div className="space-y-4">
                <input type="text" placeholder="아이디 입력" value={newUserId} onChange={(e) => setNewUserId(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4" />
                <input type="password" placeholder="비밀번호 입력" value={newUserPw} onChange={(e) => setNewUserPw(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-xl py-4 px-4" />
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowAddUser(false)} className="flex-1 font-bold text-slate-500">CANCEL</button>
                <button onClick={handleCreateUser} className="flex-2 py-4 bg-red-600 rounded-2xl font-black text-white px-8">CREATE ID</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagerPanel;
