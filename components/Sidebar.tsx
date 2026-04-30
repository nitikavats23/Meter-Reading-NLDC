"use client";

export default function Sidebar() {
  const items = [
    { label: "A", name: "User Privileges", id: "userprivileges" },
    { label: "B", name: "Credentials", id: "credentials" },
    { label: "C", name: "Account Manager", id: "accountmanager" },
    { label: "D", name: "Entity Details", id: "entitydetails" },
    { label: "E", name: "Associate Manager", id: "associatemanager" },
    { label: "F", name: "Meter Details", id: "meterdetails" },
    { label: "G", name: "QCA Details", id: "qcadetails" },
  ];

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-0">
      {/* Heading badal kar "ALL SECTIONS" kiya aur thoda dark kiya */}
      <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-[2px] mb-8 border-b pb-2">
        ALL SECTIONS
      </h2>

      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleScroll(item.id)}
              // Blue-Black mixture (slate-800) aur Bold font
              className="w-full flex items-center space-x-3 text-left px-3 py-2 rounded-md text-[13px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-all cursor-pointer group"
            >
              {/* Bullet point ki jagah A, B, C circles */}
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.label}
              </span>
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}