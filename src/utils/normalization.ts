/**
 * Scientific Data Normalization Pipeline for NASA Earth Observations
 * Transforms raw scientific metrics (deg C, ppm, Gt, mm, etc.) into clean [0, 1] normalized signals
 * suitable for real-time auditory parameter modulation.
 */

export interface NormalizationRange {
  min: number;
  max: number;
}

/**
 * Linear Min-Max normalization with safe clamping to [0, 1]
 */
export function normalizeMinMax(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  const clamped = Math.max(min, Math.min(max, value));
  return (clamped - min) / (max - min);
}

/**
 * Logarithmic normalization for wide dynamic range phenomena (e.g. fire intensity, storm energy)
 */
export function normalizeLog(value: number, min: number, max: number): number {
  const safeVal = Math.max(1e-5, value);
  const safeMin = Math.max(1e-5, min);
  const safeMax = Math.max(1e-5, max);
  const logVal = Math.log10(safeVal);
  const logMin = Math.log10(safeMin);
  const logMax = Math.log10(safeMax);
  return normalizeMinMax(logVal, logMin, logMax);
}

/**
 * Anomaly normalization: zero-centered deviation mapped to [-1, 1], then converted to [0, 1]
 */
export function normalizeAnomaly(value: number, baseline: number, maxDeviation: number): number {
  const diff = value - baseline;
  const clampedDiff = Math.max(-maxDeviation, Math.min(maxDeviation, diff));
  return 0.5 + (clampedDiff / (2 * maxDeviation));
}

/**
 * Exponential moving average (EMA) smoothing for audio parameter continuity.
 * Prevents abrupt acoustic clicks or perceptual jarring.
 */
export class ParameterSmoother {
  private currentValue: number;
  private smoothingFactor: number; // 0 (slowest) to 1 (instant)

  constructor(initialValue: number = 0.5, smoothingFactor: number = 0.15) {
    this.currentValue = initialValue;
    this.smoothingFactor = smoothingFactor;
  }

  public target(nextValue: number): number {
    this.currentValue = this.currentValue + this.smoothingFactor * (nextValue - this.currentValue);
    return this.currentValue;
  }

  public get(): number {
    return this.currentValue;
  }

  public set(value: number): void {
    this.currentValue = value;
  }
}
