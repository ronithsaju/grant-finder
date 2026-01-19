"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight, Search } from "lucide-react";

const LOADING_QUOTES = [
  "The best way to find yourself is to lose yourself in the service of others. - Mahatma Gandhi",
  "No one has ever become poor by giving. - Anne Frank",
  "We make a living by what we get. We make a life by what we give. - Winston Churchill",
  "Alone we can do so little; together we can do so much. - Helen Keller",
];

export default function FindGrantPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const router = useRouter();

  const handleFind = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/find-grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      if (!response.ok) throw new Error("Search failed");
      
      const data = await response.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("grantResults", JSON.stringify(data));
      }

      router.push("/results");
    } catch (error) {
      console.error("Error fetching grants:", error);
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isLoading]);

  // LOADING STATE
  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <div className="flex flex-col items-center max-w-lg text-center">
          <div className="relative mb-8">
            {/* Simple clean spinner */}
            <div className="h-16 w-16 rounded-full border-4 border-gray-100 border-t-black animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-gray-400 animate-pulse" />
            </div>
          </div>
          
          <h2 className="text-2xl font-semibold text-black tracking-tight">
            Analysing your needs...
          </h2>
          
          <div className="mt-6 h-24 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-gray-500 italic font-medium"
              >
                "{LOADING_QUOTES[quoteIndex]}"
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </main>
    );
  }

  // ACTIVE STATE
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 md:p-12">
          
          <div className="mb-8 space-y-2">
            <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-full mb-4">
              <Search className="w-5 h-5 text-gray-900" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Let's find your funding.
            </h1>
            <p className="text-gray-500 text-lg">
              Tell us about your organization and your goals. Our AI will match you with the best grants in Singapore.
            </p>
          </div>

          <div className="space-y-6">
            <div className="relative group">
              <textarea
                className="
                    w-full
                    min-h-[200px]
                    rounded-xl
                    border-2
                    border-gray-100
                    bg-gray-50
                    p-6
                    text-lg
                    text-gray-900
                    placeholder:text-gray-400
                    focus:border-black
                    focus:bg-white
                    focus:ring-0
                    focus:outline-none
                    transition-all
                    duration-200
                    resize-none
                "
                placeholder="e.g. We are a non-profit organization based in Singapore focusing on eldercare. We are looking for funding to digitize our volunteer management system..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-400 hidden md:block">
                Be as specific as possible.
              </p>
              <Button
                className="
                  rounded-full 
                  bg-black 
                  hover:bg-gray-800 
                  text-white 
                  px-8 
                  py-6
                  text-lg
                  font-medium
                  transition-all
                  hover:scale-105
                  active:scale-95
                  shadow-lg
                  group
                "
                onClick={handleFind}
                disabled={!prompt.trim()}
              >
                Find Grants
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}