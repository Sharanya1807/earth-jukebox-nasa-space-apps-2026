import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, CheckCircle, Sparkles, FastForward } from 'lucide-react';
import { DatasetId } from '../types';

interface MissionDemoProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateDemoState: (step: number, datasetId: DatasetId, normalizedVal: number, year: number) => void;
  onStartAudio: () => Promise<void>;
  onStopAudio: () => void;
}

const DEMO_STEPS = [
  { step: 1, title: 'Orbital Initialization', desc: 'Synthesizing 3D Earth and atmospheric radiance...', duration: 4000, dataset: 'temperature' as DatasetId, norm: 0.45, year: 1990 },
  { step: 2, title: 'Thermal Layer Activation', desc: 'Connecting NASA GISTEMP anomaly surface observations...', duration: 6000, dataset: 'temperature' as DatasetId, norm: 0.55, year: 2000 },
  { step: 3, title: 'Sonification Engine Online', desc: 'Audio graph connects: Pitch maps to temperature; tempo maps to rate of change...', duration: 7000, dataset: 'temperature' as DatasetId, norm: 0.68, year: 2010 },
  { step: 4, title: 'Temporal Surge (2015-2026)', desc: 'Timeline advances: Notice carrier frequency climbing from G3 to A5...', duration: 8000, dataset: 'temperature' as DatasetId, norm: 0.88, year: 2026 },
  { step: 5, title: 'Switching Phenomenon: Wildfires', desc: 'NASA FIRMS active fire hotspots trigger explosive percussive accents...', duration: 7000, dataset: 'wildfire' as DatasetId, norm: 0.85, year: 2026 },
  { step: 6, title: 'Switching Phenomenon: Sea Ice', desc: 'Arctic polar ice shrinkage thins crystalline overtones into an exposed drone...', duration: 7000, dataset: 'sea_ice' as DatasetId, norm: 0.20, year: 2026 },
  { step: 7, title: 'Multisensory Compare Synthesis', desc: 'Auditory contrast between 1990 baseline vs 2026 planetary boundaries...', duration: 7000, dataset: 'sea_level' as DatasetId, norm: 0.86, year: 2026 },
  { step: 8, title: 'Mission Complete', desc: 'Democratizing Earth science for all humanity through sight and sound.', duration: 5000, dataset: 'temperature' as DatasetId, norm: 0.88, year: 2026 }
];

export const MissionDemo: React.FC<MissionDemoProps> = ({
  isOpen,
  onClose,
  onUpdateDemoState,
  onStartAudio,
  onStopAudio,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const runStep = (idx: number) => {
      if (idx >= DEMO_STEPS.length) {
        // Complete
        return;
      }

      setCurrentStepIndex(idx);
      const step = DEMO_STEPS[idx];
      onUpdateDemoState(step.step, step.dataset, step.norm, step.year);

      // Start audio at step 3
      if (idx === 2) {
        onStartAudio();
      }

      timerRef.current = window.setTimeout(() => {
        runStep(idx + 1);
      }, step.duration);
    };

    runStep(0);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIndex] || DEMO_STEPS[0];
  const progressPercent = ((currentStepIndex + 1) / DEMO_STEPS.length) * 100;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 glass-panel-glow p-5 rounded-2xl border-2 border-cyan-400 shadow-2xl animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            MISSION DEMO IN PROGRESS
          </span>
        </div>
        <button
          onClick={() => {
            onStopAudio();
            onClose();
          }}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-space-900 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-nasa-red transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Step Info */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>STEP {currentStep.step} OF {DEMO_STEPS.length}</span>
          <span className="text-cyan-300 font-bold">{currentStep.year} DATASET</span>
        </div>
        <h4 className="text-sm font-bold text-white mb-1">{currentStep.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">{currentStep.desc}</p>
      </div>

      {/* Quick Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono">
        <span className="text-slate-400">AUTOMATIC FLIGHT PLAN</span>
        <button
          onClick={() => {
            if (currentStepIndex < DEMO_STEPS.length - 1) {
              if (timerRef.current) clearTimeout(timerRef.current);
              setCurrentStepIndex(currentStepIndex + 1);
            }
          }}
          className="flex items-center gap-1 text-cyan-300 hover:text-white"
        >
          <span>FAST FORWARD</span>
          <FastForward className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
