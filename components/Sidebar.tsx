export default function Sidebar() {
  const items = [
    "Credentials",
    "Account Manager",
    "Entity",
    "Associate",
    "Meters",
    "QCA",
    "Approval",
  ];

  return (
    <div className="w-64 bg-white min-h-screen shadow p-5">
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="p-2 hover:bg-blue-100 rounded">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}