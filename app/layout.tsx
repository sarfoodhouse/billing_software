"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex bg-slate-200 text-slate-900">
        {/* Sidebar */}
        <aside className="no-print w-64 bg-slate-900 text-slate-100 flex flex-col shadow-lg">
          <div className="px-5 py-6 border-b border-slate-700 flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
              SAR
            </div>
            <div>
              <div className="font-bold tracking-wide text-sm">
                S.A.R 
              </div>
              <div className="text-[11px] text-slate-300">
                Food House
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 text-sm space-y-1">
            <a
              href="/"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-slate-100"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Billing</span>
            </a>
            <a
              href="/reports"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-200 hover:bg-slate-800/70"
            >
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span>Reports</span>
            </a>
          </nav>

          <div className="px-5 py-4 text-[11px] text-slate-400">
            © {new Date().getFullYear()} SAR Food House
          </div>
        </aside>

        {/* Main area */}
        <main className="flex-1 flex flex-col">
          <div className="flex-1">{children}</div>
        </main>
      </body>
    </html>
  );
}
