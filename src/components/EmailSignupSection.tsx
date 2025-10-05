import { useState, useEffect, useRef } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ImageWithFallback } from './figma/ImageWithFallback';
const eventPhoto1 = '/images/956f87702614bfa8929fe383df0acdaba280a29f.webp';
const eventPhoto2 = '/images/f0759e7004b9acf4f6673b28305d9f8a73239d35.webp';
const summitPhoto = '/images/de97be0f9138ca6430cd335660757972f5519922.webp';
const missionPhoto = '/images/a1aae565ef0eb6aa9c217f36688f4ea12a770a91.webp';
const founderPhoto = '/images/8ff1d78a4303655cb096c3579909d018422a45fb.webp';

// Photos for the marquee showcasing Everybody's Cool community impact
const marqueePhotos = [
  {
    id: 1,
    src: eventPhoto1,
    alt: "Everybody's Cool community event with team members"
  },
  {
    id: 2,
    src: eventPhoto2,
    alt: "Young people wearing Everybody's Cool hoodies"
  },
  {
    id: 3,
    src: summitPhoto,
    alt: "Professional summit event featuring Everybody's Cool leadership"
  },
  {
    id: 4,
    src: missionPhoto,
    alt: "Everybody's Cool mission in action - community gathering"
  },
  {
    id: 5,
    src: founderPhoto,
    alt: "Founder Kymm with his children at an Everybody's Cool event"
  }
];

export function EmailSignupSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px',
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
    setEmail('');
    
    // Reset success state after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section ref={sectionRef} className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background with grain texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F9F9F9] via-white to-[#AFC6FE]/20">
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
          <defs>
            <filter id="emailSectionGrainFilter">
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
            filter="url(#emailSectionGrainFilter)" 
            opacity="0.15"
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Photo Marquee - Now at the top */}
        <div className="relative mb-16">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F9F9F9] via-[#F9F9F9]/80 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F9F9F9] via-[#F9F9F9]/80 to-transparent z-10 pointer-events-none"></div>
          
          {/* Marquee container */}
          <div className="overflow-hidden">
            <div className="flex animate-marquee">
              {/* First set of photos */}
              {marqueePhotos.slice(0, 5).map((photo, index) => (
                <div key={`first-${photo.id}-${index}`} className="flex-shrink-0 mx-4">
                  <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <ImageWithFallback
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
              {/* Second set for seamless loop */}
              {marqueePhotos.slice(0, 5).map((photo, index) => (
                <div key={`second-${photo.id}-${index}`} className="flex-shrink-0 mx-4">
                  <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                    <ImageWithFallback
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content - Now below the marquee */}
        <div className="text-center mb-16">
          {/* Headline with chroma text effects */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl mb-8 leading-tight">
            <span className={`block chroma-text-gray ${isVisible ? 'chroma-text-gray-animate' : ''}`}>
              Join us on our mission to reach
            </span>
            <span className={`block chroma-text ${isVisible ? 'chroma-text-animate' : ''}`}>
              1,000,000 students
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
            Be part of the movement creating confident leaders. 
            Get updates on our progress, inspiring student stories, and exclusive behind-the-scenes content.
          </p>

          {/* Email Signup Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-14 text-base bg-white/90 backdrop-blur-sm border-2 border-gray-200 focus:border-[#185CFC] focus:ring-2 focus:ring-[#185CFC]/20 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 px-4"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting || !email.trim()}
                className="h-14 px-8 bg-gradient-to-r from-[#185CFC] to-[#457CFD] hover:from-[#457CFD] hover:to-[#729CFD] text-white rounded-2xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : isSubmitted ? (
                  <>
                    <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center">
                      <div className="w-2 h-1 bg-[#185CFC] rounded-full" />
                    </div>
                    <span>Welcome!</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Join Mission</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  Secure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 font-medium">
                  No Spam Ever
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Marquee Animation Styles */}
      <style jsx>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-1440px);
          }
        }
        
        .animate-marquee {
          width: 2880px;
          animation: marquee-scroll 12s linear infinite;
        }
        
        /* Desktop: Slower marquee speed for better viewing */
        @media (min-width: 768px) {
          .animate-marquee {
            animation: marquee-scroll 18s linear infinite;
          }
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}