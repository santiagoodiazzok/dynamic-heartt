import { useEffect, useRef } from "react";

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      return rect;
    };

    let rect = resizeCanvas();
    
    window.addEventListener('resize', () => {
      rect = resizeCanvas();
    });

    let k = 0;
    let animationId: number;
    let startTime: number | null = null;
    const duration = 10000; // 10 seconds

    const draw = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Linear interpolation for k from 0 to 100 over 10 seconds
      k = Math.min(100, (elapsed / duration) * 100);

      ctx.clearRect(0, 0, rect.width, rect.height);
      
      const scale = Math.min(rect.width / 4, rect.height / 4);
      const originX = rect.width / 2;
      // Shift origin slightly lower to center the heart better
      const originY = rect.height / 2 + scale * 0.5;

      // Draw Axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      // X axis ticks
      for(let x = -2; x <= 2; x += 0.5) {
        const px = originX + x * scale;
        ctx.moveTo(px, originY - 5);
        ctx.lineTo(px, originY + 5);
      }
      // Y axis ticks
      for(let y = -1; y <= 2; y += 0.5) {
        const py = originY - y * scale;
        ctx.moveTo(originX - 5, py);
        ctx.lineTo(originX + 5, py);
      }
      
      // X axis line
      ctx.moveTo(0, originY);
      ctx.lineTo(rect.width, originY);
      // Y axis line
      ctx.moveTo(originX, 0);
      ctx.lineTo(originX, rect.height);
      ctx.stroke();

      // Draw Heart Equation
      ctx.strokeStyle = "#ef4444"; // Tailwind's red-500
      ctx.lineWidth = 2.5;
      ctx.lineJoin = "round";
      ctx.beginPath();

      const steps = 2000; // High resolution for smoothness
      const minX = -1.732;
      const maxX = 1.732;

      for (let i = 0; i <= steps; i++) {
        const x = minX + (maxX - minX) * (i / steps);
        
        // Ensure we don't take square root of negative due to float precision
        const underRoot = Math.max(0, 3 - x * x);
        
        // f(x) = (x^2)^(1/3) + 0.7 * sin(k*x) * sqrt(3-x^2)
        const xSquared = x * x;
        const part1 = Math.pow(xSquared, 1/3);
        const part2 = 0.7 * Math.sin(k * x) * Math.sqrt(underRoot);
        const y = part1 + part2;

        const px = originX + x * scale;
        const py = originY - y * scale; // Invert y since canvas y goes down

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.stroke();

      if (k < 100) {
        animationId = requestAnimationFrame(draw);
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-4xl aspect-video relative z-10" data-testid="canvas-container">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      
      <div className="text-center mt-12 space-y-6 z-10">
        <h1 
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 animate-in fade-in slide-in-from-bottom-8 duration-1000 tracking-tight"
          data-testid="text-title"
        >
          Feliz dia de la mujer, HERMOSA
        </h1>
        <div className="inline-block bg-white/5 backdrop-blur-sm border border-white/10 px-6 py-3 rounded-xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700 fill-mode-both">
          <p 
            className="text-sm md:text-lg text-neutral-300 font-mono"
            data-testid="text-equation"
          >
            f(x) = (x²)⅓ + 0.7 × sin(k×x) × √(3-x²)
          </p>
        </div>
      </div>
    </div>
  );
}
