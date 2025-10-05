import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface DonationFormProps {
  onConfetti?: (position: { x: number; y: number }) => void;
}

export const DonationForm = ({ onConfetti }: DonationFormProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [animateText, setAnimateText] = useState(false);
  
  const isInputFilled = inputValue && inputValue.trim() !== '';

  // Trigger chroma animation after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setAnimateText(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue || isLoading) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="text-left">
      {/* BIG Hero Title */}
      <div className="space-y-6 sm:space-y-6 px-6 relative z-40">
        <h1 className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold chroma-text-gray ${animateText ? 'chroma-text-gray-animate' : ''} leading-snug sm:leading-snug md:leading-snug lg:leading-snug xl:leading-snug`}>
          Everybody's Cool
        </h1>
        <div className="space-y-2">
          <p className={`chroma-text-gray ${animateText ? 'chroma-text-animate' : ''} text-xl sm:text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl`}>
            Promoting moral courage and social responsibility into the next generation of leaders.
          </p>
        </div>
      </div>

      {/* COMMENTED OUT - Form Section */}
      {/* 
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <div 
                className="absolute inset-[-1px] rounded-[17px] pointer-events-none z-0 transition-all duration-300 group-hover:inset-[-2px]"
                style={{
                  background: 'linear-gradient(45deg, rgba(134, 20, 255, 0.3), rgba(154, 82, 235, 0.3), rgba(255, 107, 122, 0.3), rgba(245, 230, 184, 0.3), rgba(34, 197, 94, 0.3), rgba(134, 20, 255, 0.3))',
                  backgroundSize: '200% 200%',
                  filter: 'blur(4px)',
                  animation: 'pulse-glow-shifting 3.5s ease-in-out infinite'
                }}
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#155dfb] text-[20px] font-medium z-30">
                $
              </div>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="relative z-10 w-full h-[64px] pl-10 pr-4 bg-white border-2 border-[#e5e7eb] rounded-[16px] text-[20px] font-medium text-[#374151] focus:outline-none transition-all duration-300 shadow-lg hover:shadow-xl focus:shadow-2xl [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="100"
                min="1"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !inputValue}
              className="relative group w-full bg-[#155dfb] hover:bg-[#1348d4] disabled:cursor-not-allowed transition-colors h-[56px] rounded-[16px] shadow-lg flex items-center justify-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {isLoading ? (
                <>
                  <div className="relative z-10 w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative z-10 font-medium text-white text-[18px]">
                    Sending...
                  </span>
                </>
              ) : (
                <>
                  <span className="relative z-10 font-medium text-white text-[18px]">
                    Donate Now
                  </span>
                  <ArrowRight className="relative z-10 w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[#6b7280] text-[14px]">
                Secure
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#155dfb] rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[#6b7280] text-[14px]">
                Direct Impact
              </span>
            </div>
          </div>
        </div>
      </div>
      */}
    </div>
  );
};