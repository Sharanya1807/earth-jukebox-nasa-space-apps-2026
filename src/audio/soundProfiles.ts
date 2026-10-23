import { SoundProfile, SoundProfileId } from '../types';

export const SOUND_PROFILES: Record<SoundProfileId, SoundProfile> = {
  ambient: {
    id: 'ambient',
    name: 'Ambient Earth',
    description: 'Warm, continuous acoustic drone with subtle planetary resonance.',
    oscillatorType: 'triangle',
    filterType: 'lowpass',
    baseFrequency: 220,
    harmonicCount: 2,
    resonance: 2.0,
    decayRate: 1.2
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Depths',
    description: 'Deep resonant sub-bass with undulating fluid harmonic modulation.',
    oscillatorType: 'sine',
    filterType: 'bandpass',
    baseFrequency: 110,
    harmonicCount: 3,
    resonance: 3.5,
    decayRate: 2.0
  },
  atmosphere: {
    id: 'atmosphere',
    name: 'Atmospheric Layers',
    description: 'High-register crystalline tones reflecting gas density and circulation.',
    oscillatorType: 'sine',
    filterType: 'highpass',
    baseFrequency: 440,
    harmonicCount: 4,
    resonance: 1.8,
    decayRate: 0.8
  },
  climate: {
    id: 'climate',
    name: 'Climate Warning',
    description: 'Tense, evolving multi-frequency structure signaling rapid planetary shifts.',
    oscillatorType: 'sawtooth',
    filterType: 'lowpass',
    baseFrequency: 261.63,
    harmonicCount: 4,
    resonance: 4.5,
    decayRate: 0.5
  },
  wildfire: {
    id: 'wildfire',
    name: 'Thermal Firestorm',
    description: 'Urgent rhythmic percussion with crackling high-frequency distortion pulses.',
    oscillatorType: 'sawtooth',
    filterType: 'bandpass',
    baseFrequency: 330,
    harmonicCount: 5,
    resonance: 6.0,
    decayRate: 0.3
  },
  orbital: {
    id: 'orbital',
    name: 'Orbital Telemetry',
    description: 'NASA satellite downlink pulses with crisp geometric sine arpeggios.',
    oscillatorType: 'sine',
    filterType: 'lowpass',
    baseFrequency: 523.25,
    harmonicCount: 2,
    resonance: 2.2,
    decayRate: 0.4
  }
};
