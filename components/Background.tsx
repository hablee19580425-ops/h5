
import React, { useEffect, useRef } from 'react';

const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrame: number;
    const bubbles: { x: number; y: number; size: number; speed: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    // Init bubbles
    for (let i = 0; i < 50; i++) {
      bubbles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height + canvas.height,
        size: Math.random() * 4 + 2,
        speed: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1
      });
    }

    const draw = () => {
      // Deep ocean gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#001a33');
      gradient.addColorStop(0.5, '#003366');
      gradient.addColorStop(1, '#000d1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Light rays
      ctx.save();
      ctx.globalCompositeOperation = 'overlay';
      const time = Date.now() * 0.001;
      for (let i = 0; i < 5; i++) {
        const x = canvas.width / 2 + Math.sin(time + i) * 200;
        const grad = ctx.createRadialGradient(x, -100, 0, x, canvas.height, canvas.height * 1.5);
        grad.addColorStop(0, 'rgba(0, 255, 255, 0.2)');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(x - 300, -100);
        ctx.lineTo(x + 300, -100);
        ctx.lineTo(x + 1000, canvas.height);
        ctx.lineTo(x - 1000, canvas.height);
        ctx.fill();
      }
      ctx.restore();

      // Bubbles
      bubbles.forEach(b => {
        b.y -= b.speed;
        if (b.y < -20) {
          b.y = canvas.height + 20;
          b.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity + 0.2})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default Background;
