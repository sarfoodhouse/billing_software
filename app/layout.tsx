"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-200 text-slate-900 antialiased overflow-hidden">
        {/* Floating Action Button (Three Dots) */}
        <div className="no-print fixed top-4 left-4 z-50" ref={menuRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`h-10 w-10 flex flex-col items-center justify-center gap-1 rounded-full shadow-lg transition-all active:scale-90 ${
              isOpen ? "bg-red-500 text-white" : "bg-slate-900 text-white hover:bg-slate-800"
            }`}
          >
            {isOpen ? (
              <span className="text-xl font-bold">×</span>
            ) : (
              <>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
                <span className="w-1 h-1 bg-white rounded-full"></span>
              </>
            )}
          </button>

          {/* Popup Box */}
          {isOpen && (
            <div className="absolute top-12 left-0 w-48 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-left">
              <div className="p-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                  SAR
                </div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-600">Menu</span>
              </div>
              
              <nav className="p-2 space-y-1">
                <Link
                  href="/"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Billing
                </Link>
                <Link
                  href="/reports"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  Reports
                </Link>
                <Link
                  href="/tracker"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  Tracker
                </Link>
              </nav>

              <div className="p-2 border-t border-slate-50 bg-slate-50/50 text-center">
                <p className="text-[9px] font-bold text-slate-400">v2.0.1 • SAR FOOD HOUSE</p>
              </div>
            </div>
          )}
        </div>

        {/* Main area - Now takes full width since sidebar is gone */}
        <main className="h-screen w-full relative">
          {children}
        </main>
      </body>
    </html>
  );
}
