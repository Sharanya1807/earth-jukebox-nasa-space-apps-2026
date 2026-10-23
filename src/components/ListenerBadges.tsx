import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { DatasetId } from '../types';

interface ListenerBadgesProps {
  unlockedBadges: Set<string>;
  className?: string;
}

export const LISTENER_BADGES = [
  { id: 'earth_listener', name: 'Earth Listener', icon: '🌎', desc: 'Sonified global thermal anomalies', trigger: 'temperature' as DatasetId },
  { id: 'ocean_listener', name: 'Ocean Listener', icon: '🌊', desc: 'Sonified sea level & altimetry', trigger: 'sea_level' as DatasetId },
  { id: 'ice_listener', name: 'Ice Listener', icon: '❄', desc: 'Heard polar sea ice cryosphere', trigger: 'sea_ice' as DatasetId },
  { id: 'forest_listener', name: 'Forest Listener', icon: '🌱', desc: 'Tuned into biosphere respiration', trigger: 'vegetation' as DatasetId },
  { id: 'fire_listener', name: 'Fire Listener', icon: '🔥', desc: 'Tracked fire radiative power bursts', trigger: 'wildfire' as DatasetId },
  { id: 'planet_observer', name: 'Planet Observer', icon: '🌌', desc: 'Completed full multi-variable survey', trigger: 'storms' as DatasetId },
];

export const ListenerBadges: React.FC<ListenerBadgesProps> = ({
  unlockedBadges,
  className = '',
}) => {
  return (
    <div className={`glass-panel p-4 rounded-2xl border border-cyan-500/20 ${className}`}>
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-cyan-500/20">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            DISCOVERY CITATIONS
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">
          {unlockedBadges.size} / {LISTENER_BADGES.length} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {LISTENER_BADGES.map((b) => {
          const isUnlocked = unlockedBadges.has(b.id);

          return (
            <div
              key={b.id}
              className={`p-2.5 rounded-xl border text-center transition-all ${
                isUnlocked
                  ? 'bg-cyan-950/50 border-cyan-500/40 shadow-[0_0_10px_rgba(0,229,255,0.15)]'
                  : 'bg-space-900/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div className="text-xl mb-1">{b.icon}</div>
              <div className="text-[10px] font-mono font-bold text-slate-200 truncate">{b.name}</div>
              <div className="text-[9px] text-slate-400 truncate mt-0.5">{b.desc}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
