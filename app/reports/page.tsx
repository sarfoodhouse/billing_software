"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "../lib/types";
import { loadOrders } from "../lib/storage";
import { isAuthenticated } from "../lib/auth";

type Summary = {
  totalAmount: number;
  totalOrders: number;
  byPayment: { CASH: number; UPI: number; CARD: number };
};

type CategoryStats = { qty: number; total: number };
type RangePreset = "TODAY" | "LAST_7" | "LAST_30" | "CUSTOM";

export default function ReportsPage() {
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categorySummary, setCategorySummary] = useState<Record<string, CategoryStats>>({});
  const [preset, setPreset] = useState<RangePreset>("TODAY");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
  }, [router]);

  useEffect(() => {
    const data = loadOrders();
    setAllOrders([...data].reverse());
  }, []);

  const applyRange = useCallback((
    range: RangePreset,
    ordersList: Order[],
    fromDate?: string,
    toDate?: string
  ) => {
    if (!ordersList.length) {
      setOrders([]);
      setSummary(null);
      setCategorySummary({});
      return;
    }

    const now = new Date();
    let start: Date;
    let end: Date;

    if (range === "TODAY") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (range === "LAST_7") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (range === "LAST_30") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else {
      if (!fromDate || !toDate) return;
      start = new Date(fromDate);
      start.setHours(0, 0, 0, 0);
      end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
    }

    const filtered = ordersList.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d <= end;
    });

    setOrders(filtered);

    const base: Summary = {
      totalAmount: 0,
      totalOrders: filtered.length,
      byPayment: { CASH: 0, UPI: 0, CARD: 0 },
    };

    const catStats: Record<string, CategoryStats> = {};

    filtered.forEach((o) => {
      base.totalAmount += o.total;
      base.byPayment[o.paymentMethod] += o.total;
      
      o.items.forEach((item) => {
        const catName = (item as any).category || "Others";
        const lineTotal = item.price * item.qty;

        if (!catStats[catName]) {
          catStats[catName] = { qty: 0, total: 0 };
        }
        catStats[catName].qty += item.qty;
        catStats[catName].total += lineTotal;
      });
    });

    setSummary(base);
    setCategorySummary(catStats);
  }, []);

  useEffect(() => {
    applyRange(preset, allOrders, from, to);
  }, [allOrders, preset, from, to, applyRange]);

  const handleDeleteOrder = (orderId: string) => {
    if (confirm("Delete this bill?")) {
      const current = loadOrders();
      const updated = current.filter((o: Order) => o.id !== orderId);
      localStorage.setItem("sar_orders", JSON.stringify(updated));
      setAllOrders([...updated].reverse());
    }
  };

  return (
    <div className="no-print h-screen w-full overflow-y-scroll bg-slate-100 font-sans pb-24">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-2">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sales Analytics</h1>
          <div className="flex flex-wrap gap-2 items-center bg-white p-2 rounded-2xl shadow-sm border">
             {(["TODAY", "LAST_7", "LAST_30"] as RangePreset[]).map((r) => (
              <button
                key={r}
                onClick={() => setPreset(r)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                  preset === r ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {r.replace("_", " ")}
              </button>
            ))}
            <div className="h-4 w-[1px] bg-slate-200 mx-2" />
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="text-[10px] font-bold outline-none bg-transparent" />
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="text-[10px] font-bold outline-none bg-transparent" />
            <button onClick={() => setPreset("CUSTOM")} className="bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-bold uppercase">Go</button>
          </div>
        </div>

        {/* Top Level Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Revenue", val: `₹${summary?.totalAmount.toLocaleString()}`, color: "text-emerald-600" },
            { label: "Orders", val: summary?.totalOrders, color: "text-blue-600" },
            { label: "Cash", val: `₹${summary?.byPayment.CASH.toLocaleString()}`, color: "text-orange-600" },
            { label: "Digital", val: `₹${(summary?.byPayment.UPI || 0) + (summary?.byPayment.CARD || 0)}`, color: "text-purple-600" }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className={`text-2xl font-black ${stat.color}`}>{stat.val || 0}</p>
            </div>
          ))}
        </div>

        {/* --- SIMPLIFIED CATEGORY WISE BREAKDOWN --- */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-slate-50/50">
            <h2 className="text-xs font-black uppercase text-slate-700">Category-wise Sales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {Object.entries(categorySummary).map(([catName, stats]) => (
              <div key={catName} className="p-6 hover:bg-slate-50 transition-colors">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{catName}</p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-2xl font-black text-slate-800">₹{stats.total.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-blue-600 uppercase">Items Sold: {stats.qty}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {Object.keys(categorySummary).length === 0 && (
            <div className="py-10 text-center text-slate-400 text-[10px] font-bold uppercase">No Category Data</div>
          )}
        </div>

        {/* Main Transaction Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mb-10">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-sm font-black text-slate-800 uppercase">Detailed Transaction Log</h2>
            <button onClick={() => window.print()} className="text-[10px] font-bold border px-4 py-2 rounded-xl hover:bg-slate-50 uppercase">Print Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b">
                  <th className="px-6 py-4">Timing</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Order Items</th>
                  <th className="px-6 py-4 text-right">Total</th>
                  <th className="px-6 py-4 text-center">Payment</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-700">{new Date(o.createdAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-[10px] text-slate-400">{new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4">
                      {o.isParcel ? (
                        <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">Parcel</span>
                      ) : (
                        <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                          Table: {o.tableNumber}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-[10px] font-bold text-slate-400">#{o.id.slice(-6)}</td>
                    <td className="px-6 py-4">
                      <div className="text-[11px] text-slate-600 leading-relaxed max-w-xs">
                        {o.items.map((i, idx) => (
                          <span key={idx}>
                            {i.name} <span className="text-slate-400 font-bold">x{i.qty}</span>
                            {idx < o.items.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="text-sm font-black text-slate-800">₹{o.total}</p>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-[9px] uppercase">{o.paymentMethod}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleDeleteOrder(o.id)} className="text-red-400 hover:text-red-600 text-[10px] font-bold uppercase">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}