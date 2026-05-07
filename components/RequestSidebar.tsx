"use client";

import React from "react";

interface RequestItem {
  id: string;
  name: string;
  type: string;
  timeAgo: string;
  status: string;
}

interface RequestSidebarProps {
  requests: RequestItem[];
  // FIX: Yahan 'string | null' kiya hai taaki parent page se match kare
  selectedId: string | null; 
  onSelect: (id: string) => void;
  title: string;
}

export default function RequestSidebar({ requests, selectedId, onSelect, title }: RequestSidebarProps) {
  return (
    <div className="w-80 border-r bg-white flex flex-col h-full shadow-sm">
      {/* Sidebar Header */}
      <div className="p-4 border-b bg-slate-50">
        <h3 className="font-bold text-[10px] text-slate-500 uppercase tracking-widest">
          {title}
        </h3>
      </div>

      {/* Requests List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {requests.length === 0 ? (
          <p className="p-4 text-xs text-slate-400 text-center">No pending requests</p>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              onClick={() => onSelect(req.id)}
              className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                selectedId === req.id 
                ? "border-l-4 border-l-blue-600 bg-blue-50" 
                : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`font-bold text-sm ${selectedId === req.id ? "text-blue-900" : "text-slate-700"}`}>
                  {req.id}
                </span>
                {/* Agar status Urgent hai toh badge dikhega */}
                {req.status === "Urgent" && (
                  <span className="bg-red-100 text-red-600 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-slate-600 truncate">{req.name}</p>
              <p className="text-[10px] text-slate-400 mt-1">
                {req.type} • {req.timeAgo}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}