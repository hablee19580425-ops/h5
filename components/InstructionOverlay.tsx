
import React from 'react';
import { motion } from 'framer-motion';
import { X, Wallet, PlayCircle, Settings2, Info, ShieldCheck, UserCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

const InstructionOverlay: React.FC<Props> = ({ onClose }) => {
  const guides = [
    {
      icon: <UserCheck className="text-cyan-400" />,
      title: "계정 기반 시스템",
      desc: "로그인한 아이디로 모든 잔액과 데이터가 저장됩니다. 관리자가 승인한 아이디로만 플레이 가능합니다."
    },
    {
      icon: <ShieldCheck className="text-red-500" />,
      title: "마스터 터미널 (Admin)",
      desc: "로그인 화면의 [ADMIN TERMINAL]에서 아이디 생성, 코인 원격 충전 및 데이터 동기화를 관리합니다."
    },
    {
      icon: <PlayCircle className="text-cyan-400" />,
      title: "게임 플레이",
      desc: "하단 중앙의 [SPIN] 버튼으로 슬롯을 돌립니다. 베팅 금액만큼 아이디 잔액에서 차감됩니다."
    },
    {
      icon: <Settings2 className="text-pink-400" />,
      title: "설정 커스터마이징",
      desc: "[SETTINGS]에서 승률(RTP)과 변동성을 직접 조절하여 기계의 난이도를 설정할 수 있습니다."
    },
    {
      icon: <Info className="text-green-400" />,
      title: "당첨 확인",
      desc: "[PAYS] 버튼을 누르면 각 심볼별 당첨 배수와 20개의 페이라인 상세 정보를 볼 수 있습니다."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg bg-gradient-to-b from-blue-900/90 to-slate-950 border-2 border-cyan-500/50 rounded-[2rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-500/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-cyan-400 animate-pulse" />
            <h2 className="text-xl font-arcade text-white tracking-widest uppercase">Arcade Operator Guide</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
          <p className="text-sm text-blue-200 font-bold text-center mb-4">Deep Sea Arcade 통합 관리 시스템</p>
          
          <div className="space-y-4">
            {guides.map((guide, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex-shrink-0 w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center border border-white/10">
                  {guide.icon}
                </div>
                <div>
                  <h3 className="text-white font-bold text-md mb-1">{guide.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{guide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-black/40">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-arcade text-lg rounded-2xl shadow-lg active:scale-95 transition-all"
          >
            ENTER ARCADE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InstructionOverlay;
