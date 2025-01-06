import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, Star } from "lucide-react";

// List of inspirational quotes
const inspirationalQuotes = [
  {
    quote: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt",
    icon: Rocket,
  },
  {
    quote:
      "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    icon: Sparkles,
  },
  {
    quote:
      "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    icon: Star,
  },
  {
    quote: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson",
    icon: Rocket,
  },
  {
    quote: "Your attitude, not your aptitude, will determine your altitude.",
    author: "Zig Ziglar",
    icon: Sparkles,
  },
];

const InspirationLoader = ({
  isLoading = true,
  minDisplayTime = 2000,
  onComplete,
  className = "",
  iconColor = "text-blue-500",
  quoteColor = "text-gray-700",
}: {
  isLoading?: boolean;
  minDisplayTime?: number;
  onComplete?: () => void;
  className?: string;
  iconColor?: string;
  quoteColor?: string;
}) => {
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Randomly select a quote when the component mounts
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setCurrentQuote(inspirationalQuotes[randomIndex]);

    // If not loading or loading is complete, start the timeout
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onComplete) onComplete();
      }, minDisplayTime);

      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime, onComplete]);

  // Don't render if not visible and not loading
  if (!isVisible && !isLoading) return null;

  const QuoteIcon = currentQuote.icon;

  return (
    <div
      className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-50/100 transition-opacity duration-500 
        ${className} 
        ${
          isLoading || isVisible
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
    >
      <div className="max-w-md w-full text-center">
        <div className="animate-pulse mb-6">
          <QuoteIcon
            className={`mx-auto mb-4 ${iconColor} animate-bounce`}
            size={48}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-4 transform transition-all duration-300 hover:scale-105">
          <p className={`italic mb-3 text-base ${quoteColor}`}>
            "{currentQuote.quote}"
          </p>
          <p className="text-xs text-gray-500 font-semibold">
            - {currentQuote.author}
          </p>
        </div>

        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default InspirationLoader;

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};
