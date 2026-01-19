"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {ExternalLink, Calendar, DollarSign, Target, FileText } from "lucide-react";

export default function GrantDetailPage() {
  const [grant, setGrant] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    const id = params?.id;

    if (id !== undefined) {
      const storedData = localStorage.getItem("grantResults");
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData);
          const selectedGrant = parsedData[parseInt(id as string)];
          
          if (selectedGrant) {
            setGrant(selectedGrant);
          } else {
            console.error("Grant not found at index");
          }
        } catch (e) {
          console.error("Failed to parse local storage", e);
        }
      }
    }
    setLoading(false);
  }, [params]);

  if (loading) return <div className="p-12 text-center">Loading details...</div>;
  if (!grant) return <div className="p-12 text-center">Grant not found. <Button onClick={() => router.back()}>Go Back</Button></div>;

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Main Card Container using standard div */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="border-b bg-white p-6">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {grant.grant_name}
                        </h1>
                        <p className="text-gray-500 font-medium">
                            AI Reasoning: {grant.reasoning}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6 space-y-8">
                
                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {grant.funding && (
                        <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-100">
                            <div>
                                <p className="text-sm text-green-700 font-semibold">Funding Amount</p>
                                <p className="text-gray-900 font-medium">{grant.funding}</p>
                            </div>
                        </div>
                    )}
                    {grant.due_date && (
                        <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div>
                                <p className="text-sm text-blue-700 font-semibold">Application Deadline</p>
                                <p className="text-gray-900 font-medium">{grant.due_date}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Description */}
                {grant.description && (
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                            <FileText className="h-5 w-5" /> Description
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {grant.description}
                        </p>
                    </section>
                )}

                {/* Scope */}
                {grant.scope && (
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                            <Target className="h-5 w-5" /> Project Scope
                        </h3>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {grant.scope}
                        </p>
                    </section>
                )}

                 {/* KPIs / Criteria */}
                 {grant.kpis && (
                    <section>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                           Key Performance Indicators (KPIs)
                        </h3>
                        <div className="bg-gray-50 p-4 rounded-md border text-gray-700">
                             {grant.kpis}
                        </div>
                    </section>
                )}

                {/* Apply Button */}
                {grant.url && (
                    <div className="pt-6 mt-6 border-t">
                        <Button 
                            className="w-full md:w-auto" 
                            size="lg"
                            onClick={() => window.open(grant.url, '_blank')}
                        >
                            Apply Now <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
      </div>
    </main>
  );
}