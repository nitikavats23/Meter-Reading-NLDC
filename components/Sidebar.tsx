"use client";

interface SidebarProps {
  userType?: string;
}

export default function Sidebar({ userType }: SidebarProps) {
  // 1. Pehle hum saare potential sections define kar lete hain
  const allPossibleItems = [
    { label: "A", name: "User Privileges", id: "userprivileges", visible: true },
    { label: "B", name: "Credentials", id: "credentials", visible: true },
    { label: "C", name: "Account Manager", id: "accountmanager", visible: true },
    { label: "D", name: "Entity Details", id: "entitydetails", visible: true },
    { label: "E", name: "Associate Manager", id: "associatemanager", visible: true },
    { 
      label: "F", 
      name: "Meter Details", 
      id: "meterdetails", 
      visible: userType !== "NLDC" && userType !== "RLDC" && userType !== "" 
    },
    { 
      label: "G", 
      name: "QCA Details", 
      id: "qcadetails", 
      visible: userType === "QCA" 
    },
    { 
      label: "H", 
      name: "Owner Details", 
      id: "ownerdetails", 
      visible: userType === "OWNER" 
    },
  ];

  // 2. Sirf wahi filter karenge jo current userType ke liye 'visible' hain
  const activeItems = allPossibleItems.filter(item => item.visible);

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-72 bg-white border-r border-gray-200 min-h-screen p-6 sticky top-0 h-screen overflow-y-auto">
      <h2 className="text-[12px] font-black text-slate-800 uppercase tracking-[2px] mb-8 border-b pb-2">
        ALL SECTIONS
      </h2>

      <ul className="space-y-2">
        {activeItems.map((item) => (
          <li key={`${item.id}-${userType}`}>
            <button
              onClick={() => handleScroll(item.id)}
              className="w-full flex items-center space-x-3 text-left px-3 py-2 rounded-md text-[13px] font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800 transition-all cursor-pointer group"
            >
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded bg-slate-100 text-slate-500 text-[10px] group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {item.label}
              </span>
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
      
      {/* Footer hint taaki pata chale ki selection ke basis pe list change ho rahi hai */}
      <div className="mt-auto pt-10">
        <p className="text-[10px] text-slate-400 italic">
          * Sections adapt based on User Type
        </p>
      </div>
    </div>
  );
}