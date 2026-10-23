import { useState, useEffect, useCallback } from 'react';
import { globalSonificationEngine } from '../audio/SonificationEngine';
import { SoundProfileId, DatasetId } from '../types';
import { EARTH_DATASETS } from '../data/datasets';

export function useSonification() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolumeState] = useState<number>(0.65);
  const [activeProfile, setActiveProfileState] = useState<SoundProfileId>('ambient');
  const [currentFreq, setCurrentFreq] = useState<number>(220);
  const [currentNote, setCurrentNote] = useState<string>('A3');
  const [currentBpm, setCurrentBpm] = useState<number>(72);
  const [selectedDatasetId, setSelectedDatasetId] = useState<DatasetId>('temperature');

  const currentDataset = EARTH_DATASETS[selectedDatasetId] || EARTH_DATASETS.temperature;

  // Sync telemetry updates from the engine
  useEffect(() => {
    globalSonificationEngine.setTelemetryCallback((freq, note, bpm) => {
      setCurrentFreq(freq);
      setCurrentNote(note);
      setCurrentBpm(bpm);
    });
  }, []);

  const togglePlay = useCallback(async () => {
    if (isPlaying) {
      globalSonificationEngine.stop();
      setIsPlaying(false);
    } else {
      await globalSonificationEngine.start();
      // Update with current dataset point
      const pt = currentDataset.dataPoints[currentDataset.dataPoints.length - 1];
      globalSonificationEngine.updateParameters(pt.normalizedValue, pt.changeRate, 0.6);
      setIsPlaying(true);
    }
  }, [isPlaying, currentDataset]);

  const play = useCallback(async () => {
    if (!isPlaying) {
      await globalSonificationEngine.start();
      const pt = currentDataset.dataPoints[currentDataset.dataPoints.length - 1];
      globalSonificationEngine.updateParameters(pt.normalizedValue, pt.changeRate, 0.6);
      setIsPlaying(true);
    }
  }, [isPlaying, currentDataset]);

  const stop = useCallback(() => {
    globalSonificationEngine.stop();
    setIsPlaying(false);
  }, []);

  const setVolume = useCallback((val: number) => {
    setVolumeState(val);
    globalSonificationEngine.setVolume(val);
  }, []);

  const setProfile = useCallback((profileId: SoundProfileId) => {
    setActiveProfileState(profileId);
    globalSonificationEngine.setProfile(profileId);
  }, []);

  const selectDataset = useCallback((id: DatasetId) => {
    setSelectedDatasetId(id);
    const ds = EARTH_DATASETS[id];
    if (ds) {
      const pt = ds.dataPoints[ds.dataPoints.length - 1];
      globalSonificationEngine.updateParameters(pt.normalizedValue, pt.changeRate, 0.6);
    }
  }, []);

  const updateFromDataPoint = useCallback((normalizedVal: number, changeRate: number, intensity: number = 0.5) => {
    globalSonificationEngine.updateParameters(normalizedVal, changeRate, intensity);
  }, []);

  return {
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
    engine: globalSonificationEngine
  };
}
