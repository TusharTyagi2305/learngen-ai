import React, { useEffect, useRef } from 'react';

const START_FRAME = 1;
const END_FRAME = 80;
const TOTAL_FRAMES = END_FRAME - START_FRAME + 1; // 80 frames

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const imagesMapRef = useRef({});

  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);

  // Helper to load frame on demand with caching
  const getOrLoadFrame = (frameIndex) => {
    const frameNum1Based = Math.min(END_FRAME, Math.max(START_FRAME, frameIndex + 1));
    if (imagesMapRef.current[frameNum1Based]) {
      return imagesMapRef.current[frameNum1Based];
    }
    const img = new Image();
    const formatted = String(frameNum1Based).padStart(6, '0');
    img.src = `/thor-frames/frame_${formatted}.webp`;
    imagesMapRef.current[frameNum1Based] = img;
    return img;
  };

  // Eagerly preload initial 15 key frames for instant startup
  useEffect(() => {
    for (let i = 1; i <= 15; i++) {
      getOrLoadFrame(i - 1);
    }
  }, []);

  // Pure 60FPS Scroll-Driven Canvas Renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animId = null;
    let lastRenderedFrameIdx = -1;

    const renderLoop = () => {
      const diff = targetFrameRef.current - currentFrameRef.current;
      
      // Idle detection: Pause the loop if we're extremely close to the target
      if (Math.abs(diff) < 0.005) {
        currentFrameRef.current = targetFrameRef.current;
        animId = null;
        return; // Halt render loop
      }

      currentFrameRef.current += diff * 0.18; // Smooth 60fps lerp interpolation

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      // Only repaint if the actual integer frame index changed (optimization)
      if (frameIdx !== lastRenderedFrameIdx) {
        lastRenderedFrameIdx = frameIdx;
        const img = getOrLoadFrame(frameIdx);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw rich glowing ambient background gradient so background is NEVER blank
        const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#0b132b');
        grad.addColorStop(0.5, '#111827');
        grad.addColorStop(1, '#070a12');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (img && img.complete && (img.naturalWidth > 0 || img.width > 0)) {
          // Disable image smoothing on mobile for better performance, keep high on desktop
          ctx.imageSmoothingEnabled = window.innerWidth >= 768;
          ctx.imageSmoothingQuality = window.innerWidth >= 768 ? 'high' : 'low';

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
      }

      animId = requestAnimationFrame(renderLoop);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
      targetFrameRef.current = scrollFraction * (TOTAL_FRAMES - 1);
      
      // Wake up the render loop if it was idle
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = isMobile ? 1 : Math.min(1.25, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      
      // Force repaint on resize
      lastRenderedFrameIdx = -1;
      if (!animId) {
        animId = requestAnimationFrame(renderLoop);
      }
    };

    handleResize();
    handleScroll();

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

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
