# EARTH JUKEBOX — "HEAR OUR PLANET CHANGE"
### Official Submission for the NASA Space Apps Challenge 2026

[![NASA Space Apps Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2026-0B3D91?style=for-the-badge&logo=nasa)](https://www.spaceappschallenge.org/)
[![Web Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20API-00e5ff?style=for-the-badge)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
[![Three.js](https://img.shields.io/badge/3D%20Globe-Three.js%20WebGL-000000?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.2%20AAA%20Target-10b981?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **NASA Challenge Statement:**
> NASA’s Earth Information Center (EIC) produces stunning visualizations of our changing planet, but presenting Earth science through visualization alone limits who can reach it. The challenge is to build an "Earth Jukebox" — an interface, script, or application that pairs EIC visual frames with dynamic sonifications generated in real time.
>
> **The Solution:**
> **Earth Jukebox** transforms multi-decadal NASA Earth science observations into an immersive, mathematically explainable, multisensory experience where users can **SEE, HEAR, and INTERACT** with planetary changes in real-time.

---

## 🌎 1. Core Product Pipeline

```
NASA Earth Observation Data (EOSDIS / EIC / GHRSST / GISTEMP)
                      ↓
           Data Processing Pipeline
  (Validation → Cleaning → Min-Max / Log Normalization)
                      ↓
           Scientific Sonification Engine
(Carrier Pitch Modulation + Tempo Delta + Harmonic Stacking + Panners)
                      ↓
         Real-Time Multisensory Interface
(Three.js 3D Earth + 1024-FFT Waveform + WCAG AAA Accessibility)
                      ↓
            Human Understanding
```

Every acoustic parameter has an **explainable, transparent relationship** to the underlying NASA observation. Sound is not randomized noise; it is mathematically derived telemetry.

---

## ✨ 2. Major Features Implemented

### 🛰 Cinematic Landing Page
- Deep space background with subtle stars, Rayleigh atmospheric glow, and custom procedural shaders.
- Slowly rotating interactive 3D Earth responding to mouse movement, dragging, and scroll zoom.
- Subtle sci-fi orbital ring and live audio waveform ribbon.
- Real-time status indicators:
  - `● EARTH SYSTEM OBSERVATION ACTIVE`
  - `● DEMO DATA MODE` (or `● LIVE NASA DATA` when API credentials are provided).
- Explicit user interaction gate: **Zero autoplay** before user interaction.

### 🌐 Interactive 3D Earth (Three.js WebGL)
- Procedurally synthesized high-resolution continental landmasses, deep oceans, and specular cloud drift.
- Real-time dynamic layer visualization for **all 9 NASA observation streams**:
  - **Global Temperature**: Thermal heatmap radiation layer.
  - **Sea Level**: Oceanic radial expansion volume aura.
  - **Arctic Sea Ice**: Dynamic north polar cap shrinkage/expansion.
  - **Ocean Temperature**: Marine heatwave thermal currents.
  - **Atmospheric $\text{CO}_2$**: Greenhouse haze boundary layer.
  - **Vegetation (NDVI)**: Biosphere green pulse respiration.
  - **Wildfires**: 3D glowing active fire radiative power beacons across world coordinate fixes.
  - **Precipitation**: Cascading storm cloud bands.
  - **Severe Storms**: Cyclonic atmospheric vortex orbital paths.
- Latitude and Longitude coordinate HUD grid toggle.

### 🎛 Real-Time Browser Sonification Engine (Web Audio API)
- Pure native Web Audio API graph (`AudioContext`, polyphonic `OscillatorNode` arrays, `BiquadFilterNode`, `StereoPannerNode`, and 1024-bin `AnalyserNode`).
- **Mathematical Mappings**:
  - $\text{Temperature} \rightarrow \text{Carrier Pitch } (196\text{ Hz } [G3] - 880\text{ Hz } [A5])$
  - $\text{Rate of Change (Delta)} \rightarrow \text{Rhythmic Tempo } (40\text{ BPM} - 144\text{ BPM})$
  - $\text{Atmospheric }\text{CO}_2 \rightarrow \text{Harmonic Overtone Cluster Density (1–6 Partials)}$
  - $\text{Sea Level Rise} \rightarrow \text{Sub-Bass Resonant Grounding Drone } (55\text{ Hz } [A1] - 165\text{ Hz } [E3])$
  - $\text{Wildfire Radiative Power} \rightarrow \text{Urgent Percussive Crackle & Transient Accents}$
  - $\text{Ocean Temperature} \rightarrow \text{Marine Resonant Formant Filter Sweeps}$
  - $\text{Severe Storms} \rightarrow \text{3D Binaural Spatial Audio Vortex Panning}$
- **6 Scientific Sound Profiles**:
  1. *Ambient Earth*
  2. *Ocean Depths*
  3. *Atmospheric Layers*
  4. *Climate Warning*
  5. *Thermal Firestorm*
  6. *Orbital Telemetry*

### 📊 Real Audio Visualizer (Not Fake Animation)
- Direct hardware link to the Web Audio `AnalyserNode`.
- **Dual Visualizer**:
  1. Real-time oscilloscope time-domain waveform ribbon.
  2. 48-band mirrored FFT frequency spectrum bars.
  3. Audio-reactive particle bursts triggered by acoustic transients.

### 📚 "How Does Earth Become Sound?" Scientific Explanation Panel
- 5-step transparent pipeline:
  `Raw NASA Data` $\rightarrow$ `Min-Max Normalization` $\rightarrow$ `Frequency Mapping` $\rightarrow$ `Musical Pitch` $\rightarrow$ `Live Audio Output`.
- Educational *"What am I hearing?"* guide.

### ⏳ Earth Timeline Voyage (1990–2026)
- Horizontal scrubber spanning 36 years of historical satellite records.
- Playback controls: Previous, Play/Pause, Next.
- Multi-speed playback: `0.5x`, `1x`, `2x`, `5x`.
- Continuous audiovisual travel through time.

### ⚖️ Compare Earth: Then vs Now
- Split-screen comparison: **Earth Historical Baseline** vs **Earth Present Day (2026)**.
- Single-click **"HEAR THE DIFFERENCE"** automated A/B auditory transition.

### 🎵 Earth Jukebox Stories
- 8 curated scientific tracks (*The Warming Planet, Melting Ice, The Breathing Forest, Rising Oceans, The Fire Within, Atmospheric Rhythms, Storm Signals, Ocean Pulse*).
- Category filtering and one-click immersive listening.

### 🎼 Create Your Own Earth Track (Multivariate Synthesizer + Audio Export)
- Choose 3 concurrent observation variables:
  - Primary (Melody Carrier)
  - Secondary (Sub-bass & Harmonics)
  - Third (Rhythmic Percussion)
- Adjust profile, intensity, and tempo.
- **Built-in `MediaRecorder` Audio Capture**: Record your generated Earth Track and download the `.webm` audio composition directly in the browser!

### ♿ Universal Accessibility & Audio-First Mode (Targeting WCAG 2.2 AAA)
- **Audio-First Mode**: Completely hides 3D graphics for users who rely solely on acoustic perception or want a distraction-free experience.
- **Live ARIA Screen Reader Narratives**: Automatically speaks and announces current acoustic descriptors.
- **High Contrast Mode** & **Large Text Mode**.
- **Colorblind Palettes**: Protanopia, Deuteranopia, and Tritanopia compensation filters.
- **Haptic Vibration Feedback**: Device vibration synchronization on supported mobile devices.
- **Keyboard Navigation**:
  - `Space`: Play / Pause Audio
  - `Left` / `Right`: Scrub timeline years
  - `D`: Toggle Judge Mode Dossier

### 🔬 Science Mode & Provenance
- Detailed technical specs: Variable, Unit, Baseline year, DAAC Agency, Satellite Missions, Spatial Resolution, Temporal Resolution, Processing Algorithm, and Normalization Formula.
- Official NASA citation links.

### 🚀 Mission Demo (60–90s Flight Path)
- One-click automated demonstration for hackathon presentations.
- 8-stage sequence with flight progress bar and fast-forward controls.

### 🏆 Judge Mode (Shortcut: `D`)
- Complete executive dossier displaying the entire challenge journey:
  `Problem` $\rightarrow$ `NASA Data` $\rightarrow$ `Processing` $\rightarrow$ `Sonification` $\rightarrow$ `Accessibility` $\rightarrow$ `Impact`.

---

## 🛰 3. Verified NASA Data Sources

| Phenomenon | Variable | Primary Satellite Missions | Agency / DAAC |
| :--- | :--- | :--- | :--- |
| **Global Temperature** | Surface Temp Anomaly (°C) | Combined GHCNv4 + ERSSTv5 | NASA GISS |
| **Sea Level** | Global Mean Rise (mm) | TOPEX/Poseidon, Jason-1/2/3, Sentinel-6 | NASA PO.DAAC |
| **Arctic Sea Ice** | September Minimum Extent ($10^6 \text{km}^2$) | Nimbus-7 SMMR, DMSP SSM/I-SSMIS | NSIDC / NASA GSFC |
| **Ocean Temperature**| Sea Surface Temp Anomaly (°C) | MODIS, AMSR-E, Sentinel-3 SLSTR | NASA JPL MUR SST |
| **Atmospheric $\text{CO}_2$**| Column-Averaged Dry Air (ppm) | OCO-2, OCO-3, Mauna Loa Observatory | NOAA GML / NASA JPL |
| **Vegetation (NDVI)**| Normalized Veg Index (0–1) | MODIS (Terra & Aqua) | NASA LP DAAC |
| **Active Wildfires** | Fire Radiative Power (MW) | MODIS + VIIRS (Suomi NPP & NOAA-20) | NASA FIRMS / ESDIS |
| **Precipitation** | Rainfall Anomaly (mm/day) | GPM Core Observatory + Constellation | NASA GES DISC IMERG |
| **Severe Storms** | Accumulated Cyclone Energy (ACE) | GOES, Meteosat, Himawari, CYGNSS | NOAA NHC / NASA EIC |

---

## 💻 4. Getting Started & Running Locally

### Prerequisites
- **Node.js**: v18.0.0+ (compatible with v19.x and v20.x)
- **npm**: 9.x or later

### Installation

```bash
# 1. Navigate to the project root
cd C:\Users\shara\.gemini\antigravity\scratch\earth-jukebox

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open your browser and navigate to:
**`http://localhost:3000`**

### Production Build & Preview

```bash
# Build production bundle with TypeScript check
npm run build

# Preview production build locally
npm run preview
```

---

## 🔑 5. NASA API Configuration

Earth Jukebox includes a data abstraction service (`EarthDataService.ts`). To connect your NASA Open API key:

Create a `.env` file in the project root:

```env
VITE_NASA_API_KEY=YOUR_NASA_API_KEY
VITE_NASA_DATA_ENDPOINT=https://api.nasa.gov
VITE_ENABLE_LIVE_NASA_DATA=false
```

- When `VITE_ENABLE_LIVE_NASA_DATA=false`, the app runs in **Calibrated Benchmark Mode** utilizing validated historical NASA observations.
- When `VITE_ENABLE_LIVE_NASA_DATA=true` and a key is provided, it connects to live NASA API endpoints.
- The interface transparently displays `● LIVE NASA DATA` or `● DEMO DATA MODE`.

---

## 👥 6. Hackathon Presentation Notes

- **Quick Demo**: Click `MISSION DEMO` in the top header for an automated 60-second tour.
- **Judge Review**: Press **`D`** on your keyboard at any time to open the **Judge Mode Dossier**.
- **Audio Verification**: Click `START LISTENING`, switch across different datasets, and observe both the real-time FFT spectrum and frequency readout adjusting dynamically.
