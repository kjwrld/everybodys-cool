import { useEffect, useState } from 'react';

export function Globe() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`globe-container ${isLoaded ? 'globe-loaded' : ''}`}>
      {/* Main Globe Sphere */}
      <div className="globe-sphere">
        {/* Globe Base */}
        <div className="globe-base">
          {/* Continents Layer */}
          <div className="continents-layer">
            {/* North America */}
            <div className="continent continent-1"></div>
            {/* Europe/Africa */}
            <div className="continent continent-2"></div>
            {/* Asia */}
            <div className="continent continent-3"></div>
            {/* Australia */}
            <div className="continent continent-4"></div>
          </div>
          
          {/* Ocean Pattern Overlay */}
          <div className="ocean-pattern"></div>
        </div>

        {/* Outer Orbital Rings */}
        <div className="orbital-ring ring-1"></div>
        <div className="orbital-ring ring-2"></div>
        <div className="orbital-ring ring-3"></div>
        
        {/* Pulsing Energy Rings */}
        <div className="energy-ring pulse-1"></div>
        <div className="energy-ring pulse-2"></div>
        <div className="energy-ring pulse-3"></div>
      </div>

      {/* Floating Particles */}
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Globe Reflection/Shine */}
      <div className="globe-shine"></div>
    </div>
  );
}