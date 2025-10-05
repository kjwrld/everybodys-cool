import { BookOpen, Users, Brain, GraduationCap, Target, Clock, Rocket } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const missionPhoto = '/images/a1e8c518674ff70fe2a6bd01e9bff360c1ad6205.png';

const services = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Student Leadership Mastery",
    subtitle: "30-Minute Assembly",
    description: "Students experience immediate breakthroughs in confidence and authentic leadership presence. We believe every student possesses natural leadership qualities - our assembly unlocks those abilities in one powerful session.",
    features: ["30-minute whole-school leadership assembly", "Immediate moral courage activation", "Single-session confidence breakthrough experience", "Walk-away tools for authentic peer leadership"]
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "The Power of Good Decisions",
    subtitle: "60-Minute Private Class",
    description: "Students experience breakthrough moments in self-regulation and conscious decision-making. We believe each student can actively choose their thoughts, emotions, and behavioral responses - our training delivers those life skills in one session.",
    features: ["60-minute private classroom intensive", "Immediate delayed gratification skill mastery", "Personalized cognitive restructuring experience", "Walk-away tools for decision power mastery"]
  },
  {
    icon: <BookOpen className="w-8 h-8" />,
    title: "Reading Comprehension Skills",
    subtitle: "90-Minute Afterschool Session",
    description: "Students master critical analysis and strategic reading techniques required for selective admissions. We believe every student can read at grade level and beyond - our intensive delivers those skills in one focused session.",
    features: ["90-minute afterschool reading intensive", "Competitive high school readiness focus", "Advanced comprehension strategy mastery", "Walk-away tools for selective school preparation"]
  }
];

const outcomes = [
  {
    icon: <Target className="w-6 h-6" />,
    metric: "95%",
    label: "Student Engagement Rate"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    metric: "250+",
    label: "Schools Served"
  },
  {
    icon: <Users className="w-6 h-6" />,
    metric: "50,000+",
    label: "Students Impacted"
  }
];

export function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05, // Trigger when only 5% of the section is visible
        rootMargin: '100px 0px', // Start animation before section fully enters viewport
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

  return (
    <section className="relative bg-white py-20 lg:py-24 overflow-hidden" data-services-section>
      {/* Authentic grain texture - matching hero section */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ filter: 'contrast(170%) brightness(100%)' }}>
        <defs>
          <filter id="sectionGrainFilter">
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
          filter="url(#sectionGrainFilter)" 
          opacity="0.4"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div ref={sectionRef} className="text-center max-w-4xl mx-auto mb-16 relative">
          
          {/* Mobile: Title First, Desktop: Image First */}
          <div className="flex flex-col md:flex-col">
            
            {/* Compelling headline with chroma text effects - Mobile First */}
            <h2 className="text-2xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-6 md:order-3 leading-tight relative z-10">
              <span className={`block chroma-text-gray ${isVisible ? 'chroma-text-gray-animate' : ''}`}>Turn Every Student Into a</span>
              <span className={`block chroma-text ${isVisible ? 'chroma-text-animate' : ''}`}>
                Confident Leader
              </span>
            </h2>

            {/* Hero Image - Reordered for mobile */}
            <div className="mb-8 md:mb-8 md:order-1 relative max-w-2xl mx-auto">
              <div className="cinta tres" style={{ transform: 'translateX(-10px)' }}>
                <img 
                  src={missionPhoto}
                  alt="Our Founder, Kymm, and his daughter"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '16/10' }}
                />
              </div>
            </div>

            {/* Photo Descriptor - Reordered for mobile */}
            <p className="text-sm text-gray-600 italic mb-12 md:mb-6 md:order-2 -mt-4">
              Our Founder, Kymm, and his daughter
            </p>
            
          </div>
          
          {/* Trust indicator bar with fade up animations */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8 relative z-10">
            <div className={`flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 sm:px-3 sm:py-1 rounded-full border border-emerald-200 w-full sm:w-auto justify-center ${
              isVisible 
                ? 'opacity-100 translate-y-0 sm:transition-all sm:duration-700 sm:animate-[fadeInUp_0.7s_ease-out_0.1s_forwards]' 
                : 'opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:transition-all sm:duration-700'
            }`}>
              <div className="w-2 h-2 bg-emerald-500 rounded-full sm:animate-pulse"></div>
              <span className="text-sm sm:text-xs font-medium">10+ Year Track Record</span>
            </div>
            <div className={`flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 sm:px-3 sm:py-1 rounded-full border border-blue-200 w-full sm:w-auto justify-center ${
              isVisible 
                ? 'opacity-100 translate-y-0 sm:transition-all sm:duration-700 sm:animate-[fadeInUp_0.7s_ease-out_0.3s_forwards]' 
                : 'opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:transition-all sm:duration-700'
            }`}>
              <Users className="w-3 h-3" />
              <span className="text-sm sm:text-xs font-medium">50,000+ Students Transformed</span>
            </div>
            <div className={`flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 sm:px-3 sm:py-1 rounded-full border border-amber-200 w-full sm:w-auto justify-center ${
              isVisible 
                ? 'opacity-100 translate-y-0 sm:transition-all sm:duration-700 sm:animate-[fadeInUp_0.7s_ease-out_0.5s_forwards]' 
                : 'opacity-100 translate-y-0 sm:opacity-0 sm:translate-y-4 sm:transition-all sm:duration-700'
            }`}>
              <Clock className="w-3 h-3" />
              <span className="text-sm sm:text-xs font-medium">Limited Spots Available</span>
            </div>
          </div>

          {/* Value proposition with social proof */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-xl mb-6 relative z-10">
            <p className="text-l text-gray-700 leading-relaxed mb-4">
              <strong className="text-[#185CFC]">Every student succeeds.</strong> Refined over decades of trial and error, we've built a transformative curriculum to transform every child in your classroom into a confident, courageous leader ready to succeed to their heart's content.
            </p>
            
            {/* Testimonial snippet */}
            <div className="pt-4 border-t border-gray-200 text-center">
              <div className="flex items-center justify-center gap-4 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#185CFC] to-[#729CFD] rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#729CFD] to-[#AFC6FE] rounded-full border-2 border-white"></div>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#AFC6FE] to-[#185CFC] rounded-full border-2 border-white"></div>
                </div>
                <div className="text-yellow-400 text-sm">★★★★★</div>
              </div>
              <p className="text-sm text-gray-600 italic">
                "Every one of my students showed an immediate shift after listening to Kymm speak!"
              </p>
            </div>
          </div>

          {/* OUSD Trust Badge */}
          <div className="inline-flex flex-col items-center gap-3 bg-white/95 backdrop-blur-sm px-8 py-5 rounded-2xl border border-gray-200/60 shadow-xl relative z-10 max-w-md">
            {/* Enhanced Logo Display - Now contains the text inside */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="/images/ousd-logo.png"
                  alt="Oakland Unified School District - Student Thrives Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            
            {/* Institutional Text - Simplified since logo contains text */}
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs font-medium text-emerald-700 uppercase tracking-wide">Official Partner</span>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid - Fun School-Inspired Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {services.map((service, index) => {
            // Consistent notebook paper theme for all cards - matching Student Leadership Development
            const cardThemes = [
              // Notebook Paper Theme (Leadership) - Brand Blue Accent
              {
                bgGradient: "from-blue-50 via-white to-blue-50/30",
                borderColor: "border-blue-200/60",
                patternClass: "notebook-lines",
                accentColor: "#185CFC", // Brand dark blue
                iconBg: "bg-[#AFC6FE]/20 group-hover:bg-[#185CFC]",
                iconColor: "text-[#185CFC] group-hover:text-white"
              },
              // Notebook Paper Theme (SEL) - Same as Leadership
              {
                bgGradient: "from-blue-50 via-white to-blue-50/30",
                borderColor: "border-blue-200/60",
                patternClass: "notebook-lines",
                accentColor: "#185CFC", // Brand dark blue
                iconBg: "bg-[#AFC6FE]/20 group-hover:bg-[#185CFC]",
                iconColor: "text-[#185CFC] group-hover:text-white"
              },
              // Notebook Paper Theme (Literacy) - Same as Leadership
              {
                bgGradient: "from-blue-50 via-white to-blue-50/30",
                borderColor: "border-blue-200/60",
                patternClass: "notebook-lines",
                accentColor: "#185CFC", // Brand dark blue
                iconBg: "bg-[#AFC6FE]/20 group-hover:bg-[#185CFC]",
                iconColor: "text-[#185CFC] group-hover:text-white"
              }
            ];
            
            const theme = cardThemes[index];
            const isChalkboard = false; // All cards now use the same theme
            
            return (
              <div 
                key={service.title}
                className={`group bg-gradient-to-br ${theme.bgGradient} rounded-3xl p-8 border-2 ${theme.borderColor} hover:border-[#185CFC]/40 hover:shadow-2xl hover:shadow-[#185CFC]/10 transition-all duration-500 relative overflow-hidden hover:-translate-y-2 hover:rotate-1`}
                style={{ 
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' 
                }}
                {...(index === 0 && { 'data-service-card': 'leadership' })}
              >
                {/* School Pattern Overlays */}
                <div className={`absolute inset-0 ${theme.patternClass} opacity-20 pointer-events-none`} />
                


                <div className="relative z-10 pl-2">
                  {/* Fun Icon with School-Themed Styling */}
                  <div className={`w-20 h-20 ${theme.iconBg} ${theme.iconColor} rounded-2xl flex items-center justify-center transition-all duration-300 mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 relative overflow-hidden`}>
                    {/* Icon sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>

                  {/* Title with School Font Feel */}
                  <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                    isChalkboard 
                      ? 'text-yellow-100 group-hover:text-yellow-200' 
                      : 'text-gray-900 group-hover:text-[#185CFC]'
                  }`}>
                    {service.title}
                  </h3>
                  
                  {/* Subtitle with service format */}
                  <p className={`text-sm font-medium mb-4 transition-colors duration-300 ${
                    isChalkboard 
                      ? 'text-yellow-200/80 group-hover:text-yellow-100' 
                      : 'text-[#185CFC]/70 group-hover:text-[#185CFC]'
                  }`}>
                    {service.subtitle}
                  </p>

                  {/* Description */}
                  <p className={`leading-relaxed mb-6 transition-colors duration-300 ${
                    isChalkboard 
                      ? 'text-slate-200 group-hover:text-slate-100' 
                      : 'text-gray-600 group-hover:text-gray-700'
                  }`}>
                    {service.description}
                  </p>

                  {/* Features List with Modern Empty Rounded Checkboxes */}
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className={`flex items-center gap-3 text-sm transition-colors duration-300 ${
                        isChalkboard 
                          ? 'text-slate-200 group-hover:text-slate-100' 
                          : 'text-gray-600 group-hover:text-gray-700'
                      }`}>
                        {/* Modern Empty Rounded Checkboxes */}
                        <div className={`w-4 h-4 rounded-md border-2 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                          isChalkboard 
                            ? 'border-yellow-400/70 group-hover:border-yellow-300' 
                            : 'border-[#185CFC]/30 group-hover:border-[#185CFC]/60 group-hover:bg-[#185CFC]/10'
                        }`} />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}