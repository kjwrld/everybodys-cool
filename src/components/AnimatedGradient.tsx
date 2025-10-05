export const AnimatedGradient = () => {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Extended linear gradient for stronger top coverage */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, #1e40af 0%, #1e40af 10%, #3b82f6 20%, rgba(59, 130, 246, 0.6) 35%, transparent 35%)`
        }}
      />
      
      {/* Wide radial gradient to prevent mobile circularity */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 250% 120% at 50% -10%, 
              #1e40af 0%, 
              #3b82f6 20%, 
              #60a5fa 40%, 
              rgba(96, 165, 250, 0.5) 60%, 
              rgba(147, 197, 253, 0.2) 75%, 
              rgba(147, 197, 253, 0.05) 90%, 
              transparent 100%
            )
          `
        }}
      />
      
      {/* Gentle, extended transition to white at bottom */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            transparent 0%, 
            transparent 45%, 
            rgba(255,255,255,0.1) 55%, 
            rgba(255,255,255,0.25) 65%, 
            rgba(255,255,255,0.4) 72%, 
            rgba(255,255,255,0.6) 80%, 
            rgba(255,255,255,0.8) 88%, 
            rgba(255,255,255,0.95) 96%, 
            white 100%)`
        }}
      />
      
      {/* SVG noise filter for authentic grain */}
      <svg className="absolute inset-0 w-full h-full" style={{ filter: 'contrast(170%) brightness(100%)' }}>
        <defs>
          <filter id="noiseFilter">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.9" 
              numOctaves="4" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        <rect 
          width="100%" 
          height="100%" 
          filter="url(#noiseFilter)" 
          opacity="0.4"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>
    </div>
  );
};