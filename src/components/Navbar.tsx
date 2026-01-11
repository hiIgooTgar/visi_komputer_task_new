import { LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "About", href: "#about" },
    { name: "Workflow", href: "#workflow" }, // Tambahkan ID workflow di section workflow Anda
    { name: "FAQ", href: "#faq" },
  ];

  const scrollToApp = () => {
    document
      .getElementById("smart-count-app")
      ?.scrollIntoView({ behavior: "smooth" });
    setIsOpen(false);
  };

  return (
    <nav className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50 px-6 py-4 sticky top-0 z-[100]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/30 group cursor-pointer">
            <LayoutDashboard
              className="text-white group-hover:rotate-12 transition-transform"
              size={24}
            />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent leading-none">
              SmartCount AI
            </h1>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-semibold mt-1">
              Industrial Vision System
            </p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-400 hover:text-blue-400 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="h-6 w-[1px] bg-slate-800"></div>

          <button
            onClick={scrollToApp}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            LAUNCH APP
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-400"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-900 border-b border-slate-800 p-6 md:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-300 border-b border-slate-800 pb-2"
              >
                {item.name}
              </a>
            ))}
            <button
              onClick={scrollToApp}
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl mt-2"
            >
              LAUNCH APP
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
