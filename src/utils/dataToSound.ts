/**
 * Data to Sound Mapping System
 * Converts normalized NASA Earth data [0, 1] into musical frequencies,
 * rhythmic BPMs, harmonic overtone densities, and note representations.
 */

// Scientific standard A4 = 440 Hz
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

/**
 * Pentatonic Minor Scale relative to A (A, C, D, E, G)
 * Creates pleasant, ambient yet dramatic scientific landscapes without dissonant clashes
 */
export const SCIENTIFIC_PENTATONIC_FREQUENCIES: number[] = [
  // Octave 2
  110.00, 130.81, 146.83, 164.81, 196.00,
  // Octave 3
  220.00, 261.63, 293.66, 329.63, 392.00,
  // Octave 4
  440.00, 523.25, 587.33, 659.25, 783.99,
  // Octave 5
  880.00, 1046.50, 1174.66, 1318.51, 1567.98
];

/**
 * Continuous linear pitch mapping
 */
export function normalizedToFrequency(normalizedVal: number, minFreq: number = 130.81, maxFreq: number = 880.00): number {
  const clamped = Math.max(0, Math.min(1, normalizedVal));
  return minFreq + clamped * (maxFreq - minFreq);
}

/**
 * Quantized pitch mapping to the nearest scale frequency
 */
export function normalizedToQuantizedFrequency(normalizedVal: number): number {
  const clamped = Math.max(0, Math.min(1, normalizedVal));
  const index = Math.round(clamped * (SCIENTIFIC_PENTATONIC_FREQUENCIES.length - 1));
  return SCIENTIFIC_PENTATONIC_FREQUENCIES[index];
}

/**
 * Convert frequency in Hz to nearest musical note name (e.g. 440 -> "A4")
 */
export function frequencyToNoteName(freq: number): string {
  if (freq <= 0) return '---';
  const midi = Math.round(69 + 12 * Math.log2(freq / 440));
  const noteIndex = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/**
 * Map rate of change (delta) to tempo BPM
 * delta range usually -1.0 to +1.0 or normalized 0 to 1
 */
export function deltaToTempo(changeRateNormalized: number, minBpm: number = 48, maxBpm: number = 144): number {
  const clamped = Math.max(0, Math.min(1, changeRateNormalized));
  return Math.round(minBpm + clamped * (maxBpm - minBpm));
}

/**
 * Map atmospheric concentration (e.g. CO2) to harmonic richness (number of overtone layers)
 */
export function co2ToHarmonicsCount(normalizedVal: number): number {
  const clamped = Math.max(0, Math.min(1, normalizedVal));
  // 1 (pure fundamental) up to 5 overtone layers
  return 1 + Math.floor(clamped * 4);
}

/**
 * Map wildfire / storm energy to filter resonance / Q factor and noise gain
 */
export function intensityToFilterQ(normalizedVal: number): number {
  const clamped = Math.max(0, Math.min(1, normalizedVal));
  return 1.0 + clamped * 8.0; // Q from 1.0 to 9.0
}
