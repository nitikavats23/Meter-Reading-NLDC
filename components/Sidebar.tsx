"use client";

export default function Sidebar() {
  const items = [
    { name: "Credentials", id: "credentials" },
    { name: "Account Manager", id: "accountmanager" },
    { name: "Entity Details", id: "entitydetails" },
    { name: "Associate Manager", id: "associatemanager" },
    { name: "Meter Details", id: "meterdetails" },
    { name: "QCA Details", id: "qcadetails" },
    { name: "Approval Details", id: "approvaldetails" },
  ];

  const handleScroll = (id: string) => {
    const section = document.getElementById(id);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-screen p-5 sticky top-0">
      <h2 className="font-bold text-lg mb-5">
        All Sections
      </h2>

      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleScroll(item.id)}
              className="w-full text-left p-2 rounded hover:bg-blue-100 hover:text-blue-700 transition cursor-pointer"
            >
              {item.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}