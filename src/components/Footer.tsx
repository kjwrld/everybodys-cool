import { Heart, Globe, GraduationCap, Users, Mail, Phone, MapPin, Copyright } from 'lucide-react';
import Vector from "../imports/Vector";

interface FooterProps {
  scrollProgress?: number;
}

export function Footer({ scrollProgress = 0 }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const missionLinks = [
    { title: "Transforming School Environments", href: "#programs" },
    { title: "Building Tomorrow's Leaders", href: "#principles" },
    { title: "Creating Lasting Change", href: "#speaking" },
    { title: "50,000+ Students Impacted", href: "#peace" }
  ];

  const quickLinks = [
    { title: "Our Story", href: "#story" },
    { title: "Book a School Visit", href: "#booking" },
    { title: "Make a Donation", href: "#donate" }
  ];

  return (
    <footer 
      className="fixed bottom-0 left-0 right-0 w-full bg-[#185CFC] backdrop-blur-xl overflow-hidden z-30 transition-transform duration-300 ease-out"
      style={{
        transform: `translateY(${100 - scrollProgress * 100}%)`
      }}
    >
      {/* Grain texture overlay - same as navbar */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
        <defs>
          <filter id="footerGrainFilter">
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
          filter="url(#footerGrainFilter)" 
          opacity="0.4"
          style={{ mixBlendMode: 'multiply' }}
        />
      </svg>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center gap-3">
                <div className="max-w-8 max-h-8 text-white">
                  <Vector />
                </div>
                <span className="font-['DM_Sans',_sans-serif] font-bold text-xl text-white">
                  Everybody's Cool
                </span>
              </div>

              <div className="flex items-center gap-3">
              </div>
            </div>

            {/* Our Mission Links */}
            <div className="space-y-6">
              <h3 className="font-['DM_Sans',_sans-serif] font-bold text-white text-lg">
              </h3>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="font-['DM_Sans',_sans-serif] font-bold text-white text-lg">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.title}>
                    <a 
                      href={link.href}
                      className="text-white/80 hover:text-white font-['DM_Sans',_sans-serif] text-sm transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] block"
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="font-['DM_Sans',_sans-serif] font-bold text-white text-lg">
                Get in Touch
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-['DM_Sans',_sans-serif] font-medium text-white text-sm">
                      General Inquiries
                    </p>
                    <a 
                      href="mailto:info@everybodyscool.com"
                      className="text-white/80 hover:text-white font-['DM_Sans',_sans-serif] text-sm transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] block"
                    >
                      info@everybodyscool.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Heart className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="font-['DM_Sans',_sans-serif] font-medium text-white text-sm">
                      Donations & Tax Info
                    </p>
                    <a 
                      href="mailto:sbennett@everybodyscool.org"
                      className="text-white/80 hover:text-white font-['DM_Sans',_sans-serif] text-sm transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] block"
                    >
                      sbennett@everybodyscool.org
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-white/60 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    <p className="text-white/80 font-['DM_Sans',_sans-serif] text-sm">
                      Serving the Bay Area
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            

              {/* Copyright */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-end gap-1">
                  <Copyright className="w-4 h-4 text-white/60" />
                  <p className="font-['DM_Sans',_sans-serif] text-sm text-white/60">
                    {currentYear} Everybody's Cool. All rights reserved.
                  </p>
                </div>
                <p className="font-['DM_Sans',_sans-serif] text-xs text-white/50 mt-1">
                  Humanity First
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}