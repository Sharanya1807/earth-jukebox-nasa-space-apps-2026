import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Globe2, 
  Headphones, 
  Sliders, 
  SplitSquareVertical, 
  Database, 
  Sparkles, 
  Eye, 
  Award,
  Disc3,
  Clock,
  Menu,
  X,
  Radio,
  Info
} from 'lucide-react';

import { 
  DatasetId, 
  SoundProfileId, 
  AccessibilitySettings, 
  EarthStory 
} from './types';
import { EARTH_DATASETS } from './data/datasets';
import { SOUND_PROFILES } from './audio/soundProfiles';
import { useSonification } from './hooks/useSonification';
import { globalEarthDataService } from './services/EarthDataService';

import { EarthGlobe } from './components/EarthGlobe';
import { AudioVisualizer } from './components/AudioVisualizer';
import { DataCards } from './components/DataCards';
import { MappingPanel } from './components/MappingPanel';
import { EarthTimeline } from './components/EarthTimeline';
import { JukeboxPlayer } from './components/JukeboxPlayer';
import { CompareEarth } from './components/CompareEarth';
import { AccessibilityPanel } from './components/AccessibilityPanel';
import { SciencePanel } from './components/SciencePanel';
import { TrackCreator } from './components/TrackCreator';
import { JudgeModeModal } from './components/JudgeModeModal';
import { MissionDemo } from './components/MissionDemo';
import { OnboardingModal } from './components/OnboardingModal';
import { ListenerBadges } from './components/ListenerBadges';
import { SoundExplainer } from './components/SoundExplainer';

type ActiveTab = 'landing' | 'explorer' | 'jukebox' | 'timeline' | 'compare' | 'creator' | 'science' | 'accessibility';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [currentYearIndex, setCurrentYearIndex] = useState<number>(0);
  const [showJudgeMode, setShowJudgeMode] = useState<boolean>(false);
  const [showMissionDemo, setShowMissionDemo] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [unlockedBadges, setUnlockedBadges] = useState<Set<string>>(new Set(['earth_listener']));

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    audioFirstMode: false,
    reducedMotion: false,
    colorblindMode: 'none',
    screenReaderAnnounce: true,
    hapticFeedback: false,
  });

  const {
    isPlaying,
    volume,
    activeProfile,
    currentFreq,
    currentNote,
    currentBpm,
    selectedDatasetId,
    currentDataset,
    togglePlay,
    play,
    stop,
    setVolume,
    setProfile,
    selectDataset,
    updateFromDataPoint,
    engine
  } = useSonification();

  const dataStatus = globalEarthDataService.getDataSourceStatus();

  // Set initial year to latest
  useEffect(() => {
    if (currentDataset && currentDataset.dataPoints.length > 0) {
      setCurrentYearIndex(currentDataset.dataPoints.length - 1);
    }
  }, [selectedDatasetId]);

  // Sync year change to sonification
  const handleSelectYearIndex = useCallback((index: number) => {
    setCurrentYearIndex(index);
    const pt = currentDataset.dataPoints[index];
    if (pt) {
      updateFromDataPoint(pt.normalizedValue, pt.changeRate, 0.6);
      if (accessibility.hapticFeedback) {
        engine.triggerHaptic(40);
      }
    }
  }, [currentDataset, updateFromDataPoint, accessibility.hapticFeedback, engine]);

  // Handle dataset selection with badge unlocks
  const handleSelectDataset = (id: DatasetId) => {
    selectDataset(id);
    const badgeKey = id === 'temperature' ? 'earth_listener' 
      : id === 'sea_level' ? 'ocean_listener'
      : id === 'sea_ice' ? 'ice_listener'
      : id === 'ocean_temperature' ? 'ocean_listener'
      : id === 'vegetation' ? 'forest_listener'
      : id === 'wildfire' ? 'fire_listener'
      : 'planet_observer';

    setUnlockedBadges(prev => new Set([...prev, badgeKey]));
  };

  // Keyboard shortcut listener ('D' for Judge mode, Space for audio play/pause)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'd' || e.key === 'D') {
        setShowJudgeMode(prev => !prev);
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentYearIndex(prev => Math.min(currentDataset.dataPoints.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentYearIndex(prev => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, currentDataset]);

  const currentPt = currentDataset.dataPoints[currentYearIndex] || currentDataset.dataPoints[currentDataset.dataPoints.length - 1];

  const navItems = [
    { id: 'explorer', label: 'EXPLORER', icon: Globe2 },
    { id: 'jukebox', label: 'EARTH JUKEBOX', icon: Disc3 },
    { id: 'timeline', label: 'TIMELINE', icon: Clock },
    { id: 'compare', label: 'COMPARE', icon: SplitSquareVertical },
    { id: 'creator', label: 'CREATE TRACK', icon: Sliders },
    { id: 'science', label: 'SCIENCE & DATA', icon: Database },
    { id: 'accessibility', label: 'ACCESSIBILITY', icon: Eye },
  ];

  return (
    <div className={`min-h-screen bg-space-950 text-slate-100 flex flex-col font-sans transition-colors duration-200 ${
      accessibility.highContrast ? 'high-contrast' : ''
    } ${accessibility.largeText ? 'text-lg' : 'text-sm'} ${
      accessibility.colorblindMode !== 'none' ? `filter-${accessibility.colorblindMode}` : ''
    }`}>
      {/* Top NASA Mission Control Navigation Bar */}
      <header className="sticky top-0 z-40 glass-panel border-b border-cyan-500/20 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Brand & NASA Space Apps Badge */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)] group-hover:scale-105 transition-transform">
              <Globe2 className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-tight text-white uppercase font-mono">
                  EARTH JUKEBOX
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-cyan-950 text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30">
                  NASA SPACE APPS 2026
                </span>
              </div>
              <p className="text-[10px] font-mono text-cyan-300/80 tracking-wide">
                HEAR OUR PLANET CHANGE • EIC REAL-TIME SONIFICATION
              </p>
            </div>
          </button>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1 bg-space-900/80 p-1 rounded-2xl border border-slate-800">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-space-950 font-bold shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-space-850'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Tools */}
        <div className="flex items-center gap-2.5">
          {/* Quick Header LISTEN Button */}
          <button
            onClick={togglePlay}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold uppercase transition-all duration-200 ${
              isPlaying
                ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span className="hidden sm:inline">{isPlaying ? 'PAUSE' : 'LISTEN'}</span>
          </button>

          {/* Mission Demo Button */}
          <button
            onClick={() => setShowMissionDemo(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-space-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950 text-xs font-mono font-bold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>MISSION DEMO</span>
          </button>

          {/* Judge Mode Button */}
          <button
            onClick={() => setShowJudgeMode(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300 text-xs font-mono font-bold hover:bg-cyan-900 shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all"
            title="Press 'D' key for Judge Mode Dossier"
          >
            <Award className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">JUDGE MODE</span>
            <kbd className="hidden lg:inline bg-space-900 px-1 py-0.2 rounded text-[9px] text-slate-400 border border-slate-700">D</kbd>
          </button>

          {/* Master Volume Quick Slider */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-900 border border-slate-800">
            <button 
              onClick={() => setVolume(volume === 0 ? 0.65 : 0)} 
              className="text-slate-400 hover:text-white"
              aria-label="Toggle Mute"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-14 accent-cyan-400 cursor-pointer h-1"
              aria-label="Master volume"
            />
          </div>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-space-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel border-b border-cyan-500/20 px-4 py-3 flex flex-col gap-2 z-30 animate-in slide-in-from-top-2">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as ActiveTab);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider text-left transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-space-950 font-bold'
                    : 'text-slate-300 hover:bg-space-850'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8 flex flex-col gap-8">
        {/* 1. CINEMATIC LANDING / HERO VIEW */}
        {activeTab === 'landing' && (
          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center relative">
            {/* 3D Background Earth Behind Hero */}
            <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-70 pointer-events-auto">
              <EarthGlobe 
                activeDatasetId={selectedDatasetId} 
                normalizedValue={currentPt.normalizedValue}
                interactive={true}
              />
            </div>

            {/* Live Animated Waveform Background Ribbon */}
            <div className="absolute inset-x-0 bottom-4 h-28 -z-10 opacity-60 pointer-events-none">
              <AudioVisualizer isPlaying={isPlaying} activeColor="#00e5ff" visualMode="hybrid" />
            </div>

            {/* Floating Hero Mission Card */}
            <div className="relative z-10 max-w-3xl glass-panel-glow p-8 sm:p-12 rounded-3xl border border-cyan-400/40 shadow-2xl animate-in zoom-in-95">
              {/* Status Indicators Required in Spec */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  EARTH SYSTEM OBSERVATION ACTIVE
                </span>

                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
                  dataStatus.isLive
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/80 border-amber-500/40 text-amber-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${dataStatus.isLive ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {dataStatus.isLive ? 'LIVE NASA DATA' : 'DEMO DATA MODE'}
                </span>
              </div>

              {/* Exact Hero Title & Subtitle */}
              <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-mono mb-2">
                EARTH JUKEBOX
              </h1>

              <h2 className="text-xl sm:text-2xl font-bold text-cyan-400 mb-4 font-mono">
                HEAR OUR PLANET CHANGE
              </h2>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto font-sans">
                "Transforming Earth observations into sound, movement, and accessible stories."
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  onClick={async () => {
                    setActiveTab('explorer');
                    await play();
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-space-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>START LISTENING</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('explorer');
                  }}
                  className="px-8 py-3.5 rounded-2xl bg-space-900 border border-slate-700 hover:border-cyan-400 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Globe2 className="w-4 h-4 text-cyan-400" />
                  <span>EXPLORE EARTH</span>
                </button>
              </div>

              {/* Autoplay Safeguard Note */}
              <p className="text-[10px] font-mono text-slate-400 mt-5">
                *Complies with browser audio policies: audio activates only after explicit user interaction.
              </p>
            </div>
          </div>
        )}

        {/* 2. EARTH EXPLORER & LIVE SONIFICATION STUDIO */}
        {activeTab === 'explorer' && (
          <div className="flex flex-col gap-6">
            {/* Top Studio HUD & Sonification Controls */}
            <div className="glass-panel p-5 rounded-3xl border border-cyan-500/20">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-cyan-500/20">
                {/* Playback Transport Buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      isPlaying
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                        : 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        <span>PAUSE</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        <span>START LISTENING</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={stop}
                    disabled={!isPlaying}
                    className="p-2.5 rounded-xl bg-space-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white disabled:opacity-40 transition-colors"
                    title="Stop Audio"
                  >
                    <Square className="w-4 h-4" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-800 text-xs font-mono">
                    <span className="text-slate-400">PROFILE:</span>
                    <select
                      value={activeProfile}
                      onChange={(e) => setProfile(e.target.value as SoundProfileId)}
                      className="bg-space-900 border border-slate-700 rounded-lg px-2.5 py-1 text-cyan-300 focus:outline-none"
                    >
                      {Object.values(SOUND_PROFILES).map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Real-time Telemetry Readouts */}
                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-400 block">CARRIER</span>
                    <span className="text-cyan-400 font-bold">{currentFreq} Hz</span>
                  </div>

                  <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-400 block">NOTE</span>
                    <span className="text-purple-400 font-bold">{currentNote}</span>
                  </div>

                  <div className="p-2 rounded-xl bg-space-950/80 border border-slate-800 text-center">
                    <span className="text-[9px] text-slate-400 block">TEMPO</span>
                    <span className="text-emerald-400 font-bold">{currentBpm} BPM</span>
                  </div>
                </div>
              </div>

              {/* Real-time Waveform Analyser Canvas */}
              <div className="w-full h-32">
                <AudioVisualizer
                  isPlaying={isPlaying}
                  activeColor={currentDataset.colorHex}
                  visualMode="hybrid"
                />
              </div>
            </div>

            {/* Split Explorer Workspace: Left Cards / Center 3D Earth */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: 9 NASA Observation Cards */}
              <div className="lg:col-span-4 xl:col-span-3">
                <DataCards
                  activeDatasetId={selectedDatasetId}
                  onSelectDataset={handleSelectDataset}
                />
              </div>

              {/* Center Column: Interactive 3D Earth Globe */}
              <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                {!accessibility.audioFirstMode ? (
                  <div className="w-full h-[520px] rounded-3xl glass-panel relative overflow-hidden border border-cyan-500/20">
                    <EarthGlobe
                      activeDatasetId={selectedDatasetId}
                      normalizedValue={currentPt.normalizedValue}
                      interactive={true}
                    />

                    {/* HUD Overlay Pill */}
                    <div className="absolute top-4 left-4 z-10 glass-panel px-3.5 py-2 rounded-xl border border-cyan-500/30 flex items-center gap-3">
                      <div 
                        className="w-3 h-3 rounded-full animate-ping"
                        style={{ backgroundColor: currentDataset.colorHex }}
                      />
                      <div>
                        <div className="text-xs font-mono font-bold text-white uppercase">
                          {currentDataset.name}
                        </div>
                        <div className="text-[10px] font-mono text-cyan-300">
                          {currentPt.formattedValue} ({currentPt.year})
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-64 rounded-3xl glass-panel p-8 flex flex-col items-center justify-center text-center border-2 border-cyan-400">
                    <Headphones className="w-12 h-12 text-cyan-400 mb-3 animate-pulse" />
                    <h3 className="text-xl font-bold font-mono text-white mb-2">
                      EARTH JUKEBOX: AUDIO-FIRST MODE ACTIVE
                    </h3>
                    <p className="text-xs text-slate-300 max-w-md">
                      Visual rendering paused to conserve attention and bandwidth.
                      Immerse your senses in pure planetary sonification.
                    </p>
                  </div>
                )}

                {/* Horizontal Timeline Scrubber */}
                <EarthTimeline
                  dataset={currentDataset}
                  currentPointIndex={currentYearIndex}
                  onSelectPointIndex={handleSelectYearIndex}
                  isAudioPlaying={isPlaying}
                  onEnsureAudioPlaying={play}
                />
              </div>
            </div>

            {/* Scientific Mapping Explanation Pipeline */}
            <MappingPanel
              dataset={currentDataset}
              currentFrequency={currentFreq}
              currentNote={currentNote}
              currentBpm={currentBpm}
            />

            {/* Educational Sound Guide & Impact */}
            <SoundExplainer
              dataset={currentDataset}
              currentFreq={currentFreq}
              currentNote={currentNote}
              currentBpm={currentBpm}
            />

            {/* Gamification Discovery Badges */}
            <ListenerBadges unlockedBadges={unlockedBadges} />
          </div>
        )}

        {/* 3. EARTH JUKEBOX STORIES */}
        {activeTab === 'jukebox' && (
          <div className="flex flex-col gap-6">
            <JukeboxPlayer
              onSelectStory={(story: EarthStory) => {
                handleSelectDataset(story.datasetId);
                setProfile(story.recommendedProfile);
              }}
              isPlaying={isPlaying}
              onTogglePlay={togglePlay}
            />
          </div>
        )}

        {/* 4. EARTH TIMELINE DEDICATED VIEW */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-500/20">
                <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/30">
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white uppercase tracking-wider">
                    EARTH OBSERVATION TIMELINE VOYAGE (1990–2026)
                  </h2>
                  <p className="text-xs text-slate-400">
                    Continuous temporal sonification of multi-decadal planetary metrics.
                  </p>
                </div>
              </div>

              <div className="w-full h-[400px] rounded-2xl glass-panel relative overflow-hidden mb-6 border border-cyan-500/20">
                <EarthGlobe
                  activeDatasetId={selectedDatasetId}
                  normalizedValue={currentPt.normalizedValue}
                  interactive={true}
                />
              </div>

              <EarthTimeline
                dataset={currentDataset}
                currentPointIndex={currentYearIndex}
                onSelectPointIndex={handleSelectYearIndex}
                isAudioPlaying={isPlaying}
                onEnsureAudioPlaying={play}
              />
            </div>
          </div>
        )}

        {/* 5. COMPARE EARTH: THEN vs NOW */}
        {activeTab === 'compare' && (
          <CompareEarth />
        )}

        {/* 6. CREATE YOUR OWN EARTH TRACK */}
        {activeTab === 'creator' && (
          <TrackCreator />
        )}

        {/* 7. SCIENCE & DATA PROVENANCE */}
        {activeTab === 'science' && (
          <SciencePanel dataset={currentDataset} />
        )}

        {/* 8. ACCESSIBILITY MODE */}
        {activeTab === 'accessibility' && (
          <AccessibilityPanel
            settings={accessibility}
            onUpdateSettings={(newSettings) => setAccessibility({ ...accessibility, ...newSettings })}
            dataset={currentDataset}
            currentFrequency={currentFreq}
            currentBpm={currentBpm}
          />
        )}
      </main>

      {/* Persistent Global Floating Audio Bar (when not in Explorer tab) */}
      {activeTab !== 'explorer' && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-panel-glow px-6 py-3 rounded-2xl border border-cyan-400 flex items-center gap-5 shadow-2xl animate-in slide-in-from-bottom-5">
          <button
            onClick={togglePlay}
            className={`p-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
              isPlaying ? 'bg-red-500 text-white' : 'bg-cyan-500 text-space-950'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <div className="text-xs font-mono">
            <div className="font-bold text-white truncate max-w-[160px]">{currentDataset.shortName}</div>
            <div className="text-[10px] text-cyan-300">{currentFreq} Hz • {currentNote} • {currentBpm} BPM</div>
          </div>

          <div className="w-28 h-8 hidden sm:block">
            <AudioVisualizer isPlaying={isPlaying} activeColor={currentDataset.colorHex} visualMode="waveform" />
          </div>

          <button
            onClick={() => setActiveTab('explorer')}
            className="text-[10px] font-mono text-cyan-400 hover:text-white underline"
          >
            OPEN 3D EXPLORER →
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="glass-panel border-t border-cyan-500/20 px-6 py-6 mt-12 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <span>EARTH JUKEBOX • NASA SPACE APPS CHALLENGE 2026</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowJudgeMode(true)} className="hover:text-cyan-300 transition-colors">
            JUDGE MODE DOSSIER
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('science')} className="hover:text-cyan-300 transition-colors">
            DATA SOURCES
          </button>
          <span>•</span>
          <button onClick={() => setActiveTab('accessibility')} className="hover:text-cyan-300 transition-colors">
            ACCESSIBILITY
          </button>
        </div>
      </footer>

      {/* Interactive Modals */}
      <JudgeModeModal
        isOpen={showJudgeMode}
        onClose={() => setShowJudgeMode(false)}
      />

      <MissionDemo
        isOpen={showMissionDemo}
        onClose={() => setShowMissionDemo(false)}
        onUpdateDemoState={(_step, dsId, norm, year) => {
          handleSelectDataset(dsId);
          const ds = EARTH_DATASETS[dsId];
          const ptIdx = ds?.dataPoints.findIndex(p => p.year === year) ?? -1;
          if (ptIdx !== -1) setCurrentYearIndex(ptIdx);
          updateFromDataPoint(norm, 0.5, 0.7);
        }}
        onStartAudio={play}
        onStopAudio={stop}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onSelectCategory={(dsId) => {
          handleSelectDataset(dsId);
          setShowOnboarding(false);
          setActiveTab('explorer');
          play();
        }}
        onDismiss={() => {
          setShowOnboarding(false);
          setActiveTab('explorer');
        }}
      />
    </div>
  );
};
