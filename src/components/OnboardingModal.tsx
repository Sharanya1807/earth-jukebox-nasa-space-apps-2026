import React from 'react';
import { Sparkles, Globe, Volume2, ArrowRight, ShieldCheck } from 'lucide-react';
import { DatasetId } from '../types';

interface OnboardingModalProps {
  isOpen: boolean;
  onSelectCategory: (datasetId: DatasetId) => void;
  onDismiss: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onSelectCategory,
  onDismiss,
}) => {
  if (!isOpen) return null;

  const categories: { label: string; datasetId: DatasetId; icon: string; desc: string; color: string }[] = [
    { label: 'CLIMATE', datasetId: 'temperature', icon: '🌡', desc: 'Global surface temperature anomalies (1880–2026)', color: 'border-red-500/40 text-red-400' },
    { label: 'OCEANS', datasetId: 'sea_level', icon: '🌊', desc: 'Satellite sea level rise & thermal expansion', color: 'border-cyan-500/40 text-cyan-400' },
    { label: 'LAND & FORESTS', datasetId: 'vegetation', icon: '🌱', desc: 'Biosphere NDVI seasonal greening & respiration', color: 'border-emerald-500/40 text-emerald-400' },
    { label: 'ATMOSPHERE', datasetId: 'co2', icon: '☁', desc: 'CO2 concentration & greenhouse heat trapping', color: 'border-yellow-500/40 text-yellow-400' },
    { label: 'WILDFIRES', datasetId: 'wildfire', icon: '🔥', desc: 'Active fire radiative power & thermal hotspots', color: 'border-amber-500/40 text-amber-500' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-space-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel-glow p-8 rounded-3xl border border-cyan-400/40 text-center animate-in zoom-in-95">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>NASA SPACE APPS CHALLENGE 2026</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-black text-white uppercase tracking-tight mb-2">
          WELCOME TO EARTH JUKEBOX
        </h2>
        <p className="text-base font-medium text-cyan-300 mb-3 font-mono">
          "Listen to the planet change."
        </p>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mb-6 font-sans">
          You are about to experience NASA Earth Information Center (EIC) observations transformed into 
          real-time dynamic sonifications and interactive 3D visualizations.
        </p>

        {/* Prompt */}
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-4">
          WHAT WOULD YOU LIKE TO EXPLORE FIRST?
        </p>

        {/* Category Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => onSelectCategory(cat.datasetId)}
              className={`p-3.5 rounded-2xl bg-space-900 border hover:bg-space-850 transition-all flex items-start gap-3 group ${cat.color}`}
            >
              <span className="text-xl">{cat.icon}</span>
              <div>
                <div className="text-xs font-bold font-mono tracking-wide text-white group-hover:text-cyan-300 transition-colors">
                  {cat.label}
                </div>
                <div className="text-[10px] text-slate-400 font-sans mt-0.5 leading-tight">
                  {cat.desc}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Skip button */}
        <button
          onClick={onDismiss}
          className="text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
        >
          ENTER MISSION CONTROL DIRECTLY →
        </button>
      </div>
    </div>
  );
};
