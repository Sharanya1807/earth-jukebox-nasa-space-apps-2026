import React from 'react';
import { 
  Eye, 
  EyeOff, 
  Volume2, 
  Headphones, 
  Sun, 
  Maximize2, 
  Vibrate, 
  Keyboard, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { AccessibilitySettings, EarthDataset } from '../types';

interface AccessibilityPanelProps {
  settings: AccessibilitySettings;
  onUpdateSettings: (settings: Partial<AccessibilitySettings>) => void;
  dataset: EarthDataset;
  currentFrequency: number;
  currentBpm: number;
  className?: string;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  settings,
  onUpdateSettings,
  dataset,
  currentFrequency,
  currentBpm,
  className = '',
}) => {
  return (
    <div className={`glass-panel p-6 rounded-3xl border border-cyan-500/20 ${className}`}>
      {/* Title */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
            <Eye className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
              UNIVERSAL ACCESSIBILITY MODE
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                WCAG 2.2 AAA TARGET
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Science for everyone: designed for blind, low-vision, and neurodiverse explorers.
            </p>
          </div>
        </div>
      </div>

      {/* Screen Reader Live Acoustic Description Banner */}
      <div 
        role="status" 
        aria-live="polite"
        className="mb-6 p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30"
      >
        <div className="flex items-center gap-2 mb-2 text-cyan-400 text-xs font-mono font-bold uppercase">
          <Headphones className="w-4 h-4" />
          <span>CURRENT AUDITORY DESCRIPTOR (LIVE NARRATIVE)</span>
        </div>
        <p className="text-sm text-slate-100 font-sans leading-relaxed">
          The <strong>{dataset.name}</strong> is currently measured at <strong>{dataset.currentFormatted}</strong>.
          The trend is <em>{dataset.trend}</em> ({dataset.trendRateStr}).
          In the current sonification, this is represented by an acoustic carrier frequency of <strong>{currentFrequency} Hz</strong> at <strong>{currentBpm} BPM</strong>.
          {dataset.soundMapping.explanation}
        </p>
      </div>

      {/* Accessibility Control Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {/* Audio-First Mode */}
        <button
          onClick={() => onUpdateSettings({ audioFirstMode: !settings.audioFirstMode })}
          className={`p-4 rounded-xl text-left border transition-all ${
            settings.audioFirstMode
              ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              : 'bg-space-900 border-slate-800 hover:border-slate-700'
          }`}
          aria-pressed={settings.audioFirstMode}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>AUDIO-FIRST MODE</span>
            </div>
            {settings.audioFirstMode && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
          </div>
          <p className="text-[11px] text-slate-400">
            Hides non-essential graphics to conserve focus, cognitive bandwidth, and maximize audio immersion.
          </p>
        </button>

        {/* High Contrast Mode */}
        <button
          onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
          className={`p-4 rounded-xl text-left border transition-all ${
            settings.highContrast
              ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              : 'bg-space-900 border-slate-800 hover:border-slate-700'
          }`}
          aria-pressed={settings.highContrast}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Sun className="w-4 h-4 text-yellow-400" />
              <span>HIGH CONTRAST MODE</span>
            </div>
            {settings.highContrast && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
          </div>
          <p className="text-[11px] text-slate-400">
            Maximizes contrast ratios (black backgrounds with high-visibility borders and text).
          </p>
        </button>

        {/* Large Text Mode */}
        <button
          onClick={() => onUpdateSettings({ largeText: !settings.largeText })}
          className={`p-4 rounded-xl text-left border transition-all ${
            settings.largeText
              ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              : 'bg-space-900 border-slate-800 hover:border-slate-700'
          }`}
          aria-pressed={settings.largeText}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Maximize2 className="w-4 h-4 text-emerald-400" />
              <span>LARGE TEXT MODE</span>
            </div>
            {settings.largeText && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
          </div>
          <p className="text-[11px] text-slate-400">
            Increases font sizing across telemetry panels, legends, and navigation controls.
          </p>
        </button>

        {/* Haptic Multisensory Feedback */}
        <button
          onClick={() => onUpdateSettings({ hapticFeedback: !settings.hapticFeedback })}
          className={`p-4 rounded-xl text-left border transition-all ${
            settings.hapticFeedback
              ? 'bg-cyan-950 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
              : 'bg-space-900 border-slate-800 hover:border-slate-700'
          }`}
          aria-pressed={settings.hapticFeedback}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Vibrate className="w-4 h-4 text-purple-400" />
              <span>HAPTIC VIBRATION FEEDBACK</span>
            </div>
            {settings.hapticFeedback && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
          </div>
          <p className="text-[11px] text-slate-400">
            Synchronizes vibration pulses on supported mobile devices to physically feel planetary shifts.
          </p>
        </button>

        {/* Colorblind Palette Presets */}
        <div className="p-4 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-white font-bold text-xs mb-2 flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-sky-400" />
            <span>COLOR VISION CORRECTION</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
            {(['none', 'protanopia', 'deuteranopia', 'tritanopia'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onUpdateSettings({ colorblindMode: mode })}
                className={`py-1 px-2 rounded capitalize border transition-colors ${
                  settings.colorblindMode === mode
                    ? 'bg-cyan-500 text-space-950 font-bold border-cyan-400'
                    : 'bg-space-950 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="p-4 rounded-xl bg-space-900 border border-slate-800">
          <div className="text-white font-bold text-xs mb-2 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" />
            <span>KEYBOARD SHORTCUTS</span>
          </div>
          <div className="space-y-1 text-[10px] font-mono text-slate-400">
            <div className="flex justify-between">
              <kbd className="bg-space-950 px-1.5 py-0.5 rounded border border-slate-700 text-cyan-300">Space</kbd>
              <span>Play / Pause Audio</span>
            </div>
            <div className="flex justify-between">
              <kbd className="bg-space-950 px-1.5 py-0.5 rounded border border-slate-700 text-cyan-300">← / →</kbd>
              <span>Previous / Next Year</span>
            </div>
            <div className="flex justify-between">
              <kbd className="bg-space-950 px-1.5 py-0.5 rounded border border-slate-700 text-cyan-300">D</kbd>
              <span>Toggle Judge Mode</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
