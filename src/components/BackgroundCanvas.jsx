import React, { useEffect, useRef, useState } from 'react';

const START_FRAME = 1;
const END_FRAME = 80;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 80 frames

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Preload frames into RAM
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = START_FRAME; i <= END_FRAME; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(6, '0');
      img.src = `/thor-frames/frame_${frameNum}.webp`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount >= 5) {
          setIsPreloaded(true);
        }
      };
      img.onerror = () => {
        setIsPreloaded(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;

    // Fallback timer so canvas starts rendering within 300ms under any network state
    const timer = setTimeout(() => setIsPreloaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Pure 60FPS Scroll-Driven Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetFrameRef.current = scrollFraction * (TOTAL_FRAMES - 1);
    };

    let animId;
    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.18; // Smooth 60fps lerp interpolation

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const img = imagesRef.current[frameIdx];

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw rich glowing ambient HSL background gradient so background is NEVER blank
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#0b132b');
      grad.addColorStop(0.5, '#111827');
      grad.addColorStop(1, '#070a12');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (img && img.complete && (img.naturalWidth > 0 || img.width > 0)) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height || 1;
        const imgRatio = w / h;
        const canvasRatio = canvas.width / (canvas.height || 1);
        let renderW, renderH, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          renderW = canvas.width;
          renderH = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - renderH) / 2;
        } else {
          renderW = canvas.height * imgRatio;
          renderH = canvas.height;
          offsetX = (canvas.width - renderW) / 2;
          offsetY = 0;
        }

        ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPreloaded]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: -1, pointerEvents: 'none',
        objectFit: 'cover'
      }}
    />
  );
}
