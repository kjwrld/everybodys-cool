import { useState, useEffect } from 'react';
import { X, Calendar, GraduationCap, Sparkles } from 'lucide-react';

export function SchoolBookingTab({ 
  isModalOpen, 
  setIsModalOpen 
}: { 
  isModalOpen?: boolean; 
  setIsModalOpen?: (open: boolean) => void; 
}) {
  const [showTab, setShowTab] = useState(false);
  const [internalShowModal, setInternalShowModal] = useState(false);
  
  // Use external modal state if provided, otherwise use internal state
  const showModal = isModalOpen !== undefined ? isModalOpen : internalShowModal;
  const setShowModal = setIsModalOpen || setInternalShowModal;

  // Show/hide tab based on services section visibility
  useEffect(() => {
    const handleScroll = () => {
      // Target the services section on desktop and first service card on mobile
      const servicesSection = document.querySelector('[data-services-section]');
      const firstServiceCard = document.querySelector('[data-service-card="leadership"]');
      
      if (servicesSection || firstServiceCard) {
        const targetElement = window.innerWidth >= 768 ? servicesSection : firstServiceCard;
        
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight * 0.8; // Trigger when 80% in view
          
          // Show tab when services section is visible, hide when not visible
          setShowTab(isVisible);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Don't call handleScroll() on mount - let it only trigger from actual scrolling
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); // Remove showTab dependency to prevent infinite updates

  return (
    <>
      {/* Vertical Side Tab */}
      <div className={`fixed right-0 top-1/2 -translate-y-1/2 z-30 transition-transform duration-700 ease-out ${
        showTab ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <button 
          onClick={() => setShowModal(true)}
          className="group relative bg-white hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border-l-4 border-[#185CFC]/20 hover:border-[#185CFC]/40 overflow-hidden"
          style={{
            borderTopLeftRadius: '24px',
            borderBottomLeftRadius: '24px',
            width: '60px',
            height: '180px'
          }}
        >
          {/* Grain texture overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
            <defs>
              <filter id="sideTabGrainFilter">
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
              filter="url(#sideTabGrainFilter)" 
              opacity="0.3"
              style={{ mixBlendMode: 'multiply' }}
            />
          </svg>



          {/* Content */}
          <div className="relative z-10 flex items-center justify-center h-full">
            <span className="font-medium group-hover:font-bold text-[#185CFC] tracking-wide whitespace-nowrap transition-all duration-200" style={{ 
              fontSize: '16px',
              transform: 'rotate(-90deg)'
            }}>
              Book Your School
            </span>
          </div>
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#185CFC] rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-[#185CFC]/20 overflow-hidden md:animate-in md:fade-in md:zoom-in md:duration-300">
            {/* Grain texture overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
              <defs>
                <filter id="modalGrainFilter">
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
                filter="url(#modalGrainFilter)" 
                opacity="0.4"
                style={{ mixBlendMode: 'multiply' }}
              />
            </svg>

            {/* Close button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  Transform Your School
                </h2>
                <p className="text-white/90 text-sm leading-relaxed">
                  Join thousands of schools nationwide that have partnered with Everybody's Cool to build confident leaders and create positive learning environments.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-sm">Comprehensive leadership development programs</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-sm">Anti-bullying initiatives that actually work</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-sm">Social-emotional learning curriculum integration</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <div className="w-2 h-2 bg-white rounded-full flex-shrink-0" />
                  <span className="text-sm">Literacy programs that inspire confidence</span>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4 pt-4">
                <button className="relative group w-full bg-gradient-to-r from-[#d1d5db] via-[#f9fafb] to-[#d1d5db] hover:from-[#e5e7eb] hover:via-[#ffffff] hover:to-[#e5e7eb] transition-all duration-300 h-[56px] rounded-[16px] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 px-8 overflow-hidden">
                  {/* Grain texture overlay */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                    <defs>
                      <filter id="modalButtonGrainFilter">
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
                      filter="url(#modalButtonGrainFilter)" 
                      opacity="0.2"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </svg>
                  {/* Shimmer overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <Calendar className="relative z-10 w-5 h-5 text-[#4A5565]" />
                  <span className="relative z-10 font-medium text-[#4A5565] text-[16px]">
                    Schedule Free Consultation
                  </span>
                  <div className="relative z-10 w-5 h-5 text-[#4A5565] group-hover:translate-x-1 transition-transform duration-200 flex items-center justify-center">
                    →
                  </div>
                </button>
                
                <p className="text-center text-white/70 text-xs">
                  Usually responds within 48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}