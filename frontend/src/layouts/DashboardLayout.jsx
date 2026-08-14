import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050914] text-white flex">

      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-white/10">
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>

    </div>
  );
}