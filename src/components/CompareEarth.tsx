import React, { useState } from 'react';
import { ArrowRight, Volume2, SplitSquareVertical, Sparkles } from 'lucide-react';
import { DatasetId } from '../types';
import { EARTH_DATASETS } from '../data/datasets';
import { globalSonificationEngine } from '../audio/SonificationEngine';

interface CompareEarthProps {
  className?: string;
  onSelectDataset?: (id: DatasetId) => void;
}

export const CompareEarth: React.FC<CompareEarthProps> = ({
  className = '',
}) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<DatasetId>('temperature');
  const [activeSide, setActiveSide] = useState<'then' | 'now'>('now');

  const dataset = EARTH_DATASETS[selectedDatasetId] || EARTH_DATASETS.temperature;
  const thenPoint = dataset.dataPoints[0]; // e.g. 1990 or 2000
  const nowPoint = dataset.dataPoints[dataset.dataPoints.length - 1]; // 2026

  const playSide = async (side: 'then' | 'now') => {
    setActiveSide(side);
    await globalSonificationEngine.start();
    const pt = side === 'then' ? thenPoint : nowPoint;
    globalSonificationEngine.updateParameters(pt.normalizedValue, pt.changeRate, side === 'then' ? 0.35 : 0.85);
  };

  return (
    <div className={`glass-panel p-6 rounded-3xl border border-cyan-500/20 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
            <SplitSquareVertical className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              COMPARE EARTH: THEN vs NOW
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                AUDITORY CONTRAST
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Hear the planetary acoustic shift across three decades of NASA observations.
            </p>
          </div>
        </div>

        {/* Dataset selector pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {Object.values(EARTH_DATASETS).map((ds) => (
            <button
              key={ds.id}
              onClick={() => setSelectedDatasetId(ds.id)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                selectedDatasetId === ds.id
                  ? 'bg-cyan-500 text-space-950 font-bold'
                  : 'bg-space-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {ds.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Split Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        {/* "THEN" Card */}
        <div 
          className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            activeSide === 'then'
              ? 'bg-space-850/90 border-cyan-400 shadow-[0_0_30px_rgba(0,229,255,0.2)]'
              : 'bg-space-900/60 border-slate-800 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
              EARTH HISTORICAL BASELINE
            </span>
            <span className="text-xl font-mono font-extrabold text-cyan-400">
              {thenPoint.year}
            </span>
          </div>

          <div className="text-3xl font-mono font-extrabold text-white mb-2">
            {thenPoint.formattedValue}
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Early satellite epoch. Milder thermal spectrum and slower rhythmic tempo.
          </p>

          <button
            onClick={() => playSide('then')}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeSide === 'then'
                ? 'bg-cyan-500 text-space-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                : 'bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>HEAR {thenPoint.year} SONIFICATION</span>
          </button>
        </div>

        {/* "NOW" Card */}
        <div 
          className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            activeSide === 'now'
              ? 'bg-space-850/90 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
              : 'bg-space-900/60 border-slate-800 opacity-80'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
              EARTH PRESENT DAY
            </span>
            <span className="text-xl font-mono font-extrabold text-red-400">
              {nowPoint.year}
            </span>
          </div>

          <div className="text-3xl font-mono font-extrabold text-white mb-2">
            {nowPoint.formattedValue}
          </div>
          <p className="text-xs text-slate-400 mb-6">
            Elevated carrier pitch, denser harmonic layers, and urgent accelerated cadence.
          </p>

          <button
            onClick={() => playSide('now')}
            className={`w-full py-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              activeSide === 'now'
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'bg-space-800 hover:bg-space-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>HEAR {nowPoint.year} SONIFICATION</span>
          </button>
        </div>
      </div>

      {/* Difference Summary Callout */}
      <div className="mt-6 p-4 rounded-xl bg-space-950/80 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs text-slate-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>
            Observed Shift: <strong className="text-white font-mono">{thenPoint.formattedValue}</strong>
            {' '}<ArrowRight className="inline w-3 h-3 text-cyan-400" />{' '}
            <strong className="text-red-400 font-mono">{nowPoint.formattedValue}</strong>
          </span>
        </div>

        <button
          onClick={async () => {
            // Rapid toggle demonstration
            await playSide('then');
            setTimeout(() => {
              playSide('now');
            }, 2500);
          }}
          className="px-4 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs font-bold flex items-center gap-2 transition-colors"
        >
          <span>HEAR THE DIFFERENCE (A/B TRANSITION)</span>
        </button>
      </div>
    </div>
  );
};
