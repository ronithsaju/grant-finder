"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const [grants, setGrants] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Retrieve data from localStorage
    const storedData = localStorage.getItem("grantResults");
    if (storedData) {
      try {
        setGrants(JSON.parse(storedData));
      } catch (e) {
        console.error("Failed to parse grant results", e);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            Recommended Grants
          </h1>
          <h3 className="text-lg text-gray-600">
            Click on the grants to learn more!
          </h3>
        </div>
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/find")}>
            Search Again
          </Button>
        </div>

        <div className="grid gap-6">
          {grants.length > 0 ? (
            grants.map((grant: any, index: number) => (
              <a
                key={index}
                href={grant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {grant.grant_name}
                  </h2>

                  <div className="mt-2 space-y-2">
                    <p className="text-gray-700">
                      <span className="font-bold">Reasoning:</span>{" "}
                      {grant.reasoning}
                    </p>

                    {grant.funding && (
                      <p className="text-gray-700">
                        <span className="font-bold">Funding Amount:</span>{" "}
                        {grant.funding}
                      </p>
                    )}

                    {grant.due_date && (
                      <p className="text-gray-700">
                        <span className="font-bold">Application Deadline:</span>{" "}
                        {grant.due_date}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))
          ) : (
            <p className="text-gray-500">
              No recommendations found or loading...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
