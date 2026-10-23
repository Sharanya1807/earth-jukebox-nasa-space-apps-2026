import React from 'react';
import { ArrowDown, HelpCircle, Activity, Radio, Cpu, Music } from 'lucide-react';
import { EarthDataset } from '../types';

interface MappingPanelProps {
  dataset: EarthDataset;
  currentFrequency: number;
  currentNote: string;
  currentBpm: number;
  className?: string;
}

export const MappingPanel: React.FC<MappingPanelProps> = ({
  dataset,
  currentFrequency,
  currentNote,
  currentBpm,
  className = '',
}) => {
  const currentPt = dataset.dataPoints[dataset.dataPoints.length - 1];

  return (
    <div className={`glass-panel p-5 rounded-2xl border border-cyan-500/20 ${className}`}>
      {/* Title Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-100">
            HOW DOES EARTH BECOME SOUND?
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <Radio className="w-3 h-3 animate-pulse text-cyan-400" />
          <span>SCIENTIFIC TRANSLATION PIPELINE</span>
        </div>
      </div>

      {/* 5-Step Pipeline Visualization */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
        {/* STEP 1: RAW NASA OBSERVATION */}
        <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>STEP 01</span>
              <span className="text-cyan-400">DATA</span>
            </div>
            <div className="text-xs font-bold text-slate-200 uppercase truncate">
              {dataset.shortName}
            </div>
            <div className="mt-2 text-lg font-mono font-extrabold text-cyan-400">
              {dataset.currentFormatted}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Baseline: {dataset.baselineYear || 'Pre-Ind'}
          </div>
        </div>

        {/* STEP 2: MATHEMATICAL NORMALIZATION */}
        <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>STEP 02</span>
              <span className="text-yellow-400">NORMALIZE</span>
            </div>
            <div className="text-xs font-bold text-slate-200 uppercase">
              Min-Max Scaling
            </div>
            <div className="mt-2 text-lg font-mono font-extrabold text-yellow-400">
              {(currentPt.normalizedValue).toFixed(3)}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Scalar range: [0.00 – 1.00]
          </div>
        </div>

        {/* STEP 3: SCIENTIFIC FREQUENCY MAPPING */}
        <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>STEP 03</span>
              <span className="text-emerald-400">MAPPING</span>
            </div>
            <div className="text-xs font-bold text-slate-200 uppercase truncate">
              Pitch / Carrier
            </div>
            <div className="mt-2 text-lg font-mono font-extrabold text-emerald-400">
              {currentFrequency} Hz
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            {dataset.soundMapping.frequencyRange}
          </div>
        </div>

        {/* STEP 4: MUSICAL NOTE & HARMONICS */}
        <div className="bg-space-900/80 p-3.5 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>STEP 04</span>
              <span className="text-purple-400">ACOUSTIC</span>
            </div>
            <div className="text-xs font-bold text-slate-200 uppercase">
              Musical Pitch
            </div>
            <div className="mt-2 text-lg font-mono font-extrabold text-purple-400">
              {currentNote}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            Tempo: {currentBpm} BPM
          </div>
        </div>

        {/* STEP 5: AUDITORY OUTPUT SYNTHESIS */}
        <div className="bg-space-900/80 p-3.5 rounded-xl border border-cyan-500/30 bg-gradient-to-br from-space-900 to-cyan-950/40 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-mono font-semibold text-slate-400 mb-1 flex items-center justify-between">
              <span>STEP 05</span>
              <span className="text-cyan-300">OUTPUT</span>
            </div>
            <div className="text-xs font-bold text-slate-200 uppercase">
              Live Synthesis
            </div>
            <div className="mt-2 text-xs font-mono font-semibold text-cyan-300 leading-tight">
              {dataset.soundMapping.timbre}
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400 flex items-center gap-1">
            <Music className="w-3 h-3 text-cyan-400" />
            <span>Web Audio API</span>
          </div>
        </div>
      </div>

      {/* Scientific Explanation Footer */}
      <div className="mt-4 p-3 rounded-xl bg-space-950/60 border border-slate-800/80 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          <strong className="text-cyan-300 font-mono">Scientific Rule: </strong>
          {dataset.soundMapping.explanation}
        </p>
      </div>
    </div>
  );
};
