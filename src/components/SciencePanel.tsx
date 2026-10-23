import React from 'react';
import { Database, ExternalLink, ShieldCheck } from 'lucide-react';
import { EarthDataset } from '../types';

interface SciencePanelProps {
  dataset: EarthDataset;
  className?: string;
}

export const SciencePanel: React.FC<SciencePanelProps> = ({
  dataset,
  className = '',
}) => {
  const isLiveConfigured = import.meta.env.VITE_ENABLE_LIVE_NASA_DATA === 'true';

  return (
    <div className={`glass-panel p-6 rounded-3xl border border-cyan-500/20 ${className}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
            <Database className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              SCIENCE MODE & DATA PROVENANCE
              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${
                isLiveConfigured 
                  ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                  : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
              }`}>
                {isLiveConfigured ? 'LIVE NASA ENDPOINT CONNECTED' : 'CALIBRATED NASA BENCHMARK ARCHIVE'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Verified NASA Earth Observing System (EOS) telemetry, instrument payloads, and mathematics.
            </p>
          </div>
        </div>

        <a
          href={dataset.source.citationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-space-900 border border-slate-700 hover:border-cyan-400 text-xs font-mono text-cyan-300 hover:text-white transition-colors"
        >
          <span>OFFICIAL MISSION ARCHIVE</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Metadata Specification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">OBSERVATION METRIC</div>
          <div className="text-sm font-bold text-slate-100">{dataset.name}</div>
          <div className="text-xs font-mono text-cyan-400 mt-1">Symbol: {dataset.symbol} ({dataset.unit})</div>
        </div>

        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">OPERATING AGENCY / DAAC</div>
          <div className="text-sm font-bold text-slate-100">{dataset.source.agency}</div>
          <div className="text-xs font-mono text-slate-400 mt-1">Payload: {dataset.source.satelliteMission}</div>
        </div>

        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">TEMPORAL RESOLUTION</div>
          <div className="text-sm font-bold text-slate-100">{dataset.source.temporalResolution}</div>
          <div className="text-xs font-mono text-slate-400 mt-1">Spatial: {dataset.source.spatialResolution}</div>
        </div>

        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">PROCESSING ALGORITHM</div>
          <div className="text-xs text-slate-200 leading-relaxed">{dataset.source.processingMethod}</div>
        </div>

        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">NORMALIZATION EQUATION</div>
          <div className="text-xs font-mono text-yellow-300 leading-relaxed">{dataset.source.normalizationMethod}</div>
        </div>

        <div className="p-4 rounded-xl bg-space-900/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">ACOUSTIC CARRIER RANGE</div>
          <div className="text-xs font-mono text-emerald-400 leading-relaxed">{dataset.soundMapping.frequencyRange}</div>
        </div>
      </div>

      {/* Mathematical Rigor Callout */}
      <div className="p-4 rounded-2xl bg-space-950/80 border border-cyan-500/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 space-y-1">
          <strong className="text-white block font-mono">SCIENTIFIC INTEGRITY ASSURANCE</strong>
          <p>
            Earth Jukebox does not synthesize random ambient music. Every Hz of frequency, millisecond of tempo pulse,
            and overtone cluster directly maps to numerical peer-reviewed NASA climate and planetary observations.
          </p>
        </div>
      </div>
    </div>
  );
};
