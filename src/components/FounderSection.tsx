import { Heart, Award, Users, Target } from 'lucide-react';
const founderImage = '/images/3e3a966c350e095250db86cfa1515ed4be404ac4.webp';

export function FounderSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background with grain texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F9F9] via-white to-[#AFC6FE]/10">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
          <defs>
            <filter id="founderGrainFilter">
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
            filter="url(#founderGrainFilter)" 
            opacity="0.3"
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Solid company blue background with grain texture */}
          <div className="absolute inset-0 bg-[#185CFC]">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
              <defs>
                <filter id="founderContentGrain">
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
                filter="url(#founderContentGrain)" 
                opacity="0.4"
                style={{ mixBlendMode: 'multiply' }}
              />
            </svg>
          </div>
          
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center p-12 lg:p-16">
            
            {/* Founder Image */}
            <div className="order-1 lg:order-1">
              <div className="relative flex justify-center">
                <div className="cinta tres" style={{ transform: 'translateX(-10px)' }}>
                  <img 
                    src={founderImage}
                    alt="Kymm Wilson - Founder of Everybody's Cool"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="order-2 lg:order-2 space-y-8">
              
              {/* Header */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-white text-sm uppercase tracking-wider">Meet Our Founder</p>
                  
                  <h2 className="text-3xl lg:text-4xl leading-tight chroma-text-white chroma-text-white-animate" style={{animationDelay: '0.3s'}}>
                    Kymm Wilson
                  </h2>
                  
                  <p className="text-xl lg:text-2xl chroma-text-white chroma-text-white-animate" style={{animationDelay: '0.8s'}}>
                    A Catalyst for Immediate Change
                  </p>
                </div>
              </div>

              {/* Bio Content */}
              <div className="space-y-4">
                <p className="text-white leading-relaxed">
                  Born with a passion for education, Kymm Wilson has dedicated his life to empowering students and educators.
                </p>
                
                <p className="text-white leading-relaxed">
                  Starting from humble beginnings in East Oakland, Kymm's journey as a speaker began with a simple belief: every person has the potential for greatness. Through years of working directly with students and educators, he developed a transformative approach that builds confidence and character in young people.
                </p>
                
                <p className="text-white leading-relaxed">
                  Today, Kymm continues his mission through Everybody's Cool, bringing hope and practical tools to schools and communities nationwide, one conversation at a time.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}