// components/PendingQueue.tsx
"use client";

interface PendingItem {
  id: string;
  name: string;
  type: string;
  timeAgo: string;
}

export default function PendingQueue() {
  const items: PendingItem[] = [
    { id: "REG-2025-00847", name: "Rajesh Kumar Sharma", type: "Station", timeAgo: "2 days ago" },
    { id: "REG-2025-00851", name: "Anita Singh", type: "QCA", timeAgo: "1 day ago" },
    { id: "CHG-2025-00041", name: "Change request", type: "Meter details", timeAgo: "3 days ago" },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b bg-slate-50/50">
        <h3 className="font-bold text-sm text-slate-700">Pending queue</h3>
      </div>
      <div className="p-2 space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
        {items.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-md border transition-all cursor-pointer ${
              item.id === "REG-2025-00847" 
                ? "border-blue-200 bg-blue-50/50 shadow-sm" 
                : "border-transparent hover:bg-slate-50"
            }`}
          >
            <p className={`text-sm font-bold ${item.id === "REG-2025-00847" ? "text-blue-700" : "text-slate-800"}`}>
              {item.id}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {item.name} • {item.type} - {item.timeAgo}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}