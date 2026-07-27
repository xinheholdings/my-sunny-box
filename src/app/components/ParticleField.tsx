"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;
    const activeCanvas = canvas;
    const activeContext = context;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let particles: Particle[] = [];
    let frame = 0;
    let width = 0;
    let height = 0;
    let isVisible = true;

    function resize() {
      width = window.innerWidth;
      height = Math.min(window.innerHeight * 1.25, 980);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      activeCanvas.width = width * ratio;
      activeCanvas.height = height * ratio;
      activeCanvas.style.width = `${width}px`;
      activeCanvas.style.height = `${height}px`;
      activeContext.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = reducedMotion ? 12 : width < 640 ? 20 : 42;
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: Math.random() * 1.3 + 0.4,
        alpha: Math.random() * 0.45 + 0.15,
      }));
    }

    function draw() {
      activeContext.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          if (particle.x < 0 || particle.x > width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        }
        activeContext.beginPath();
        activeContext.fillStyle = `rgba(92, 244, 255, ${particle.alpha})`;
        activeContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        activeContext.fill();
      }

      if (!reducedMotion) {
        activeContext.strokeStyle = "rgba(92, 244, 255, 0.055)";
        activeContext.lineWidth = 0.6;
        for (let first = 0; first < particles.length; first += 1) {
          for (let second = first + 1; second < particles.length; second += 1) {
            const dx = particles[first].x - particles[second].x;
            const dy = particles[first].y - particles[second].y;
            if (dx * dx + dy * dy < 115 * 115) {
              activeContext.beginPath();
              activeContext.moveTo(particles[first].x, particles[first].y);
              activeContext.lineTo(particles[second].x, particles[second].y);
              activeContext.stroke();
            }
          }
        }
      }

      if (isVisible && !reducedMotion) frame = requestAnimationFrame(draw);
    }

    function handleVisibility() {
      isVisible = !document.hidden;
      if (isVisible && !reducedMotion) {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(draw);
      }
    }

    resize();
    draw();
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="particleField" aria-hidden="true" />;
}
