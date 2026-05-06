"use client";

import { useState, useEffect } from "react";
import RequestSidebar from "@/components/RequestSidebar";
import ProgressBar from "@/components/ProgressBar";
import SectionCard from "@/components/SectionCard";

// 1. Types define karein taaki name, status, etc. pe error na aaye
interface PendingRequest {
  id: string;
  name: string;
  type: string;
  timeAgo: string;
  status: string;
}

export default function CoordinatorPage() {
  // 2. State ko batayein ki isme PendingRequest ka array aayega
  const [requests, setRequests] = useState<PendingRequest[]>([]); 
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/coordinator/requests");
        const data = await response.json();
        setRequests(data);
        
        if (data && data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // 3. Type casting (as PendingRequest) taaki details access karne mein error na ho
  const selectedRequest = requests.find((req) => req.id === selectedId) as PendingRequest | undefined;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-lg font-semibold text-slate-600">Loading Pending Requests...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <div className="w-80 border-r bg-white">
        <RequestSidebar
          title="Registrations"
          requests={requests}
          selectedId={selectedId}
          onSelect={(id: string) => setSelectedId(id)}
        />
      </div>

      <main className="flex-1 overflow-y-auto p-8">
        {selectedRequest ? (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-800">
                Request Details: {selectedRequest.name}
              </h1>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                {selectedRequest.status}
              </span>
            </div>

            <ProgressBar currentStep={1} />

            <SectionCard title="Basic Information">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500">User Type</p>
                  <p className="font-medium text-slate-700">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Request ID</p>
                  <p className="font-medium text-slate-700">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Received On</p>
                  <p className="font-medium text-slate-700">{selectedRequest.timeAgo}</p>
                </div>
              </div>
            </SectionCard>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                Forward to Admin
              </button>
              <button className="flex-1 border border-red-200 text-red-600 py-2 rounded-lg font-semibold hover:bg-red-50 transition">
                Reject Request
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400 italic">
            Select a request from the sidebar to view details
          </div>
        )}
      </main>
    </div>
  );
}