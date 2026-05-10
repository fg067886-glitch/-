import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Target, 
  MousePointer2, 
  Zap, 
  Settings, 
  Power,
  Lock,
  ChevronRight,
  Monitor
} from 'lucide-react';

// Sound utility using Web Audio API
const createSynth = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return null;
  const ctx = new AudioContext();
  
  return {
    playTap: (freq = 440, type: OscillatorType = 'sine', duration = 0.1) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    },
    playUnlock: () => {
      const duration = 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + duration);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    }
  };
};

const PASSWORD_CORRECT = "darkaura";

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tuner States
  const [dpi, setDpi] = useState(750);
  const [isHeadshotEnabled, setIsHeadshotEnabled] = useState(false);
  const [isDragAssistEnabled, setIsDragAssistEnabled] = useState(false);
  const [is144HzEnabled, setIs144HzEnabled] = useState(false);
  
  const synth = useRef<ReturnType<typeof createSynth>>(null);

  useEffect(() => {
    synth.current = createSynth();
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    if (passwordInput.toLowerCase() === PASSWORD_CORRECT) {
      synth.current?.playUnlock();
      setTimeout(() => setIsUnlocked(true), 500);
    } else {
      setError(true);
      synth.current?.playTap(100, 'sawtooth', 0.2);
      setTimeout(() => {
        setPasswordInput("");
        setError(false);
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
    synth.current?.playTap(400 + e.target.value.length * 10, 'sine', 0.05);
  };

  return (
    <div className="relative h-screen w-screen bg-cyber-dark flex items-center justify-center overflow-hidden selection:bg-neon-cyan/30">
      <div className="scanline" />
      
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
            className="z-20 w-full max-w-md p-8 text-center"
          >
            <div className="mb-12 flex flex-col items-center">
              <motion.div 
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-gradient-to-br from-neon-cyan to-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(0,243,255,0.4)]"
              >
                <Lock className="text-white w-10 h-10" />
              </motion.div>
              <h1 className="mt-6 text-4xl font-techo font-bold tracking-widest glitch-text uppercase">Apex Access</h1>
              <p className="text-gray-400 font-techo tracking-widest mt-2 uppercase text-xs">Enter Authorization Code</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto">
              <div className="relative group">
                <motion.div
                  animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
                  className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                    error ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-white/10 group-focus-within:border-neon-cyan group-focus-within:shadow-[0_0_25px_rgba(0,243,255,0.2)]'
                  }`}
                >
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={handleInputChange}
                    placeholder="ENTER ACCESS KEY"
                    autoFocus
                    className="w-full bg-black/40 backdrop-blur-xl py-5 px-6 text-xl text-center font-techo tracking-[0.3em] outline-none placeholder:text-white/10 placeholder:tracking-widest uppercase transition-all"
                  />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-cyan opacity-0 group-focus-within:opacity-100 transition-opacity" />
                </motion.div>

                <p className={`mt-3 text-[10px] font-techo uppercase tracking-widest transition-opacity duration-300 ${error ? 'text-red-500 opacity-100' : 'text-gray-500 opacity-50'}`}>
                  {error ? "Access Denied // Invalid Signature" : "Biometric Scan Bypassed // Input Manual Key"}
                </p>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,243,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 w-full py-4 rounded-xl border border-neon-cyan/30 text-neon-cyan font-techo font-bold tracking-widest uppercase hover:bg-neon-cyan/5 text-sm transition-all"
              >
                Authenticate Protocol
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="z-20 w-full max-w-lg p-6 flex flex-col h-full md:h-auto"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-techo font-bold text-neon-cyan tracking-wider uppercase">System Protocol Active</h2>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-green-500 font-bold">Encrypted Connection Established</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  synth.current?.playTap(200);
                  setIsUnlocked(false);
                  setPasswordInput("");
                }}
                className="p-3 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/10"
              >
                <Power size={20} />
              </button>
            </header>

            {/* Main Tiles */}
            <div className="space-y-4">
              {/* Headshot Toggle */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  synth.current?.playTap(isHeadshotEnabled ? 400 : 800);
                  setIsHeadshotEnabled(!isHeadshotEnabled);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-500 flex items-center gap-4 ${
                  isHeadshotEnabled 
                  ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.1)]' 
                  : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className={`p-3 rounded-xl ${isHeadshotEnabled ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-white/5 text-gray-500'}`}>
                  <Target size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-techo font-bold uppercase tracking-widest">ระบบดูดหัว (Aim Assist)</h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase">Headshot Protocol v2.4</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isHeadshotEnabled ? 'bg-neon-cyan' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: isHeadshotEnabled ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                  />
                </div>
              </motion.div>

              {/* Drag Toggle */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  synth.current?.playTap(isDragAssistEnabled ? 400 : 800);
                  setIsDragAssistEnabled(!isDragAssistEnabled);
                }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-500 flex items-center gap-4 ${
                  isDragAssistEnabled 
                  ? 'bg-neon-pink/10 border-neon-pink shadow-[0_0_20px_rgba(255,0,255,0.1)]' 
                  : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className={`p-3 rounded-xl ${isDragAssistEnabled ? 'bg-neon-pink/20 text-neon-pink' : 'bg-white/5 text-gray-500'}`}>
                  <MousePointer2 size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-techo font-bold uppercase tracking-widest">ระบบช่วยลาก (Auto Drag)</h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase">Recoil Stabilizer Enabled</p>
                </div>
                <div className={`w-12 h-6 rounded-full relative transition-colors ${isDragAssistEnabled ? 'bg-neon-pink' : 'bg-white/10'}`}>
                  <motion.div 
                    animate={{ x: isDragAssistEnabled ? 24 : 4 }}
                    className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg" 
                  />
                </div>
              </motion.div>

              {/* DPI Slider */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <Zap className="text-yellow-400" size={20} />
                    <h3 className="font-techo font-bold uppercase tracking-widest text-sm">DPI Configuration</h3>
                  </div>
                  <span className="font-techo text-2xl font-bold text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]">{dpi}</span>
                </div>
                <div className="relative h-8 flex items-center">
                   <input 
                    type="range" 
                    min="500" 
                    max="1000" 
                    value={dpi} 
                    onChange={(e) => {
                      setDpi(parseInt(e.target.value));
                      synth.current?.playTap(300 + dpi / 2, 'sine', 0.02);
                    }}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                  />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-techo text-gray-500 uppercase tracking-widest">
                  <span>Standard 500</span>
                  <span>Extreme 1000</span>
                </div>
              </div>

              {/* 144Hz Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  synth.current?.playTap(is144HzEnabled ? 400 : 1200, 'square');
                  setIs144HzEnabled(!is144HzEnabled);
                }}
                className={`w-full p-6 rounded-2xl border flex items-center justify-between transition-all duration-700 ${
                  is144HzEnabled 
                  ? 'bg-gradient-to-r from-blue-600 to-neon-cyan border-none text-white shadow-[0_10px_30px_rgba(0,180,255,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Monitor className={is144HzEnabled ? 'animate-pulse' : ''} />
                  <div className="text-left">
                    <span className="block text-xl font-techo font-bold uppercase tracking-widest">Boost 144Hz</span>
                    <span className="text-[10px] opacity-70 uppercase tracking-widest">Frame Optimization Protocol</span>
                  </div>
                </div>
                <ChevronRight className={`transition-transform duration-500 ${is144HzEnabled ? 'rotate-90' : ''}`} />
              </motion.button>
            </div>

            <footer className="mt-8 text-center text-white/20 text-[10px] font-mono tracking-widest uppercase">
              Apex Pro V4.0 // Build ID: 0x119_BETA
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
