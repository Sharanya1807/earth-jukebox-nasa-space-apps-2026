import React from 'react';
import { X, Award, Cpu, ShieldCheck, Database, Headphones, Globe, ArrowRight } from 'lucide-react';

interface JudgeModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JudgeModeModal: React.FC<JudgeModeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel-glow p-8 rounded-3xl border-2 border-cyan-400">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl bg-space-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors"
          aria-label="Close Judge Mode"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-cyan-950 border border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
            <Award className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase bg-cyan-950 px-2.5 py-0.5 rounded-full border border-cyan-500/40">
                NASA SPACE APPS CHALLENGE 2026
              </span>
              <span className="text-xs font-mono text-slate-400">EXECUTIVE BRIEF</span>
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight mt-1">
              JUDGING & TECHNICAL ARCHITECTURE DOSSIER
            </h1>
          </div>
        </div>

        {/* Problem to Impact Flow */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 mb-8">
          <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">01. THE PROBLEM</div>
            <div className="text-xs font-bold text-white mt-1">Visual Silos</div>
            <p className="text-[10px] text-slate-400 mt-1">Earth visualizations exclude millions who cannot see complex graphs.</p>
          </div>

          <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">02. NASA DATA</div>
            <div className="text-xs font-bold text-white mt-1">EIC & EOS</div>
            <p className="text-[10px] text-slate-400 mt-1">Calibrated multi-mission feeds: GISTEMP, MODIS, GRACE, OCO-2, FIRMS.</p>
          </div>

          <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">03. PROCESSING</div>
            <div className="text-xs font-bold text-white mt-1">Scientific Norm</div>
            <p className="text-[10px] text-slate-400 mt-1">Min-max & log-scaling with exponential parameter smoothing (EMA).</p>
          </div>

          <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">04. SONIFICATION</div>
            <div className="text-xs font-bold text-white mt-1">Web Audio API</div>
            <p className="text-[10px] text-slate-400 mt-1">Dynamic carriers, overtone stacking, spatial panners, and real-time FFT.</p>
          </div>

          <div className="p-3 rounded-xl bg-space-900/90 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold">05. ACCESSIBILITY</div>
            <div className="text-xs font-bold text-white mt-1">WCAG 2.2 AAA</div>
            <p className="text-[10px] text-slate-400 mt-1">Audio-first mode, screen reader live alerts, high contrast & haptics.</p>
          </div>

          <div className="p-3 rounded-xl bg-space-900/90 border border-cyan-500/40 bg-cyan-950/40 text-center">
            <div className="text-[10px] font-mono text-cyan-300 font-bold">06. IMPACT</div>
            <div className="text-xs font-bold text-white mt-1">Democratized</div>
            <p className="text-[10px] text-cyan-200 mt-1">Anyone can see, hear, and emotionally comprehend our planet changing.</p>
          </div>
        </div>

        {/* Technical Architecture Specs */}
        <div className="space-y-4 mb-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            ENGINEERING SPECIFICATIONS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-space-900 border border-slate-800">
              <span className="text-cyan-400 block font-bold mb-1">FRONTEND & 3D RENDERING</span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                React 18 + TypeScript + Vite + Tailwind CSS. Hardware-accelerated Three.js WebGL globe with custom atmospheric glow shaders, procedural continental maps, and real-time event coordinate beacons.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-space-900 border border-slate-800">
              <span className="text-cyan-400 block font-bold mb-1">REAL-TIME SONIFICATION ENGINE</span>
              <p className="text-slate-300 font-sans text-xs leading-relaxed">
                Pure Web Audio API native graph. Zero external audio player black-boxes. Utilizes 1024-bin AnalyserNode for true FFT oscilloscope visualization, multi-oscillator polyphonic overtone synthesizers, and stereo spatial panners.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <span>NASA Space Apps Challenge 2026 • Earth Jukebox Team</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-bold transition-colors"
          >
            RETURN TO APP
          </button>
        </div>
      </div>
    </div>
  );
};
