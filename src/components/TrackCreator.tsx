import React, { useState } from 'react';
import { Sliders, Play, Pause, RotateCcw, Download, Disc3, Radio } from 'lucide-react';
import { DatasetId, CustomTrackConfig } from '../types';
import { EARTH_DATASETS } from '../data/datasets';
import { SOUND_PROFILES } from '../audio/soundProfiles';
import { globalSonificationEngine } from '../audio/SonificationEngine';
import { AudioVisualizer } from './AudioVisualizer';

interface TrackCreatorProps {
  className?: string;
}

export const TrackCreator: React.FC<TrackCreatorProps> = ({ className = '' }) => {
  const [config, setConfig] = useState<CustomTrackConfig>({
    title: 'Planetary Symbiosis in A Minor',
    primaryDataset: 'temperature',
    secondaryDataset: 'sea_level',
    rhythmDataset: 'wildfire',
    profile: 'climate',
    baseTempo: 80,
    intensity: 0.7,
  });

  const [isPlayingTrack, setIsPlayingTrack] = useState<boolean>(false);
  const [hasCreatedTrack, setHasCreatedTrack] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setHasCreatedTrack(true);
    globalSonificationEngine.setProfile(config.profile);
    await globalSonificationEngine.start();

    // Map combined variables
    const ds1 = EARTH_DATASETS[config.primaryDataset];
    const ds2 = EARTH_DATASETS[config.secondaryDataset];
    const pt1 = ds1.dataPoints[ds1.dataPoints.length - 1];
    const pt2 = ds2.dataPoints[ds2.dataPoints.length - 1];

    const blendedNorm = (pt1.normalizedValue + pt2.normalizedValue) / 2;
    globalSonificationEngine.updateParameters(blendedNorm, pt1.changeRate, config.intensity);
    setIsPlayingTrack(true);
  };

  const handleToggle = async () => {
    if (isPlayingTrack) {
      if (isRecording) {
        await handleStopRecording();
      }
      globalSonificationEngine.stop();
      setIsPlayingTrack(false);
    } else {
      await handleGenerate();
    }
  };

  const handleReset = () => {
    if (isRecording) {
      handleStopRecording();
    }
    globalSonificationEngine.stop();
    setIsPlayingTrack(false);
    setHasCreatedTrack(false);
    setRecordedAudioUrl(null);
  };

  const handleStartRecording = async () => {
    if (!isPlayingTrack) {
      await handleGenerate();
    }
    const started = globalSonificationEngine.startRecording();
    if (started) {
      setIsRecording(true);
      setRecordedAudioUrl(null);
    }
  };

  const handleStopRecording = async () => {
    const blob = await globalSonificationEngine.stopRecording();
    setIsRecording(false);
    if (blob) {
      const url = URL.createObjectURL(blob);
      setRecordedAudioUrl(url);
    }
  };

  return (
    <div className={`glass-panel p-6 rounded-3xl border border-cyan-500/20 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
            <Sliders className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              CREATE YOUR OWN EARTH TRACK
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                MULTIVARIATE SYNTHESIZER
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Combine three NASA observation streams into a multi-layered acoustic composition with live recording & export.
            </p>
          </div>
        </div>
      </div>

      {/* Track Composer Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        {/* Layer 1: Melody Carrier */}
        <div className="p-4 rounded-2xl bg-space-900 border border-slate-800">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-semibold">
            01. PRIMARY MELODY (CARRIER PITCH)
          </label>
          <select
            value={config.primaryDataset}
            onChange={(e) => setConfig({ ...config, primaryDataset: e.target.value as DatasetId })}
            className="w-full bg-space-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
          >
            {Object.values(EARTH_DATASETS).map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.shortName} ({ds.unit})
              </option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-slate-400">
            Maps to root carrier pitch and melodic progression.
          </p>
        </div>

        {/* Layer 2: Bass / Harmonics */}
        <div className="p-4 rounded-2xl bg-space-900 border border-slate-800">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-semibold">
            02. SUB-BASS & HARMONIC DENSITY
          </label>
          <select
            value={config.secondaryDataset}
            onChange={(e) => setConfig({ ...config, secondaryDataset: e.target.value as DatasetId })}
            className="w-full bg-space-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
          >
            {Object.values(EARTH_DATASETS).map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.shortName} ({ds.unit})
              </option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-slate-400">
            Modulates overtone thickness and low-frequency resonance.
          </p>
        </div>

        {/* Layer 3: Rhythmic Cadence */}
        <div className="p-4 rounded-2xl bg-space-900 border border-slate-800">
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-semibold">
            03. RHYTHMIC PULSE & TRANSIENTS
          </label>
          <select
            value={config.rhythmDataset}
            onChange={(e) => setConfig({ ...config, rhythmDataset: e.target.value as DatasetId })}
            className="w-full bg-space-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
          >
            {Object.values(EARTH_DATASETS).map((ds) => (
              <option key={ds.id} value={ds.id}>
                {ds.shortName} ({ds.unit})
              </option>
            ))}
          </select>
          <p className="mt-2 text-[10px] text-slate-400">
            Drives percussion rate and transient accent strikes.
          </p>
        </div>
      </div>

      {/* Sound Profile and Timbre Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6 p-4 rounded-2xl bg-space-950/60 border border-slate-800">
        <div>
          <label className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5 font-semibold">
            ACOUSTIC PROFILE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {Object.values(SOUND_PROFILES).map((prof) => (
              <button
                key={prof.id}
                onClick={() => setConfig({ ...config, profile: prof.id })}
                className={`py-2 px-2.5 rounded-xl text-xs font-mono text-center border transition-all ${
                  config.profile === prof.id
                    ? 'bg-cyan-500 text-space-950 font-bold border-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                    : 'bg-space-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {prof.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
              HARMONIC INTENSITY & SATURATION
            </label>
            <span className="text-xs font-mono text-cyan-400">{Math.round(config.intensity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={config.intensity}
            onChange={(e) => setConfig({ ...config, intensity: parseFloat(e.target.value) })}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>Mellow & Pure</span>
            <span>Balanced</span>
            <span>Intense & Saturated</span>
          </div>
        </div>
      </div>

      {/* Visualizer inside Track Creator */}
      {hasCreatedTrack && (
        <div className="w-full h-24 mb-6">
          <AudioVisualizer isPlaying={isPlayingTrack} activeColor="#00e5ff" visualMode="hybrid" />
        </div>
      )}

      {/* Action Controls & MediaRecorder Recording */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggle}
            className={`px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              isPlayingTrack
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
            }`}
          >
            {isPlayingTrack ? (
              <>
                <Pause className="w-4 h-4" />
                <span>PAUSE TRACK</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{hasCreatedTrack ? 'RESUME TRACK' : 'CREATE EARTH TRACK'}</span>
              </>
            )}
          </button>

          {/* Record button */}
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition-all ${
              isRecording
                ? 'bg-red-950 border-red-500 text-red-400 animate-pulse'
                : 'bg-space-900 border-slate-700 text-slate-200 hover:border-cyan-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isRecording ? 'text-red-400 animate-ping' : 'text-slate-400'}`} />
            <span>{isRecording ? 'STOP RECORDING' : 'RECORD TRACK'}</span>
          </button>

          {/* Download button if recording available */}
          {recordedAudioUrl && (
            <a
              href={recordedAudioUrl}
              download="earth-track-composition.webm"
              className="px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 bg-emerald-950 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900 transition-colors shadow-[0_0_12px_rgba(16,185,129,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>DOWNLOAD AUDIO (.WEBM)</span>
            </a>
          )}

          {hasCreatedTrack && (
            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-space-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Reset Track"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {hasCreatedTrack && (
          <div className="text-xs font-mono text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>LAYERS: {config.primaryDataset} + {config.secondaryDataset} + {config.rhythmDataset}</span>
          </div>
        )}
      </div>
    </div>
  );
};
