"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function FindGrantPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFind = async () => {
    if (!prompt) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/find-grants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      console.log("Gemini Recommendations:", data);
    } catch (error) {
      console.error("Error fetching grants:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-semibold text-gray-900">
          Describe your organisation and the grants you are looking for
        </h1>

        <div className="mt-6">
          <textarea
            className="
                w-full
                rounded-md
                border
                border-gray-300
                bg-gray-50
                p-3
                text-gray-900
                focus:border-gray-900
                focus:ring-gray-900
                focus:outline-none
                min-h-[150px]
            "
            placeholder="e.g. We are a non-profit organization focusing on eldercare in Singapore..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        <div className="mt-6">
          <Button
            className="rounded-full bg-black text-white px-8 py-3"
            onClick={handleFind}
            disabled={isLoading}
          >
            {isLoading ? "Finding..." : "Find"}
          </Button>
        </div>
      </div>
    </main>
  );
}
