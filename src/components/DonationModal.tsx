import { useState } from 'react';
import { Gift, X, ArrowRight } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onDonation?: (amount: string) => void;
}

export function DonationModal({ isOpen, setIsOpen, onDonation }: DonationModalProps) {
  const [donationAmount, setDonationAmount] = useState('100');
  const [isLoading, setIsLoading] = useState(false);

  console.log('DonationModal rendering with isOpen:', isOpen);

  const handleDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    
    // Simulate donation processing
    setTimeout(() => {
      setIsLoading(false);
      onDonation?.(donationAmount);
      setIsOpen(false);
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      
      {/* Modal Content */}
      <div className="relative bg-[#185CFC] rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-[#185CFC]/20 overflow-hidden md:animate-in md:fade-in md:zoom-in md:duration-300">
        {/* Grain texture overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
          <defs>
            <filter id="donationModalGrainFilter">
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
            filter="url(#donationModalGrainFilter)" 
            opacity="0.4"
            style={{ mixBlendMode: 'multiply' }}
          />
        </svg>

        {/* Close button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-20"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center leading-tight">
              Support the Everybody's Cool Movement!
            </h2>
            <p className="text-white/90 text-sm leading-relaxed">
              We are able to give transformative seminars through your generous support.
            </p>
          </div>

          {/* Donation Amount Input */}
          <div className="space-y-3">
            <label className="block text-white font-medium text-sm">
              Donation Amount:
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-lg font-medium">
                $
              </div>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full h-[56px] pl-10 pr-4 bg-white/20 border border-white/30 text-white rounded-2xl text-lg font-medium focus:border-white/50 focus:outline-none placeholder-white/60"
                placeholder="100"
              />
            </div>
          </div>

          {/* Quick amount buttons */}
          <div className="grid grid-cols-4 gap-2">
            {['25', '100', '250', '500'].map((amount) => (
              <button
                key={amount}
                onClick={() => setDonationAmount(amount)}
                className={`py-3 px-4 rounded-xl font-medium text-sm transition-all duration-300 ${
                  donationAmount === amount
                    ? 'bg-white text-[#185CFC] shadow-lg'
                    : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Donate button - matching booking modal exactly */}
          <div className="space-y-6 pt-4">
            <button 
              onClick={handleDonation}
              disabled={isLoading}
              className="relative group w-full bg-gradient-to-r from-[#d1d5db] via-[#f9fafb] to-[#d1d5db] hover:from-[#e5e7eb] hover:via-[#ffffff] hover:to-[#e5e7eb] transition-all duration-300 h-[56px] rounded-[16px] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 px-8 overflow-hidden disabled:opacity-70"
            >
              {/* Grain texture overlay */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'contrast(170%) brightness(100%)' }}>
                <defs>
                  <filter id="donationButtonGrainFilter">
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
                  filter="url(#donationButtonGrainFilter)" 
                  opacity="0.2"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </svg>
              <Gift className="relative z-10 w-5 h-5 text-[#4A5565]" />
              <span className="relative z-10 font-medium text-[#4A5565] text-[16px]">
                {isLoading ? 'Processing...' : 'Make Impact'}
              </span>
              <ArrowRight className="relative z-10 w-5 h-5 text-[#4A5565] group-hover:translate-x-1 transition-transform duration-200" />
            </button>
            
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm border border-white/40">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white font-medium">
                  Secure
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center shadow-sm border border-white/40">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-white font-medium">
                  Direct Impact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}