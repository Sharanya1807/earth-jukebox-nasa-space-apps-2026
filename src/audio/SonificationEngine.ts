import { SoundProfileId } from '../types';
import { SOUND_PROFILES } from './soundProfiles';
import { 
  normalizedToFrequency, 
  deltaToTempo, 
  frequencyToNoteName, 
  intensityToFilterQ,
  co2ToHarmonicsCount
} from '../utils/dataToSound';

/**
 * High-performance Web Audio API Sonification Engine
 * Transforms NASA Earth variables into multi-layered acoustic compositions in real-time.
 */
export class SonificationEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private pannerNode: StereoPannerNode | null = null;
  private mediaStreamDest: MediaStreamAudioDestinationNode | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  // Active oscillators for harmonic synthesis
  private primaryOsc: OscillatorNode | null = null;
  private subBassOsc: OscillatorNode | null = null;
  private harmonicOscs: OscillatorNode[] = [];
  private harmonicGains: GainNode[] = [];

  // Rhythm sequencer state
  private rhythmTimerId: number | null = null;
  private isRunning: boolean = false;

  // Current acoustic parameters
  private currentFreq: number = 220;
  private currentBpm: number = 72;
  private currentVolume: number = 0.65;
  private currentIntensity: number = 0.5;
  private currentProfile: SoundProfileId = 'ambient';

  // Listeners for UI telemetry
  private onTelemetryUpdate?: (freq: number, note: string, bpm: number) => void;

  constructor() {
    // AudioContext will be initialized on first explicit user gesture
  }

  /**
   * Initializes Web Audio Context upon user interaction
   */
  public async initAudio(): Promise<boolean> {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);

      // Real-time Web Audio Analyser node for FFT and waveform visualizers
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.85;

      // Master Filter Node
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(1200, this.ctx.currentTime);
      this.filterNode.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Spatial Stereo Panner
      if (this.ctx.createStereoPanner) {
        this.pannerNode = this.ctx.createStereoPanner();
        this.pannerNode.pan.setValueAtTime(0, this.ctx.currentTime);
      }

      // Chain: Sources -> Filter -> Panner -> MasterGain -> Analyser -> Destination
      if (this.pannerNode) {
        this.filterNode.connect(this.pannerNode);
        this.pannerNode.connect(this.masterGain);
      } else {
        this.filterNode.connect(this.masterGain);
      }
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      // MediaStream destination for recording audio tracks
      if (this.ctx.createMediaStreamDestination) {
        this.mediaStreamDest = this.ctx.createMediaStreamDestination();
        this.masterGain.connect(this.mediaStreamDest);
      }
    }

    if (this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    return this.ctx.state === 'running';
  }

  /**
   * Set callback for displaying real-time scientific audio readouts in HUD
   */
  public setTelemetryCallback(cb: (freq: number, note: string, bpm: number) => void): void {
    this.onTelemetryUpdate = cb;
  }

  /**
   * Get the AnalyserNode for audio visualization
   */
  public getAnalyserNode(): AnalyserNode | null {
    return this.analyser;
  }

  /**
   * Start generating real-time sonification
   */
  public async start(): Promise<void> {
    const ready = await this.initAudio();
    if (!ready || !this.ctx || !this.filterNode) return;

    if (this.isRunning) return;
    this.isRunning = true;

    this.startContinuousDrone();
    this.startRhythmSequencer();

    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate(this.currentFreq, frequencyToNoteName(this.currentFreq), this.currentBpm);
    }
  }

  /**
   * Stop audio generation cleanly with envelope release
   */
  public stop(): void {
    this.isRunning = false;
    if (this.rhythmTimerId) {
      window.clearTimeout(this.rhythmTimerId);
      this.rhythmTimerId = null;
    }

    this.stopContinuousDrone();
  }

  /**
   * Continuously update sound parameters from Earth data
   */
  public updateParameters(normalizedVal: number, deltaVal: number, intensityVal: number = 0.5): void {
    this.currentFreq = normalizedToFrequency(normalizedVal);
    this.currentBpm = deltaToTempo(Math.abs(deltaVal));
    this.currentIntensity = intensityVal;

    if (!this.ctx || !this.isRunning) return;

    const profile = SOUND_PROFILES[this.currentProfile];
    const now = this.ctx.currentTime;
    const smoothDuration = 0.15; // Smooth audio ramp prevents clicking

    // Update primary carrier frequency
    if (this.primaryOsc) {
      this.primaryOsc.frequency.setTargetAtTime(this.currentFreq, now, smoothDuration);
    }

    // Sub-bass root (one octave lower)
    if (this.subBassOsc) {
      this.subBassOsc.frequency.setTargetAtTime(this.currentFreq * 0.5, now, smoothDuration);
    }

    // Modulate filter cutoff and Q factor based on intensity
    if (this.filterNode) {
      const targetCutoff = Math.max(300, Math.min(6000, this.currentFreq * (2.0 + this.currentIntensity * 4.0)));
      this.filterNode.frequency.setTargetAtTime(targetCutoff, now, smoothDuration);
      this.filterNode.Q.setTargetAtTime(intensityToFilterQ(this.currentIntensity), now, smoothDuration);
    }

    // Modulate harmonic overtones
    const activeHarmonics = co2ToHarmonicsCount(normalizedVal);
    this.harmonicOscs.forEach((osc, idx) => {
      const harmonicMultiplier = idx + 2; // 2nd, 3rd, 4th, 5th harmonic
      osc.frequency.setTargetAtTime(this.currentFreq * harmonicMultiplier, now, smoothDuration);
      
      const gainNode = this.harmonicGains[idx];
      if (gainNode) {
        const targetGain = idx < activeHarmonics ? (0.2 / (idx + 1.5)) * profile.resonance * 0.3 : 0.0001;
        gainNode.gain.setTargetAtTime(targetGain, now, smoothDuration);
      }
    });

    // Notify UI telemetry
    if (this.onTelemetryUpdate) {
      this.onTelemetryUpdate(
        Math.round(this.currentFreq), 
        frequencyToNoteName(this.currentFreq), 
        this.currentBpm
      );
    }
  }

  /**
   * Switch the active acoustic profile (Ambient, Ocean, Atmosphere, Climate, Wildfire, Orbital)
   */
  public setProfile(profileId: SoundProfileId): void {
    this.currentProfile = profileId;
    const profile = SOUND_PROFILES[profileId];

    if (this.ctx && this.filterNode) {
      this.filterNode.type = profile.filterType;
    }

    if (this.primaryOsc) {
      this.primaryOsc.type = profile.oscillatorType;
    }

    // Refresh drone with new profile characteristics if already running
    if (this.isRunning) {
      this.stopContinuousDrone();
      this.startContinuousDrone();
    }
  }

  /**
   * Adjust master gain
   */
  public setVolume(vol: number): void {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.ctx.currentTime, 0.05);
    }
  }

  /**
   * Set stereo panning (-1 to 1) for spatial positioning
   */
  public setPan(panValue: number): void {
    if (this.pannerNode && this.ctx) {
      const clamped = Math.max(-1, Math.min(1, panValue));
      this.pannerNode.pan.setTargetAtTime(clamped, this.ctx.currentTime, 0.08);
    }
  }

  /**
   * Synthesize steady atmospheric drone layers
   */
  private startContinuousDrone(): void {
    if (!this.ctx || !this.filterNode) return;

    const profile = SOUND_PROFILES[this.currentProfile];
    const now = this.ctx.currentTime;

    // Primary Oscillator
    this.primaryOsc = this.ctx.createOscillator();
    this.primaryOsc.type = profile.oscillatorType;
    this.primaryOsc.frequency.setValueAtTime(this.currentFreq, now);

    const primaryGain = this.ctx.createGain();
    primaryGain.gain.setValueAtTime(0.001, now);
    primaryGain.gain.linearRampToValueAtTime(0.35, now + 0.3); // Gentle attack envelope

    this.primaryOsc.connect(primaryGain);
    primaryGain.connect(this.filterNode);
    this.primaryOsc.start(now);

    // Sub-bass layer for planetary grounding
    this.subBassOsc = this.ctx.createOscillator();
    this.subBassOsc.type = 'sine';
    this.subBassOsc.frequency.setValueAtTime(this.currentFreq * 0.5, now);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.25, now + 0.5);

    this.subBassOsc.connect(subGain);
    subGain.connect(this.filterNode);
    this.subBassOsc.start(now);

    // Multi-harmonic overtone oscillators
    this.harmonicOscs = [];
    this.harmonicGains = [];
    for (let i = 0; i < 4; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = profile.oscillatorType;
      osc.frequency.setValueAtTime(this.currentFreq * (i + 2), now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);

      osc.connect(gain);
      gain.connect(this.filterNode);
      osc.start(now);

      this.harmonicOscs.push(osc);
      this.harmonicGains.push(gain);
    }
  }

  /**
   * Stop continuous drone oscillators
   */
  private stopContinuousDrone(): void {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    if (this.primaryOsc) {
      try { this.primaryOsc.stop(now + 0.1); } catch {}
      this.primaryOsc = null;
    }
    if (this.subBassOsc) {
      try { this.subBassOsc.stop(now + 0.1); } catch {}
      this.subBassOsc = null;
    }
    this.harmonicOscs.forEach(osc => {
      try { osc.stop(now + 0.1); } catch {}
    });
    this.harmonicOscs = [];
    this.harmonicGains = [];
  }

  /**
   * Rhythmic pulse sequencer driven by scientific rate-of-change (tempo)
   */
  private startRhythmSequencer(): void {
    if (!this.isRunning) return;

    const intervalMs = (60 / Math.max(30, this.currentBpm)) * 1000;
    this.triggerRhythmicChirp();

    this.rhythmTimerId = window.setTimeout(() => {
      this.startRhythmSequencer();
    }, intervalMs);
  }

  /**
   * Trigger an individual rhythmic acoustic pulse (e.g. telemetry pip, ocean wave pulse, fire burst)
   */
  private triggerRhythmicChirp(): void {
    if (!this.ctx || !this.filterNode) return;

    const now = this.ctx.currentTime;
    const profile = SOUND_PROFILES[this.currentProfile];

    const pulseOsc = this.ctx.createOscillator();
    const pulseGain = this.ctx.createGain();

    pulseOsc.type = profile.id === 'wildfire' ? 'sawtooth' : 'triangle';
    
    // Slight pitch chirp accent
    pulseOsc.frequency.setValueAtTime(this.currentFreq * 1.5, now);
    pulseOsc.frequency.exponentialRampToValueAtTime(this.currentFreq, now + 0.12);

    pulseGain.gain.setValueAtTime(0.001, now);
    pulseGain.gain.linearRampToValueAtTime(0.25 * this.currentIntensity, now + 0.02);
    pulseGain.gain.exponentialRampToValueAtTime(0.0001, now + profile.decayRate);

    pulseOsc.connect(pulseGain);
    pulseGain.connect(this.filterNode);

    pulseOsc.start(now);
    pulseOsc.stop(now + profile.decayRate + 0.05);
  }

  /**
   * Trigger haptic feedback for multisensory mode if supported by browser/device
   */
  public triggerHaptic(durationMs: number = 40): void {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Haptics silently ignored if user disabled or device unsupported
      }
    }
  }

  /**
   * Start recording generated audio stream via MediaRecorder
   */
  public startRecording(): boolean {
    if (!this.mediaStreamDest || typeof MediaRecorder === 'undefined') return false;

    this.recordedChunks = [];
    try {
      this.mediaRecorder = new MediaRecorder(this.mediaStreamDest.stream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };
      this.mediaRecorder.start(100);
      return true;
    } catch (e) {
      console.warn('MediaRecorder error:', e);
      return false;
    }
  }

  /**
   * Stop recording and return audio Blob for downloading
   */
  public async stopRecording(): Promise<Blob | null> {
    if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return null;

    return new Promise((resolve) => {
      if (!this.mediaRecorder) return resolve(null);
      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        this.recordedChunks = [];
        resolve(blob);
      };
      this.mediaRecorder.stop();
    });
  }

  public getIsPlaying(): boolean {
    return this.isRunning;
  }

  public getCurrentFrequency(): number {
    return this.currentFreq;
  }

  public getCurrentBpm(): number {
    return this.currentBpm;
  }

  public getCurrentNote(): string {
    return frequencyToNoteName(this.currentFreq);
  }
}

// Global singleton instance for easy cross-component access
export const globalSonificationEngine = new SonificationEngine();
