import { EarthStory } from '../types';

export const EARTH_STORIES: EarthStory[] = [
  {
    id: 'warming_planet',
    title: 'The Warming Planet',
    subtitle: 'A Century of Shifting Thermal Frequencies',
    summary: 'Trace global mean surface temperature anomalies from 1990 to 2026. Listen as the carrier pitch climbs steadily upwards into tense harmonic registers.',
    datasetId: 'temperature',
    timePeriod: '1990 – 2026',
    keyObservation: '+1.28°C global anomaly recorded relative to pre-industrial baselines.',
    sonificationGoal: 'Listen to the steady upward glide in carrier pitch, punctuated by accelerated tempo during record-breaking El Niño years.',
    recommendedProfile: 'climate',
    tags: ['Temperature', 'GISTEMP', 'Climate Crisis']
  },
  {
    id: 'breathing_forest',
    title: 'The Breathing Forest',
    subtitle: 'Photosynthetic Pulse of the Global Biosphere',
    summary: 'Experience the planetary inhalation of carbon and seasonal foliage blooming detected by NASA MODIS Terra and Aqua satellites.',
    datasetId: 'vegetation',
    timePeriod: '2000 – 2026',
    keyObservation: 'Seasonal amplitude oscillations reflecting Northern Hemisphere deciduous forest greening.',
    sonificationGoal: 'Hear the gentle swelling of warm vowel formant filters as photosynthetic activity peaks in boreal summer.',
    recommendedProfile: 'ambient',
    tags: ['Biosphere', 'MODIS', 'Carbon Sink']
  },
  {
    id: 'melting_ice',
    title: 'Melting Ice: The Disappearing Choir',
    subtitle: 'Cryospheric Shrinkage Across the Arctic Cap',
    summary: 'Arctic summer sea ice minimum extent has plummeted by over 40% since satellite tracking began. Hear how high crystalline overtones thin out.',
    datasetId: 'sea_ice',
    timePeriod: '1990 – 2026',
    keyObservation: 'Record low polar ice extent leaves open dark ocean water that accelerates further absorption.',
    sonificationGoal: 'High-frequency bell-like harmonics gradually dissolve, leaving a muted, hollow low-frequency resonance.',
    recommendedProfile: 'atmosphere',
    tags: ['Cryosphere', 'Polar Albedo', 'NSIDC']
  },
  {
    id: 'rising_oceans',
    title: 'Rising Oceans: The Deepening Basin',
    subtitle: 'Decadal Altimetry of Planetary Water Expansion',
    summary: 'Satellite altimeters from TOPEX to Sentinel-6 track millimeter-level thermal expansion and meltwater runoff entering world oceans.',
    datasetId: 'sea_level',
    timePeriod: '1993 – 2026',
    keyObservation: 'Over 100 mm of global mean sea level rise accumulated over three decades.',
    sonificationGoal: 'Immerse in a deepening sub-bass drone whose fundamental frequency resonates lower and wider as water mass expands.',
    recommendedProfile: 'ocean',
    tags: ['Oceans', 'Altimetry', 'Sentinel-6']
  },
  {
    id: 'fire_within',
    title: 'The Fire Within: Thermal Anomalies',
    subtitle: 'Radiative Energy Outbreaks Across Continents',
    summary: 'NASA FIRMS instruments pinpoint active wildfire hotspots across the Amazon, Siberia, Australia, and North America in near-real-time.',
    datasetId: 'wildfire',
    timePeriod: '2000 – 2026',
    keyObservation: 'Extreme megafires exhibit unprecedented fire radiative power (FRP) and pyrocumulonimbus storm creation.',
    sonificationGoal: 'Percussive sparks and crackles accelerate into driving syncopated bursts as regional fire radiative power spikes.',
    recommendedProfile: 'wildfire',
    tags: ['Wildfires', 'FIRMS', 'Pyrosphere']
  },
  {
    id: 'atmospheric_blanket',
    title: 'Atmospheric Rhythms: The CO2 Blanket',
    subtitle: 'The Inescapable Accumulation of Heat-Trapping Gases',
    summary: 'Follow the relentless sawtooth climb of atmospheric CO2 from 354 ppm in 1990 to over 426 ppm today, as measured at Mauna Loa and by NASA OCO-2.',
    datasetId: 'co2',
    timePeriod: '1990 – 2026',
    keyObservation: 'Unbroken historical upward trajectory far exceeding any natural cycle in the last 800,000 years.',
    sonificationGoal: 'Experience the acoustic sensation of suffocation as each decade adds denser, microtonally clustered harmonic overtones.',
    recommendedProfile: 'climate',
    tags: ['Atmosphere', 'OCO-2', 'Greenhouse Gas']
  },
  {
    id: 'storm_signals',
    title: 'Storm Signals: Cyclonic Vortices',
    subtitle: 'Kinetic Energy Swirls Over Warming Seas',
    summary: 'Accumulated Cyclone Energy across global tropical basins reveals intensified hurricane intensification windows.',
    datasetId: 'storms',
    timePeriod: '1990 – 2026',
    keyObservation: 'Higher Category 4 and 5 hurricane proportion linked to elevated ocean thermal heat content.',
    sonificationGoal: 'Binaural spatial audio rotates sound dynamically in 3D around the headphones, mimicking ferocious cyclonic rotation.',
    recommendedProfile: 'orbital',
    tags: ['Hurricanes', 'ACE', 'CYGNSS']
  },
  {
    id: 'ocean_pulse',
    title: 'Hydrologic Cascade: Extreme Precipitation',
    subtitle: 'Global Water Cycles in an Energetic Troposphere',
    summary: 'NASA GPM constellation monitors world rainfall anomalies showing amplified wet and dry extremes across continents.',
    datasetId: 'precipitation',
    timePeriod: '2000 – 2026',
    keyObservation: 'Every 1°C of warming increases atmospheric moisture-holding capacity by approximately 7%.',
    sonificationGoal: 'Liquid marimba-like cascading notes trigger with rapid rhythmic velocity during intense rain events.',
    recommendedProfile: 'ambient',
    tags: ['Water Cycle', 'GPM', 'Precipitation']
  }
];
