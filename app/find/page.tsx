"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function FindGrantPage() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

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

      // Store results in localStorage to access them on the results page
      if (typeof window !== "undefined") {
        localStorage.setItem("grantResults", JSON.stringify(data));
      }

      router.push("/results");
    } catch (error) {
      console.error("Error fetching grants:", error);
      setIsLoading(false); // Only stop loading on error, otherwise we are navigating away
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
        <div className="mt-6 text-xl font-medium text-gray-900 italic">
          The best way to find yourself is to lose yourself in the service of
          others. - Mahatma Gandhi
        </div>
        <p className="mt-6 text-xl font-medium text-gray-900 animate-pulse">
          Analysing your needs and recommending grants...
        </p>
      </main>
    );
  }

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
