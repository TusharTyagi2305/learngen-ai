import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 82;

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const animFrameIdRef = useRef(null);

  // Preload all 82 image frames into memory
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(6, '0');
      img.src = `/thor-frames/frame_${frameNum}.png`;
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

  // 60FPS High-Definition Canvas Renderer with Lerp Frame Smoothing & HiDPI Scaling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      // HiDPI Device Pixel Ratio Scaling (Eliminates Pixelation & Blurriness)
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
      
      // Target frame based on scroll
      targetFrameRef.current = scrollFraction * (TOTAL_FRAMES - 1);
    };

    // Continuous 60fps Animation Loop with Spring Lerp Frame Smoothing
    const renderLoop = () => {
      // Linear interpolation (lerp) for liquid-smooth frame transitions (0.15 smoothing rate)
      const diff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += diff * 0.15;

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const img = imagesRef.current[frameIdx];

      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Cover aspect ratio calculation for high-res canvas
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

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Start 60fps rendering loop
    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isPreloaded]);

  return (
    <>
      {/* HiDPI 60FPS Smooth 3D Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -2,
          pointerEvents: 'none',
          objectFit: 'cover'
        }}
      />

      {/* Sheer Ultra-Thin Ambient Mask */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.08)'
        }}
      />
    </>
  );
}
