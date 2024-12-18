import React, { useState, useEffect } from "react";
import { Rocket, Sparkles, Star } from "lucide-react";

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
  className = "",
  iconColor = "text-blue-500",
  quoteColor = "text-gray-700",
}) => {
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);

  useEffect(() => {
    // Randomly select a quote when the component mounts
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setCurrentQuote(inspirationalQuotes[randomIndex]);
  }, []);

  if (!isLoading) return null;

  const QuoteIcon = currentQuote.icon;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4 ${className}`}
    >
      <div className="max-w-md w-full text-center">
        <div className="animate-pulse mb-6">
          <QuoteIcon
            className={`mx-auto mb-4 ${iconColor} animate-bounce`}
            size={64}
          />
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 transform transition-all duration-300 hover:scale-105">
          <p className={`italic mb-4 text-lg ${quoteColor}`}>
            &quot;{currentQuote.quote}&quot;
          </p>
          <p className="text-sm text-gray-500 font-semibold">
            - {currentQuote.author}
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-100"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default InspirationLoader;