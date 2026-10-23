import React, { useEffect, useRef } from 'react';
import { globalSonificationEngine } from '../audio/SonificationEngine';

interface AudioVisualizerProps {
  isPlaying: boolean;
  activeColor?: string;
  className?: string;
  visualMode?: 'waveform' | 'spectrum' | 'hybrid';
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isPlaying,
  activeColor = '#00e5ff',
  className = '',
  visualMode = 'hybrid',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    const render = () => {
      animationId = requestAnimationFrame(render);

      // Handle retina displays
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
      }

      // Background clearing with soft fade trail
      ctx.fillStyle = 'rgba(7, 11, 25, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint center guide line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      const analyser = globalSonificationEngine.getAnalyserNode();

      if (!analyser || !isPlaying) {
        // Standby telemetry pulse when paused
        const t = performance.now() * 0.002;
        ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + Math.sin(x * 0.02 + t) * 3;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      // Real-time audio FFT data retrieval
      const bufferLength = analyser.frequencyBinCount;
      const freqData = new Uint8Array(bufferLength);
      const timeData = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(freqData);
      analyser.getByteTimeDomainData(timeData);

      // Calculate peak energy
      let totalEnergy = 0;
      for (let i = 0; i < 64; i++) {
        totalEnergy += freqData[i];
      }
      const avgEnergy = totalEnergy / 64;

      // Spawn reactive audio particles on energetic bursts
      if (avgEnergy > 90 && Math.random() > 0.4 && particles.length < 50) {
        particles.push({
          x: width / 2 + (Math.random() - 0.5) * (width * 0.4),
          y: height / 2 + (Math.random() - 0.5) * 40,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          life: 1.0,
          color: activeColor,
        });
      }

      // 1. Draw Spectrum Bars (Hybrid or Spectrum mode)
      if (visualMode === 'spectrum' || visualMode === 'hybrid') {
        const barCount = 48;
        const barWidth = (width / barCount) * 0.7;
        const gap = (width / barCount) * 0.3;

        for (let i = 0; i < barCount; i++) {
          // Bin scaling for musical frequency distribution
          const dataIndex = Math.floor(Math.pow(i / barCount, 1.8) * 180);
          const val = freqData[dataIndex] || 0;
          const barHeight = (val / 255) * (height * 0.42);

          const x = i * (barWidth + gap) + gap / 2;
          const yTop = height / 2 - barHeight;
          const yBottom = height / 2;

          // Gradient bar fill
          const grad = ctx.createLinearGradient(0, yTop, 0, yBottom + barHeight);
          grad.addColorStop(0, activeColor);
          grad.addColorStop(0.5, 'rgba(0, 229, 255, 0.6)');
          grad.addColorStop(1, 'rgba(11, 61, 145, 0.1)');

          ctx.fillStyle = grad;
          // Upper reflection
          ctx.fillRect(x, yTop, barWidth, barHeight);
          // Lower mirror reflection
          ctx.fillRect(x, yBottom, barWidth, barHeight * 0.6);
        }
      }

      // 2. Draw Real Oscilloscope Time-Domain Waveform
      if (visualMode === 'waveform' || visualMode === 'hybrid') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = activeColor;
        ctx.shadowColor = activeColor;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);

          x += sliceWidth;
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // reset
      }

      // 3. Render and update reactive particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life * 0.8;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, activeColor, visualMode]);

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl bg-space-900/80 border border-cyan-500/20 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
      
      {/* Telemetry Status Tag */}
      <div className="absolute top-2.5 right-3 flex items-center gap-2 pointer-events-none">
        <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-cyan-400 animate-ping' : 'bg-slate-600'}`} />
        <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300/80">
          {isPlaying ? 'LIVE AUDIO ANALYSER • 1024 FFT' : 'STANDBY • READY'}
        </span>
      </div>
    </div>
  );
};
