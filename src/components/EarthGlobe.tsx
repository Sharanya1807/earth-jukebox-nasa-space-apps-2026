import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { DatasetId } from '../types';

interface EarthGlobeProps {
  activeDatasetId: DatasetId;
  normalizedValue?: number;
  showGrid?: boolean;
  className?: string;
  interactive?: boolean;
}

export const EarthGlobe: React.FC<EarthGlobeProps> = ({
  activeDatasetId,
  normalizedValue = 0.7,
  showGrid = true,
  className = '',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // References to keep Three.js scene elements
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsMeshRef = useRef<THREE.Mesh | null>(null);
  const atmosphereMeshRef = useRef<THREE.Mesh | null>(null);
  const dataLayerGroupRef = useRef<THREE.Group | null>(null);
  const gridGroupRef = useRef<THREE.Group | null>(null);
  const starsGroupRef = useRef<THREE.Points | null>(null);

  // Mouse interaction state
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.0012 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0x223355, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(0x00e5ff, 1.2);
    rimLight.position.set(-5, -2, -4);
    scene.add(rimLight);

    // 3. Background Deep Space Starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 800;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
      const r = 20 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i + 2] = r * Math.cos(phi);

      // Subtle cyan and white stars
      const isCyan = Math.random() > 0.7;
      starColors[i] = isCyan ? 0.3 : 0.9;
      starColors[i + 1] = isCyan ? 0.8 : 0.9;
      starColors[i + 2] = 1.0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    starsGroupRef.current = stars;

    // 4. Procedural High-Res Earth Texture Generation
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const ctx = textureCanvas.getContext('2d')!;

    // Base deep ocean
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, textureCanvas.height);
    oceanGradient.addColorStop(0, '#04132b');
    oceanGradient.addColorStop(0.5, '#07244c');
    oceanGradient.addColorStop(1, '#04132b');
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

    // Continental shapes (Stylized NASA Earth Landmasses)
    ctx.fillStyle = '#1e3a29'; // Base biosphere green
    const drawLandmasses = () => {
      // Eurasia & Africa
      ctx.beginPath();
      ctx.ellipse(1100, 340, 320, 180, 0.1, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(1080, 600, 160, 220, 0.15, 0, Math.PI * 2); // Africa
      ctx.fill();

      // North America
      ctx.beginPath();
      ctx.ellipse(450, 320, 240, 160, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // South America
      ctx.beginPath();
      ctx.ellipse(580, 680, 140, 220, 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Australia
      ctx.beginPath();
      ctx.ellipse(1650, 720, 140, 100, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arctic and Antarctic Polar Ice
      ctx.fillStyle = '#dbeafe';
      ctx.beginPath();
      ctx.rect(0, 0, textureCanvas.width, 90); // North polar cap
      ctx.fill();
      ctx.beginPath();
      ctx.rect(0, 940, textureCanvas.width, 90); // South polar cap
      ctx.fill();
    };
    drawLandmasses();

    const earthTexture = new THREE.CanvasTexture(textureCanvas);
    earthTexture.wrapS = THREE.RepeatWrapping;

    // 5. Earth Sphere
    const earthGeometry = new THREE.SphereGeometry(1.0, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.15,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 6. Cloud Layer
    const cloudsCanvas = document.createElement('canvas');
    cloudsCanvas.width = 1024;
    cloudsCanvas.height = 512;
    const cloudCtx = cloudsCanvas.getContext('2d')!;
    cloudCtx.clearRect(0, 0, 1024, 512);

    // Procedural wispy cloud bands
    cloudCtx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 40; i++) {
      const cx = Math.random() * 1024;
      const cy = 100 + Math.random() * 312;
      const rx = 80 + Math.random() * 180;
      const ry = 15 + Math.random() * 35;
      cloudCtx.beginPath();
      cloudCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      cloudCtx.fill();
    }
    const cloudsTexture = new THREE.CanvasTexture(cloudsCanvas);
    cloudsTexture.wrapS = THREE.RepeatWrapping;

    const cloudsGeometry = new THREE.SphereGeometry(1.025, 48, 48);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    scene.add(cloudsMesh);
    cloudsMeshRef.current = cloudsMesh;

    // 7. Atmospheric Glow Shader / Mesh
    const atmosphereGeometry = new THREE.SphereGeometry(1.09, 48, 48);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 glowColor;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      uniforms: {
        glowColor: { value: new THREE.Color(0x00e5ff) },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);
    atmosphereMeshRef.current = atmosphereMesh;

    // 7b. Subtle Sci-Fi Orbital Ring
    const orbitalRingGeo = new THREE.RingGeometry(1.35, 1.365, 96);
    const orbitalRingMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const orbitalRing = new THREE.Mesh(orbitalRingGeo, orbitalRingMat);
    orbitalRing.rotation.x = Math.PI / 2.3;
    orbitalRing.rotation.y = Math.PI / 8;
    scene.add(orbitalRing);

    // 8. Latitude & Longitude Coordinate HUD Grid
    const gridGroup = new THREE.Group();
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.18,
    });

    // Latitude rings
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * (Math.PI / 180);
      const ringRadius = Math.sin(phi) * 1.04;
      const y = Math.cos(phi) * 1.04;

      const ringGeometry = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * ringRadius, y, Math.sin(theta) * ringRadius));
      }
      ringGeometry.setFromPoints(points);
      const ring = new THREE.Line(ringGeometry, gridMaterial);
      gridGroup.add(ring);
    }

    // Longitude meridians
    for (let lon = 0; lon < 360; lon += 45) {
      const meridianGeometry = new THREE.BufferGeometry();
      const points: THREE.Vector3[] = [];
      const segments = 64;
      const rad = (lon * Math.PI) / 180;
      for (let s = 0; s <= segments; s++) {
        const theta = (s / segments) * Math.PI;
        points.push(new THREE.Vector3(
          Math.sin(theta) * Math.cos(rad) * 1.04,
          Math.cos(theta) * 1.04,
          Math.sin(theta) * Math.sin(rad) * 1.04
        ));
      }
      meridianGeometry.setFromPoints(points);
      const meridian = new THREE.Line(meridianGeometry, gridMaterial);
      gridGroup.add(meridian);
    }
    gridGroup.visible = showGrid;
    scene.add(gridGroup);
    gridGroupRef.current = gridGroup;

    // 9. Dynamic Data Layer Group
    const dataLayerGroup = new THREE.Group();
    scene.add(dataLayerGroup);
    dataLayerGroupRef.current = dataLayerGroup;

    // 10. Mouse Drag & Zoom Controls
    const handleMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current || !interactive || !earthMeshRef.current) return;
      const deltaX = e.clientX - previousMousePositionRef.current.x;
      const deltaY = e.clientY - previousMousePositionRef.current.y;

      earthMeshRef.current.rotation.y += deltaX * 0.005;
      earthMeshRef.current.rotation.x += deltaY * 0.005;

      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += deltaX * 0.005;
        cloudsMeshRef.current.rotation.x += deltaY * 0.005;
      }
      if (dataLayerGroupRef.current) {
        dataLayerGroupRef.current.rotation.y += deltaX * 0.005;
        dataLayerGroupRef.current.rotation.x += deltaY * 0.005;
      }
      if (gridGroupRef.current) {
        gridGroupRef.current.rotation.y += deltaX * 0.005;
        gridGroupRef.current.rotation.x += deltaY * 0.005;
      }

      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      camera.position.z = Math.max(1.8, Math.min(4.5, camera.position.z + e.deltaY * 0.002));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    // Touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && earthMeshRef.current) {
        const dx = e.touches[0].clientX - touchStartX;
        const dy = e.touches[0].clientY - touchStartY;
        earthMeshRef.current.rotation.y += dx * 0.005;
        earthMeshRef.current.rotation.x += dy * 0.005;
        if (cloudsMeshRef.current) cloudsMeshRef.current.rotation.y += dx * 0.005;
        if (dataLayerGroupRef.current) dataLayerGroupRef.current.rotation.y += dx * 0.005;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    };
    domElement.addEventListener('touchstart', handleTouchStart);
    domElement.addEventListener('touchmove', handleTouchMove);

    // 11. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      if (!isDraggingRef.current && earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotationVelocityRef.current.y;
        if (cloudsMeshRef.current) {
          cloudsMeshRef.current.rotation.y += rotationVelocityRef.current.y * 1.25; // Clouds drift slightly faster
        }
        if (dataLayerGroupRef.current) {
          dataLayerGroupRef.current.rotation.y += rotationVelocityRef.current.y;
        }
        if (gridGroupRef.current) {
          gridGroupRef.current.rotation.y += rotationVelocityRef.current.y;
        }
      }

      // Shimmer starfield slightly
      if (starsGroupRef.current) {
        starsGroupRef.current.rotation.y = elapsedTime * 0.0003;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 12. Resize Observer
    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      domElement.removeEventListener('touchmove', handleTouchMove);

      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      cloudsGeometry.dispose();
      cloudsMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
    };
  }, []);

  // Update Grid visibility
  useEffect(() => {
    if (gridGroupRef.current) {
      gridGroupRef.current.visible = showGrid;
    }
  }, [showGrid]);

  // Update Data Layer Overlays based on active dataset
  useEffect(() => {
    const dataGroup = dataLayerGroupRef.current;
    const atmosphereMesh = atmosphereMeshRef.current;
    if (!dataGroup) return;

    // Clear existing overlay objects
    while (dataGroup.children.length > 0) {
      const child = dataGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
        else child.material.dispose();
      }
      dataGroup.remove(child);
    }

    // Set atmosphere glow color based on dataset
    if (atmosphereMesh && atmosphereMesh.material instanceof THREE.ShaderMaterial) {
      const glowUniform = atmosphereMesh.material.uniforms.glowColor;
      if (activeDatasetId === 'temperature') glowUniform.value.setHex(0xff3b30);
      else if (activeDatasetId === 'ocean_temperature') glowUniform.value.setHex(0x06b6d4);
      else if (activeDatasetId === 'wildfire') glowUniform.value.setHex(0xff9500);
      else if (activeDatasetId === 'vegetation') glowUniform.value.setHex(0x10b981);
      else if (activeDatasetId === 'co2') glowUniform.value.setHex(0xeab308);
      else if (activeDatasetId === 'sea_ice') glowUniform.value.setHex(0xa5f3fc);
      else glowUniform.value.setHex(0x00e5ff);
    }

    // 1. Wildfire Active Spots (3D glowing particle beacons)
    if (activeDatasetId === 'wildfire') {
      const fireCount = 45;
      const positions = new Float32Array(fireCount * 3);
      for (let i = 0; i < fireCount; i++) {
        // Distribute fires realistically across land regions (lat: -30 to 60)
        const lat = (Math.random() * 90 - 30) * (Math.PI / 180);
        const lon = (Math.random() * 360) * (Math.PI / 180);
        const radius = 1.015;

        positions[i * 3] = radius * Math.cos(lat) * Math.cos(lon);
        positions[i * 3 + 1] = radius * Math.sin(lat);
        positions[i * 3 + 2] = radius * Math.cos(lat) * Math.sin(lon);

        // Also add a glowing beacon column
        const beaconGeo = new THREE.CylinderGeometry(0.003, 0.012, 0.08, 8);
        const beaconMat = new THREE.MeshBasicMaterial({
          color: 0xff3b00,
          transparent: true,
          opacity: 0.85,
        });
        const beacon = new THREE.Mesh(beaconGeo, beaconMat);
        beacon.position.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
        beacon.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), beacon.position.clone().normalize());
        dataGroup.add(beacon);
      }
    }

    // 2. Temperature Thermal Heatmap Layer
    if (activeDatasetId === 'temperature') {
      const heatGeo = new THREE.SphereGeometry(1.018, 48, 48);
      const heatMat = new THREE.MeshBasicMaterial({
        color: 0xff4500,
        transparent: true,
        opacity: 0.22 + normalizedValue * 0.25,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      const heatMesh = new THREE.Mesh(heatGeo, heatMat);
      dataGroup.add(heatMesh);
    }

    // 2b. Ocean Temperature Marine Heatwave Layer
    if (activeDatasetId === 'ocean_temperature') {
      const oceanGeo = new THREE.SphereGeometry(1.016, 48, 48);
      const oceanMat = new THREE.MeshBasicMaterial({
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.28 + normalizedValue * 0.2,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      dataGroup.add(new THREE.Mesh(oceanGeo, oceanMat));
    }

    // 3. Polar Ice Cap Extent
    if (activeDatasetId === 'sea_ice') {
      const northCapGeo = new THREE.CylinderGeometry(0.35 * (0.5 + normalizedValue * 0.5), 0.5 * (0.5 + normalizedValue * 0.5), 0.1, 32);
      const capMat = new THREE.MeshBasicMaterial({
        color: 0xdbeafe,
        transparent: true,
        opacity: 0.75,
      });
      const northCap = new THREE.Mesh(northCapGeo, capMat);
      northCap.position.set(0, 0.98, 0);
      dataGroup.add(northCap);
    }

    // 4. Sea Level Rise Oceanic Expansion Aura
    if (activeDatasetId === 'sea_level') {
      const seaGeo = new THREE.SphereGeometry(1.025 + normalizedValue * 0.02, 48, 48);
      const seaMat = new THREE.MeshBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending,
      });
      const seaMesh = new THREE.Mesh(seaGeo, seaMat);
      dataGroup.add(seaMesh);
    }

    // 5. Atmospheric CO2 Haze
    if (activeDatasetId === 'co2') {
      const co2Geo = new THREE.SphereGeometry(1.04 + normalizedValue * 0.03, 36, 36);
      const co2Mat = new THREE.MeshBasicMaterial({
        color: 0xfacc15,
        transparent: true,
        opacity: 0.18 + normalizedValue * 0.15,
        blending: THREE.AdditiveBlending,
        wireframe: true,
      });
      dataGroup.add(new THREE.Mesh(co2Geo, co2Mat));
    }

    // 6. Biosphere NDVI Green Pulse
    if (activeDatasetId === 'vegetation') {
      const vegGeo = new THREE.SphereGeometry(1.012, 48, 48);
      const vegMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      dataGroup.add(new THREE.Mesh(vegGeo, vegMat));
    }
  }, [activeDatasetId, normalizedValue]);

  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Floating Orbital Controls Overlay */}
      {interactive && (
        <div className={`absolute bottom-4 left-4 z-10 transition-opacity duration-300 pointer-events-none ${isHovered ? 'opacity-90' : 'opacity-40'}`}>
          <div className="glass-panel px-3 py-1.5 rounded-lg text-xs font-mono text-cyan-300 flex items-center gap-2 border border-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>DRAG TO ROTATE • SCROLL TO ZOOM</span>
          </div>
        </div>
      )}
    </div>
  );
};
