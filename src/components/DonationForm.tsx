import { useState, useEffect } from "react";

interface DonationFormProps {
    onConfetti?: (position: { x: number; y: number }) => void;
}

export const DonationForm = ({ onConfetti }: DonationFormProps) => {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [animateText, setAnimateText] = useState(false);

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
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsLoading(false);
    };

    return (
        <div className="text-left">
            {/* BIG Hero Title */}
            <div className="space-y-6 sm:space-y-6 px-6 relative z-40">
                <h1
                    className={`text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-6xl font-bold chroma-text-gray ${
                        animateText ? "chroma-text-gray-animate" : ""
                    } leading-snug sm:leading-snug md:leading-snug lg:leading-snug xl:leading-snug`}
                >
                    Everybody's Cool
                </h1>
                <div className="space-y-2">
                    <p
                        className={`chroma-text-gray ${
                            animateText ? "chroma-text-animate" : ""
                        } text-xl sm:text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-lg sm:max-w-lg md:max-w-xl lg:max-w-2xl`}
                    >
                        Promoting moral courage and social responsibility into
                        the next generation of leaders.
                    </p>
                </div>
            </div>
        </div>
    );
};
