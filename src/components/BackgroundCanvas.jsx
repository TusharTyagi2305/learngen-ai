import React, { useEffect, useRef, useState } from 'react';

const START_FRAME = 2;
const END_FRAME = 325;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 324 frames

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Preload all 324 lightweight high-speed 60fps frames into RAM (Total size: ~28MB for instant smooth playback)
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = START_FRAME; i <= END_FRAME; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(6, '0');
      img.src = `/thor-frames/frame_${frameNum}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) {
          setIsPreloaded(true);
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Butter-Smooth 60FPS Canvas Renderer with GPU Lerp Interpolation
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
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetFrameRef.current = scrollFraction * (TOTAL_FRAMES - 1);
    };

    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.18; // Smooth 60fps lerp interpolation

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const img = imagesRef.current[frameIdx];

      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const imgRatio = img.width / img.height;
        const canvasRatio = canvas.width / canvas.height;
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

      requestAnimationFrame(renderLoop);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    const animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animId);
    };
  }, [isPreloaded]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: -2, pointerEvents: 'none',
          objectFit: 'cover'
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: -1, pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.08)'
        }}
      />
    </>
  );
}
