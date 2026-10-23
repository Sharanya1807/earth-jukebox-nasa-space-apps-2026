import React from 'react';
import { 
  Thermometer, 
  Waves, 
  Snowflake, 
  Leaf, 
  Flame, 
  CloudFog, 
  CloudRain, 
  Wind,
  TrendingUp,
  TrendingDown,
  Minus,
  Volume2
} from 'lucide-react';
import { DatasetId, EarthDataset } from '../types';
import { EARTH_DATASETS } from '../data/datasets';

interface DataCardsProps {
  activeDatasetId: DatasetId;
  onSelectDataset: (id: DatasetId) => void;
  className?: string;
}

export const DataCards: React.FC<DataCardsProps> = ({
  activeDatasetId,
  onSelectDataset,
  className = '',
}) => {
  const getIcon = (id: DatasetId) => {
    switch (id) {
      case 'temperature': return <Thermometer className="w-5 h-5 text-red-400" />;
      case 'sea_level': return <Waves className="w-5 h-5 text-cyan-400" />;
      case 'sea_ice': return <Snowflake className="w-5 h-5 text-sky-300" />;
      case 'ocean_temperature': return <Waves className="w-5 h-5 text-teal-400" />;
      case 'vegetation': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'wildfire': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'co2': return <CloudFog className="w-5 h-5 text-yellow-400" />;
      case 'precipitation': return <CloudRain className="w-5 h-5 text-blue-400" />;
      case 'storms': return <Wind className="w-5 h-5 text-purple-400" />;
      default: return <Volume2 className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
    if (trend === 'increasing') return <TrendingUp className="w-3.5 h-3.5 text-red-400 inline mr-1" />;
    if (trend === 'decreasing') return <TrendingDown className="w-3.5 h-3.5 text-blue-400 inline mr-1" />;
    return <Minus className="w-3.5 h-3.5 text-emerald-400 inline mr-1" />;
  };

  return (
    <div className={`flex flex-col gap-2.5 overflow-y-auto max-h-[calc(100vh-140px)] pr-1.5 ${className}`}>
      <div className="flex items-center justify-between pb-1 px-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          NASA OBSERVATION LAYERS
        </span>
        <span className="text-[10px] font-mono text-slate-400">9 METRICS</span>
      </div>

      {Object.values(EARTH_DATASETS).map((ds: EarthDataset) => {
        const isActive = ds.id === activeDatasetId;

        return (
          <button
            key={ds.id}
            onClick={() => onSelectDataset(ds.id)}
            className={`w-full text-left p-3 rounded-xl transition-all duration-200 border relative overflow-hidden ${
              isActive
                ? 'bg-space-800/90 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.2)] scale-[1.01]'
                : 'bg-space-900/60 border-slate-800 hover:border-slate-700 hover:bg-space-850/80 text-slate-300'
            }`}
          >
            {/* Active Indicator Accent Bar */}
            {isActive && (
              <div 
                className="absolute left-0 top-0 bottom-0 w-1" 
                style={{ backgroundColor: ds.colorHex }}
              />
            )}

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-cyan-950/80 border border-cyan-500/30' : 'bg-space-800/50'}`}>
                  {getIcon(ds.id)}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-100 uppercase tracking-wide">
                    {ds.shortName}
                  </h4>
                  <p className="text-[10px] font-mono text-slate-400 flex items-center">
                    {getTrendIcon(ds.trend)}
                    {ds.trendRateStr}
                  </p>
                </div>
              </div>

              {/* Current Value Readout */}
              <div className="text-right">
                <div 
                  className="text-sm font-mono font-bold"
                  style={{ color: isActive ? ds.colorHex : '#f1f5f9' }}
                >
                  {ds.currentFormatted}
                </div>
                <div className="text-[9px] font-mono text-slate-400">
                  CURRENT
                </div>
              </div>
            </div>

            {/* Sound Mapping Preview */}
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                Sound:
              </span>
              <span className="text-cyan-300 truncate max-w-[170px]" title={ds.soundMapping.primaryParam}>
                {ds.soundMapping.primaryParam.split('(')[0]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
