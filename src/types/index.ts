export type DatasetId = 
  | 'temperature'
  | 'sea_level'
  | 'sea_ice'
  | 'ocean_temperature'
  | 'co2'
  | 'vegetation'
  | 'wildfire'
  | 'precipitation'
  | 'storms';

export type SoundProfileId = 
  | 'ambient'
  | 'ocean'
  | 'atmosphere'
  | 'climate'
  | 'wildfire'
  | 'orbital';

export interface SoundProfile {
  id: SoundProfileId;
  name: string;
  description: string;
  oscillatorType: OscillatorType;
  filterType: BiquadFilterType;
  baseFrequency: number;
  harmonicCount: number;
  resonance: number;
  decayRate: number;
}

export interface SoundMappingInfo {
  primaryParam: string;      // e.g. "Pitch / Frequency"
  frequencyRange: string;    // e.g. "220 Hz (A3) – 880 Hz (A5)"
  noteRange: string;         // e.g. "A3 – A5"
  rateParam: string;         // e.g. "Tempo / Pulse Rate (40 – 160 BPM)"
  intensityParam: string;    // e.g. "Harmonic Distortion / Gain"
  timbre: string;            // e.g. "Warm Triangle with Sine Overtone"
  explanation: string;       // Plain language scientific sonification rule
}

export interface DataSourceInfo {
  name: string;
  agency: string;            // "NASA Goddard Institute for Space Studies (GISS)", etc.
  satelliteMission: string;  // e.g. "MODIS / Terra / Aqua / GRACE / AIRS"
  spatialResolution: string; // e.g. "2° × 2° grid"
  temporalResolution: string;// e.g. "Monthly (1880–present)"
  processingMethod: string;  // e.g. "GISTEMP v4 anomaly analysis relative to 1951-1980 baseline"
  normalizationMethod: string;// e.g. "Min-Max linear feature scaling [0.0 - 1.0] with clamp"
  apiEndpoint?: string;
  citationUrl: string;
  isLiveAvailable: boolean;
}

export interface DataPoint {
  year: number;
  month?: number;
  dateStr: string;
  value: number;
  formattedValue: string;
  normalizedValue: number; // 0.0 - 1.0
  delta: number;           // change relative to prior or baseline
  changeRate: number;      // rate of change / trend
  anomaly?: number;
}

export interface EarthDataset {
  id: DatasetId;
  name: string;
  shortName: string;
  icon: string;
  unit: string;
  symbol: string;
  currentValue: number;
  currentFormatted: string;
  trend: 'increasing' | 'decreasing' | 'stable';
  trendRateStr: string;
  minVal: number;
  maxVal: number;
  baselineYear?: number;
  description: string;
  soundMapping: SoundMappingInfo;
  source: DataSourceInfo;
  dataPoints: DataPoint[];
  colorHex: string;
  globeLayerType: 'heatmap' | 'polar_cap' | 'event_points' | 'atmospheric_haze' | 'biosphere' | 'ocean_height';
}

export interface EarthStory {
  id: string;
  title: string;
  subtitle: string;
  summary: string;
  datasetId: DatasetId;
  timePeriod: string;
  keyObservation: string;
  sonificationGoal: string;
  recommendedProfile: SoundProfileId;
  tags: string[];
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  audioFirstMode: boolean;
  reducedMotion: boolean;
  colorblindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  screenReaderAnnounce: boolean;
  hapticFeedback: boolean;
}

export interface SonificationState {
  isPlaying: boolean;
  volume: number;        // 0 to 1
  tempo: number;         // BPM multiplier or base BPM (e.g. 70)
  pitchMultiplier: number;// 0.5 to 2.0
  intensity: number;     // 0 to 1
  activeProfile: SoundProfileId;
  currentFreq: number;
  currentNote: string;
  currentBpm: number;
}

export interface CustomTrackLayer {
  datasetId: DatasetId;
  role: 'lead_melody' | 'bass_drone' | 'rhythm_pulse';
  volume: number;
  enabled: boolean;
}

export interface CustomTrackConfig {
  title: string;
  primaryDataset: DatasetId;
  secondaryDataset: DatasetId;
  rhythmDataset: DatasetId;
  profile: SoundProfileId;
  baseTempo: number;
  intensity: number;
}
