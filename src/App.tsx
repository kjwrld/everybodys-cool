import { useState, useEffect } from "react";
import { X, ArrowRight } from "lucide-react";
import { AnimatedGradient } from "./components/AnimatedGradient";
import { DonationForm } from "./components/DonationForm";
import { DonationModal } from "./components/DonationModal";
import { Navbar } from "./components/Navbar";
import { ServicesSection } from "./components/ServicesSection";
import { FounderSection } from "./components/FounderSection";
import { EmailSignupSection } from "./components/EmailSignupSection";
import { Footer } from "./components/Footer";
import { SchoolBookingTab } from "./components/SchoolBookingTab";
import { ConfettiCanvas } from "./components/ConfettiCanvas";
import { PlanetShader } from "./components/PlanetShader";
import { PostProcessingPlanetShader } from "./components/PostProcessing";

export default function App() {
    const [showTopCard, setShowTopCard] = useState(false);
    const [triggerConfetti, setTriggerConfetti] = useState(false);
    const [confettiPosition, setConfettiPosition] = useState<{
        x: number;
        y: number;
    }>({ x: 0, y: 0 });
    const [isNotificationLoading, setIsNotificationLoading] = useState(false);
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [isSchoolBookingModalOpen, setIsSchoolBookingModalOpen] =
        useState(false);
    const [footerScrollProgress, setFooterScrollProgress] = useState(0);
    const [planetScale, setPlanetScale] = useState(0.95);
    
    // Painterly controls
    const [enablePainterly, setEnablePainterly] = useState(true);
    const [painterlyRadius, setPainterlyRadius] = useState(7);
    const [kuwaharaAlpha, setKuwaharaAlpha] = useState(25.0);
    const [kuwaharaSamples, setKuwaharaSamples] = useState(8);

    // Fade in the top card after component mounts
    useEffect(() => {
        const timer = setTimeout(() => setShowTopCard(true), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Responsive planet scaling
    useEffect(() => {
        const updateScale = () => {
            const width = window.innerWidth;
            if (width >= 1024) {
                setPlanetScale(0.5); // Desktop: 50%
            } else if (width >= 768) {
                setPlanetScale(0.75); // Tablet: 75%
            } else {
                setPlanetScale(0.95); // Mobile: 95%
            }
        };

        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, []);

    // Scroll-reveal footer effect - responsive and mobile-friendly
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            // Calculate when to start revealing footer (only at the very end - last 150px desktop, 100px mobile)
            const revealDistance = window.innerWidth >= 768 ? 150 : 100;
            const startReveal = Math.max(0, docHeight - revealDistance);

            if (scrollTop >= startReveal) {
                // Calculate progress from start of reveal to end of document
                const progress = Math.min(
                    1,
                    (scrollTop - startReveal) / revealDistance
                );
                // Use easing function for smoother animation
                const easedProgress = progress * progress * (3 - 2 * progress); // smoothstep easing
                setFooterScrollProgress(easedProgress);
            } else {
                setFooterScrollProgress(0);
            }
        };

        // Add scroll listener with throttling for performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener("scroll", throttledScroll, { passive: true });

        // Initial check
        handleScroll();

        return () => window.removeEventListener("scroll", throttledScroll);
    }, []);

    const handleConfetti = (position: { x: number; y: number }) => {
        setConfettiPosition(position);
        setTriggerConfetti((prev) => !prev); // Toggle to trigger animation
    };

    const handleNotificationDonation = (
        e: React.MouseEvent<HTMLButtonElement>
    ) => {
        if (isNotificationLoading) return;

        console.log("Opening donation modal...", isDonationModalOpen);
        // Open the donation modal instead of immediate confetti
        setIsDonationModalOpen(true);
        console.log("Modal state set to true");
    };

    const handleModalDonation = (amount: string) => {
        // Trigger confetti when donation is completed from modal
        const centerPosition = {
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        };

        handleConfetti(centerPosition);

        // Advanced DOM particle system for extra impact with Everybody's Cool brand colors
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement("div");
            confetti.style.position = "fixed";
            confetti.style.left = centerPosition.x + "px";
            confetti.style.top = centerPosition.y + "px";
            confetti.style.width = "8px";
            confetti.style.height = "8px";
            confetti.style.backgroundColor = [
                "#185CFC",
                "#457CFD",
                "#729CFD",
                "#AFC6FE",
                "#F9F9F9",
            ][Math.floor(Math.random() * 5)];
            confetti.style.borderRadius = "50%";
            confetti.style.pointerEvents = "none";
            confetti.style.zIndex = "9999";
            confetti.style.transform = "scale(0)";
            confetti.style.transition =
                "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

            document.body.appendChild(confetti);

            // Physics-based animation with gravity
            setTimeout(() => {
                const angle = Math.random() * 360 * (Math.PI / 180);
                const distance = Math.random() * 200 + 100;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance - Math.random() * 100; // Gravity effect

                confetti.style.transform = `translate(${x}px, ${y}px) scale(1) rotate(${
                    Math.random() * 360
                }deg)`;
                confetti.style.opacity = "0";
            }, 10);

            // Cleanup after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 1000);
        }
    };

    return (
        <div className="w-full">
            {/* Full-Screen Hero Section */}
            <div className="h-screen w-full relative">
                {/* Background */}
                <AnimatedGradient />

                {/* Planet Shader */}
                <div className="absolute inset-0">
                    <PlanetShader
                        className="w-full h-full drop-shadow-2xl"
                        style={{
                            transform: `scale(${planetScale})`,
                        }}
                    />
                    {enablePainterly && (
                        <PostProcessingPlanetShader
                            className="w-full h-full"
                            style={{
                                transform: `scale(${planetScale})`,
                                position: "absolute",
                                top: 0,
                                left: 0,
                                pointerEvents: "none"
                            }}
                            enablePainterly={enablePainterly}
                            painterlyRadius={painterlyRadius}
                            kuwaharaAlpha={kuwaharaAlpha}
                            kuwaharaSamples={kuwaharaSamples}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 pb-16 lg:pb-20">
                    <div className="w-full max-w-screen-xl mx-auto px-6">
                        <DonationForm onConfetti={handleConfetti} />
                    </div>
                </div>
            </div>

            {/* Main Content - Follows naturally after hero */}
            <ServicesSection />

            {/* Founder Section */}
            <FounderSection />

            {/* Email Signup Section with generous bottom spacing for footer reveal */}
            <div className="pb-40 md:pb-56 lg:pb-72">
                <EmailSignupSection />
            </div>

            {/* Scroll-Reveal Footer */}
            <Footer scrollProgress={footerScrollProgress} />

            {/* Fixed Navbar - Above everything */}
            <div className="relative z-50">
                <Navbar
                    onOpenSchoolBooking={() =>
                        setIsSchoolBookingModalOpen(true)
                    }
                />
            </div>

            {/* School Booking Side Tab */}
            <SchoolBookingTab
                isModalOpen={isSchoolBookingModalOpen}
                setIsModalOpen={setIsSchoolBookingModalOpen}
            />

            {/* Fixed Notification Card - Responsive Container System */}
            {showTopCard && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-40 w-full max-w-6xl mx-auto px-4">
                    <div className="flex justify-end">
                        <div className="max-w-sm animate-in fade-in duration-1000">
                            <div
                                className={`bg-[#185CFC] rounded-2xl p-6 border border-[#185CFC]/20 shadow-xl space-y-4 relative overflow-hidden transition-all duration-300 ${
                                    isDonationModalOpen
                                        ? "opacity-75 scale-[0.98]"
                                        : "opacity-100 scale-100"
                                }`}
                            >
                                {/* Grain texture overlay */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none"
                                    style={{
                                        filter: "contrast(170%) brightness(100%)",
                                    }}
                                >
                                    <defs>
                                        <filter id="cardNoiseFilter">
                                            <feTurbulence
                                                type="fractalNoise"
                                                baseFrequency="0.9"
                                                numOctaves="4"
                                                stitchTiles="stitch"
                                            />
                                            <feColorMatrix
                                                type="saturate"
                                                values="0"
                                            />
                                        </filter>
                                    </defs>
                                    <rect
                                        width="100%"
                                        height="100%"
                                        filter="url(#cardNoiseFilter)"
                                        opacity="0.4"
                                        style={{ mixBlendMode: "multiply" }}
                                    />
                                </svg>

                                {/* Close button */}
                                <button
                                    onClick={() => setShowTopCard(false)}
                                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors z-20"
                                >
                                    <X className="w-8 h-8 text-white" />
                                </button>

                                {/* Trust badge */}
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="pulsating-circle"></div>
                                    <span className="text-xs text-white/90 uppercase tracking-wide">
                                        Campaign Active Now
                                    </span>
                                </div>

                                {/* Headline */}
                                <div className="space-y-2 pr-6 relative z-10">
                                    <h2 className="text-white">
                                        Keep Services Free for Schools
                                    </h2>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        Help us raise funds to continue offering
                                        our programs at no cost to schools in
                                        need.
                                    </p>
                                </div>

                                {/* CTA button - opens donation modal */}
                                <button
                                    onClick={handleNotificationDonation}
                                    disabled={isDonationModalOpen}
                                    className={`relative group w-full bg-gradient-to-r from-[#d1d5db] via-[#f9fafb] to-[#d1d5db] hover:from-[#e5e7eb] hover:via-[#ffffff] hover:to-[#e5e7eb] transition-all duration-300 h-[56px] rounded-[16px] shadow-lg hover:shadow-xl flex items-center justify-center gap-3 px-8 overflow-hidden z-10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:from-[#d1d5db] disabled:hover:via-[#f9fafb] disabled:hover:to-[#d1d5db] disabled:transform-none`}
                                >
                                    {/* Grain texture overlay */}
                                    <svg
                                        className="absolute inset-0 w-full h-full pointer-events-none"
                                        style={{
                                            filter: "contrast(170%) brightness(100%)",
                                        }}
                                    >
                                        <defs>
                                            <filter id="buttonGrainFilter">
                                                <feTurbulence
                                                    type="fractalNoise"
                                                    baseFrequency="0.9"
                                                    numOctaves="4"
                                                    stitchTiles="stitch"
                                                />
                                                <feColorMatrix
                                                    type="saturate"
                                                    values="0"
                                                />
                                            </filter>
                                        </defs>
                                        <rect
                                            width="100%"
                                            height="100%"
                                            filter="url(#buttonGrainFilter)"
                                            opacity="0.2"
                                            style={{ mixBlendMode: "multiply" }}
                                        />
                                    </svg>

                                    {/* Button content */}
                                    <span className="relative z-10 font-small text-[#4A5565] text-[16px]">
                                        {isDonationModalOpen
                                            ? "Opening..."
                                            : "Make a Difference"}
                                    </span>
                                    <ArrowRight
                                        className={`relative z-10 w-5 h-5 text-[#4A5565] transition-transform duration-200 ${
                                            isDonationModalOpen
                                                ? "translate-x-0"
                                                : "group-hover:translate-x-1"
                                        }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Donation Modal */}
            <DonationModal
                isOpen={isDonationModalOpen}
                setIsOpen={setIsDonationModalOpen}
                onDonation={handleModalDonation}
            />

            {/* Confetti Canvas - Advanced particle system */}
            <ConfettiCanvas
                trigger={triggerConfetti}
                buttonPosition={confettiPosition}
            />

            {/* Debug Panel for Painterly Controls */}
            <div className="fixed top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg text-sm max-w-xs">
                <h3 className="font-bold mb-2">🎨 Painterly Controls</h3>
                
                <div className="space-y-2">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={enablePainterly}
                            onChange={(e) => setEnablePainterly(e.target.checked)}
                            className="rounded"
                        />
                        Enable Painterly
                    </label>
                    
                    {enablePainterly && (
                        <>
                            <div>
                                <label className="block text-xs">Radius: {painterlyRadius}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    step="1"
                                    value={painterlyRadius}
                                    onChange={(e) => setPainterlyRadius(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs">Alpha: {kuwaharaAlpha}</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="50"
                                    step="1"
                                    value={kuwaharaAlpha}
                                    onChange={(e) => setKuwaharaAlpha(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-xs">Samples: {kuwaharaSamples}</label>
                                <input
                                    type="range"
                                    min="4"
                                    max="16"
                                    step="1"
                                    value={kuwaharaSamples}
                                    onChange={(e) => setKuwaharaSamples(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
