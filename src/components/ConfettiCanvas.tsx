import { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  trigger: boolean;
  buttonPosition?: { x: number; y: number };
}

export function ConfettiCanvas({ trigger, buttonPosition }: ConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const confettiRef = useRef<Confetto[]>([]);
  const sequinsRef = useRef<Sequin[]>([]);

  // Configuration
  const confettiCount = 15;
  const sequinCount = 8;
  const gravityConfetti = 0.3;
  const gravitySequins = 0.55;
  const dragConfetti = 0.075;
  const dragSequins = 0.02;
  const terminalVelocity = 3;

  // Everybody's Cool brand colors - customized for the brand
  const colors = [
    { front: '#185CFC', back: '#457CFD' },  // Dark blue to med blue 2
    { front: '#457CFD', back: '#729CFD' },  // Med blue 2 to med blue
    { front: '#729CFD', back: '#AFC6FE' },  // Med blue to light blue
    { front: '#AFC6FE', back: '#F9F9F9' }   // Light blue to brand white
  ];

  // Helper functions
  const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const initConfettoVelocity = (xRange: [number, number], yRange: [number, number]) => {
    const x = randomRange(xRange[0], xRange[1]);
    const range = yRange[1] - yRange[0] + 1;
    let y = yRange[1] - Math.abs(randomRange(0, range) + randomRange(0, range) - range);
    if (y >= yRange[1] - 1) {
      y += (Math.random() < 0.25) ? randomRange(1, 3) : 0;
    }
    return { x: x, y: -y };
  };

  class Confetto {
    randomModifier: number;
    color: { front: string; back: string };
    dimensions: { x: number; y: number };
    position: { x: number; y: number };
    rotation: number;
    scale: { x: number; y: number };
    velocity: { x: number; y: number };

    constructor(centerX: number, centerY: number) {
      this.randomModifier = randomRange(0, 99);
      this.color = colors[Math.floor(randomRange(0, colors.length))];
      this.dimensions = {
        x: randomRange(5, 9),
        y: randomRange(8, 15),
      };
      this.position = {
        x: randomRange(centerX - 70, centerX + 70),
        y: randomRange(centerY - 10, centerY + 10),
      };
      this.rotation = randomRange(0, 2 * Math.PI);
      this.scale = { x: 1, y: 1 };
      this.velocity = initConfettoVelocity([-9, 9], [6, 11]);
    }

    update() {
      this.velocity.x -= this.velocity.x * dragConfetti;
      this.velocity.y = Math.min(this.velocity.y + gravityConfetti, terminalVelocity);
      this.velocity.x += Math.random() > 0.5 ? Math.random() : -Math.random();
      
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      // 3D flip effect using cosine wave
      this.scale.y = Math.cos((this.position.y + this.randomModifier) * 0.09);
    }
  }

  class Sequin {
    color: string;
    radius: number;
    position: { x: number; y: number };
    velocity: { x: number; y: number };

    constructor(centerX: number, centerY: number) {
      this.color = colors[Math.floor(randomRange(0, colors.length))].back;
      this.radius = randomRange(1, 2);
      this.position = {
        x: randomRange(centerX - 50, centerX + 50),
        y: randomRange(centerY - 5, centerY + 5),
      };
      this.velocity = {
        x: randomRange(-6, 6),
        y: randomRange(-8, -12)
      };
    }

    update() {
      this.velocity.x -= this.velocity.x * dragSequins;
      this.velocity.y = this.velocity.y + gravitySequins;
      
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }

  const initBurst = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use button position if provided, otherwise center of screen
    const centerX = buttonPosition?.x || canvas.width / 2;
    const centerY = buttonPosition?.y || canvas.height / 2;

    for (let i = 0; i < confettiCount; i++) {
      confettiRef.current.push(new Confetto(centerX, centerY));
    }
    for (let i = 0; i < sequinCount; i++) {
      sequinsRef.current.push(new Sequin(centerX, centerY));
    }
  };

  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Render confetti with 3D effect
    confettiRef.current.forEach((confetto, index) => {
      let width = (confetto.dimensions.x * confetto.scale.x);
      let height = (confetto.dimensions.y * confetto.scale.y);
      
      ctx.save();
      ctx.translate(confetto.position.x, confetto.position.y);
      ctx.rotate(confetto.rotation);

      confetto.update();
      
      // Switch between front and back colors based on 3D rotation
      ctx.fillStyle = confetto.scale.y > 0 ? confetto.color.front : confetto.color.back;
      ctx.fillRect(-width / 2, -height / 2, width, height);
      
      ctx.restore();
    });

    // Render sequins
    sequinsRef.current.forEach((sequin, index) => {  
      ctx.save();
      ctx.translate(sequin.position.x, sequin.position.y);
      
      sequin.update();
      
      ctx.fillStyle = sequin.color;
      ctx.beginPath();
      ctx.arc(0, 0, sequin.radius, 0, 2 * Math.PI);
      ctx.fill();

      ctx.restore();
    });

    // Cleanup off-screen particles
    confettiRef.current = confettiRef.current.filter(confetto => confetto.position.y < canvas.height);
    sequinsRef.current = sequinsRef.current.filter(sequin => sequin.position.y < canvas.height);

    // Continue animation if particles exist
    if (confettiRef.current.length > 0 || sequinsRef.current.length > 0) {
      animationRef.current = requestAnimationFrame(render);
    }
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    resizeCanvas();
    
    const handleResize = () => resizeCanvas();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (trigger) {
      initBurst();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(render);
    }
  }, [trigger, buttonPosition]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}