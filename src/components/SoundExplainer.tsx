import React, { useState } from 'react';
import { Sparkles, HelpCircle, Heart, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { EarthDataset } from '../types';

interface SoundExplainerProps {
  dataset: EarthDataset;
  currentFreq: number;
  currentNote: string;
  currentBpm: number;
  className?: string;
}

export const SoundExplainer: React.FC<SoundExplainerProps> = ({
  dataset,
  currentFreq,
  currentNote,
  currentBpm,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className={`glass-panel p-5 rounded-3xl border border-cyan-500/20 ${className}`}>
      {/* Accordion toggle header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100 flex items-center gap-2">
              EXPLAIN THIS SOUND: SCIENTIFIC AUDITORY GUIDE
            </h3>
            <p className="text-[11px] text-slate-400">
              Clear, accessible interpretation of what your ears are detecting right now.
            </p>
          </div>
        </div>
        <div className="text-cyan-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-cyan-500/20 space-y-4">
          {/* Plain language explanation */}
          <div className="p-4 rounded-2xl bg-space-950/70 border border-slate-800">
            <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase mb-1.5">
              WHAT AM I HEARING RIGHT NOW?
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              You are hearing <strong>{dataset.name}</strong> sonified in real-time. 
              The fundamental pitch is currently tuned to <strong>{currentNote} ({currentFreq} Hz)</strong>.
              As the planetary variable reaches more extreme recorded values, the frequency rises into higher octaves.
              The tempo of the rhythmic pulse is clicking at <strong>{currentBpm} BPM</strong>, reflecting the mathematical 
              rate-of-change across NASA satellite observations.
            </p>
          </div>

          {/* Why it matters callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-space-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span>BEYOND VISUAL SILOS</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Traditional scientific dashboards say: <em>"Look at Earth."</em> Earth Jukebox enables us to 
                <strong> See it, Hear it, and Understand it</strong> — opening NASA science to visually impaired researchers, students, and educators.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-space-900/60 border border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>ACCESSIBILITY FOR ALL</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Auditory perception excels at recognizing subtle temporal shifts, rate-of-change surges, and overlapping multi-system patterns that 2D line charts can easily obscure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
