"use client";

import { useState, useEffect } from "react";
import RequestSidebar from "@/components/RequestSidebar";
import ProgressBar from "@/components/ProgressBar";
import PendingQueue from "@/components/PendingQueue";
import RequestDetail from "@/components/RequestDetail";

export default function CoordinatorPage() {
  const [requests, setRequests] = useState<any[]>([]); // API se aane wala data
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/coordinator/requests");
        const data = await response.json();
        setRequests(data);
        if (data.length > 0) setSelectedId(data[0].id);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="flex h-screen bg-[#f0f4f8] overflow-hidden">
      {/* ERROR FIX YAHAN HAI: Saare props pass karne honge */}
      <RequestSidebar 
        title="Registrations"
        requests={requests} 
        selectedId={selectedId} 
        onSelect={(id) => setSelectedId(id)} 
      />

      <main className="flex-1 overflow-y-auto p-6">
        <h1 className="text-xl font-bold mb-4 text-slate-800">
          Registration Review — RLDC Coordinator
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border border-slate-200">
          <ProgressBar currentStep={1} />
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-4">
            <PendingQueue />
          </div>
          <div className="col-span-8">
            <RequestDetail />
          </div>
        </div>
      </main>
    </div>
  );
}