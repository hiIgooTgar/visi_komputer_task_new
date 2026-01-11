import { LayoutDashboard, BrainCircuit, Clock } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-gray-900/50 backdrop-blur-md border-b border-gray-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
          <LayoutDashboard className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            SmartCount AI
          </h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-tighter">
            Conveyor Monitoring System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm font-mono text-gray-400">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        System Active
      </div>
    </nav>
  );
}
