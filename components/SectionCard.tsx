export default function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
      {/* Heading ko bold aur Slate-800 (Blue-Black mixture) kiya */}
      <h2 className="text-[15px] font-extrabold text-slate-800 uppercase tracking-tight mb-6 flex items-center">
        <span className="w-1.5 h-5 bg-blue-700 mr-3 rounded-full"></span>
        {title}
      </h2>
      
      <div className="text-slate-600 font-medium">
        {children}
      </div>
    </div>
  );
}