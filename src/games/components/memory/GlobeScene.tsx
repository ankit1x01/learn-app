import React, { useRef, useEffect, useState } from "react";

export type VisualMode = "wave" | "particles" | "spectrum" | "wordHighlight";

export function GlobeScene({
  phase,
  isNarrating,
  audioEnergy,
  visualMode = "wave",
  currentWord,
  totalWords,
  wordProgress,
}: {
  phase: 0 | 1 | 2 | 3 | 4;
  isNarrating: boolean;
  audioEnergy: number;
  visualMode?: VisualMode;
  currentWord?: string;
  totalWords?: number;
  wordProgress?: number; // 0-1
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const [hueShift, setHueShift] = useState(0);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 300;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const baseAmplitude = 40;
    const frequency = 0.02;
    const speed = 2;

    // Color shifting based on progress
    const hue = (wordProgress ?? 0) * 360;

    const drawWave = (
      amplitude: number,
      opacity: number,
      thickness: number,
      phaseOffset: number,
      color: string = "rgba(0, 229, 255, ",
    ) => {
      const yOffset = height / 2;

      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, color + "0)");
      gradient.addColorStop(0.5, color + `${opacity})`);
      gradient.addColorStop(1, color + "0)");

      ctx.strokeStyle = gradient;
      ctx.lineWidth = thickness;
      ctx.lineCap = "round";

      ctx.shadowColor = color + "0.8)";
      ctx.shadowBlur = 20;

      ctx.beginPath();

      for (let x = 0; x < width; x += 2) {
        const noise = Math.sin((x + timeRef.current) * 0.01) * 5;

        const y =
          yOffset +
          Math.sin((x + timeRef.current + phaseOffset) * frequency) *
            amplitude +
          noise;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const drawSpectrum = () => {
      const yOffset = height / 2;
      const barCount = 40;
      const barWidth = width / barCount;

      for (let i = 0; i < barCount; i++) {
        const barHeight =
          (Math.sin((i + timeRef.current * 0.05) * 0.1 + audioEnergy * Math.PI) + 1) *
          30 *
          audioEnergy;

        const hueVal = (i / barCount * 360 + hue) % 360;
        ctx.fillStyle = `hsl(${hueVal}, 100%, 50%)`;
        ctx.fillRect(i * barWidth, yOffset - barHeight / 2, barWidth - 2, barHeight);
      }
    };

    const drawParticles = () => {
      // Update existing particles
      particlesRef.current = particlesRef.current.filter((p) => p.life > 0);

      // Add new particles if narrating
      if (isNarrating && Math.random() > 0.5) {
        const hueVal = (Math.random() * 60 + hue) % 360;
        particlesRef.current.push({
          x: Math.random() * width,
          y: height / 2 + (Math.random() - 0.5) * 100,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 1,
          color: `hsl(${hueVal}, 100%, 50%)`,
        });
      }

      // Draw particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.1; // gravity

        ctx.fillStyle = p.color.replace(")", `, ${p.life})`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (isNarrating) {
        timeRef.current += speed;

        // Update hue for color shifting
        setHueShift((wordProgress ?? 0) * 360);

        const dynamicAmp =
          baseAmplitude * (0.4 + audioEnergy) +
          Math.sin(timeRef.current * 0.05) * 10;
        const pulse = Math.sin(timeRef.current * 0.2) * audioEnergy * 20;

        // Render based on visual mode
        if (visualMode === "wave") {
          const colorRgba = `rgba(0, 229, 255, `;
          drawWave(dynamicAmp + pulse, 0.25, 6, 0, colorRgba);
          drawWave(dynamicAmp * 0.7, 0.2, 4, 20, colorRgba);
          drawWave(dynamicAmp * 0.5, 0.15, 2, 40, colorRgba);

          // Center bright line
          ctx.strokeStyle = "rgba(255,255,255,0.9)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();

          for (let x = 0; x < width; x += 2) {
            const y =
              height / 2 +
              Math.sin((x + timeRef.current) * frequency) *
                dynamicAmp *
                Math.exp(-Math.abs(x - width / 2) * 0.002);

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }

          ctx.stroke();
        } else if (visualMode === "spectrum") {
          drawSpectrum();
        } else if (visualMode === "particles") {
          drawWave(dynamicAmp + pulse, 0.15, 4, 0);
          drawParticles();
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isNarrating]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      
      }}
    />
  );
}
