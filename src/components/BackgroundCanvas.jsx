import React, { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 82;

export function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Preload all 82 image frames into memory for instantaneous 60fps scroll playback
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

  // Draw current frame onto canvas based on window scroll fraction
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame();
    };

    const renderFrame = () => {
      if (!canvas || !imagesRef.current.length) return;

      const scrollTop = window.scrollY;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));

      // Calculate corresponding frame index (0 to 81)
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(scrollFraction * TOTAL_FRAMES)
      );

      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Aspect-ratio cover math
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
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', renderFrame, { passive: true });

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', renderFrame);
    };
  }, [isPreloaded]);

  return (
    <>
      {/* 3D Scrollytelling Video Frame Canvas - Crystal Clear 100% Vivid */}
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

      {/* Sheer Minimal Mask for Subtle Text Contrast */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.12)'
        }}
      />
    </>
  );
}
