import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, FastForward, Clock } from 'lucide-react';
import { EarthDataset, DataPoint } from '../types';

interface EarthTimelineProps {
  dataset: EarthDataset;
  currentPointIndex: number;
  onSelectPointIndex: (index: number) => void;
  className?: string;
  isAudioPlaying?: boolean;
  onEnsureAudioPlaying: () => void;
}

export const EarthTimeline: React.FC<EarthTimelineProps> = ({
  dataset,
  currentPointIndex,
  onSelectPointIndex,
  className = '',
  onEnsureAudioPlaying,
}) => {
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const timerRef = useRef<number | null>(null);

  const points = dataset.dataPoints;
  const currentPoint = points[currentPointIndex] || points[points.length - 1];

  // Auto timeline playback runner
  useEffect(() => {
    if (!isPlayingTimeline) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalMs = Math.round(1800 / playbackSpeed);

    timerRef.current = window.setInterval(() => {
      const next = (currentPointIndex + 1) % points.length;
      onSelectPointIndex(next);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlayingTimeline, playbackSpeed, points.length, currentPointIndex, onSelectPointIndex]);

  const toggleTimelinePlayback = () => {
    if (!isPlayingTimeline) {
      onEnsureAudioPlaying();
      setIsPlayingTimeline(true);
    } else {
      setIsPlayingTimeline(false);
    }
  };

  const handlePrev = () => {
    const prev = Math.max(0, currentPointIndex - 1);
    onSelectPointIndex(prev);
  };

  const handleNext = () => {
    const next = Math.min(points.length - 1, currentPointIndex + 1);
    onSelectPointIndex(next);
  };

  return (
    <div className={`glass-panel p-4 rounded-2xl border border-cyan-500/20 ${className}`}>
      {/* Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold tracking-wider text-slate-200 uppercase">
            TEMPORAL VOYAGE: {currentPoint.year}
          </span>
          <span className="px-2 py-0.5 rounded bg-space-800 border border-slate-700 text-[10px] font-mono text-cyan-300">
            {currentPoint.formattedValue}
          </span>
        </div>

        {/* Playback speed selector */}
        <div className="flex items-center gap-1 bg-space-950/80 p-1 rounded-lg border border-slate-800 text-[10px] font-mono">
          <span className="text-slate-400 px-1.5 flex items-center gap-1">
            <FastForward className="w-3 h-3 text-cyan-400" />
            SPEED:
          </span>
          {[0.5, 1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => setPlaybackSpeed(speed)}
              className={`px-2 py-0.5 rounded transition-colors ${
                playbackSpeed === speed
                  ? 'bg-cyan-500 text-space-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbing Bar & Year Nodes */}
      <div className="relative pt-2 pb-6">
        {/* Progress Background Track */}
        <div className="absolute top-5 left-0 right-0 h-1.5 bg-space-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-nasa-cyan transition-all duration-300"
            style={{ width: `${(currentPointIndex / (points.length - 1)) * 100}%` }}
          />
        </div>

        {/* Clickable Year Markers */}
        <div className="relative flex justify-between items-center z-10">
          {points.map((pt: DataPoint, idx: number) => {
            const isSelected = idx === currentPointIndex;
            return (
              <button
                key={pt.year}
                onClick={() => {
                  onSelectPointIndex(idx);
                  onEnsureAudioPlaying();
                }}
                className="group flex flex-col items-center focus:outline-none"
              >
                {/* Node Dot */}
                <div
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 border-2 ${
                    isSelected
                      ? 'bg-cyan-400 border-white shadow-[0_0_12px_#00e5ff] scale-125'
                      : 'bg-space-900 border-slate-600 group-hover:border-cyan-400 group-hover:scale-110'
                  }`}
                />
                {/* Year Label */}
                <span
                  className={`absolute top-6 text-[10px] font-mono transition-colors ${
                    isSelected
                      ? 'text-cyan-300 font-bold scale-105'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {pt.year}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Play / Navigation Buttons */}
      <div className="flex items-center justify-center gap-3 pt-2 border-t border-slate-800/80">
        <button
          onClick={handlePrev}
          disabled={currentPointIndex === 0}
          className="p-2 rounded-lg bg-space-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Previous Year"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={toggleTimelinePlayback}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
            isPlayingTimeline
              ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_18px_rgba(239,68,68,0.5)]'
              : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-[0_0_18px_rgba(0,229,255,0.4)]'
          }`}
        >
          {isPlayingTimeline ? (
            <>
              <Pause className="w-4 h-4" />
              <span>PAUSE TIMELINE</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>PLAY TIMELINE</span>
            </>
          )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentPointIndex === points.length - 1}
          className="p-2 rounded-lg bg-space-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Next Year"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
