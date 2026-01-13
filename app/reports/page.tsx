"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "../lib/types";
import { loadOrders } from "../lib/storage";
import { isAuthenticated } from "../lib/auth";

type Summary = {
  totalAmount: number;
  totalOrders: number;
  byPayment: {
    CASH: number;
    UPI: number;
    CARD: number;
  };
};

type CategorySummary = Record<string, number>;

type RangePreset = "TODAY" | "LAST_7" | "LAST_30" | "CUSTOM";

export default function ReportsPage() {
  const router = useRouter();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [categorySummary, setCategorySummary] =
    useState<CategorySummary>({});
  const [preset, setPreset] = useState<RangePreset>("TODAY");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  // 🔐 Auth guard
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    const all = loadOrders();
    setAllOrders(all);
  }, []);

  useEffect(() => {
    if (allOrders.length) {
      applyRange("TODAY");
    } else {
      setOrders([]);
      setSummary(null);
      setCategorySummary({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrders]);

  // 📅 Apply date range filter
  const applyRange = (
    range: RangePreset,
    fromDate?: string,
    toDate?: string
  ) => {
    if (!allOrders.length) {
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
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (range === "LAST_7") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else if (range === "LAST_30") {
      start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    } else {
      if (!fromDate || !toDate) {
        setOrders([]);
        setSummary(null);
        setCategorySummary({});
        return;
      }
      start = new Date(fromDate);
      end = new Date(toDate);
      end.setDate(end.getDate() + 1);
    }

    const filtered = allOrders.filter((o) => {
      const d = new Date(o.createdAt);
      return d >= start && d < end;
    });

    setOrders(filtered);

    const base: Summary = {
      totalAmount: 0,
      totalOrders: filtered.length,
      byPayment: { CASH: 0, UPI: 0, CARD: 0 },
    };

    const categoryTotals: CategorySummary = {};

    filtered.forEach((o) => {
      base.totalAmount += o.total;
      base.byPayment[o.paymentMethod] += o.total;

     o.items.forEach((item) => {
     const category = (item as any).category || "Others";

        const itemTotal = item.price * item.qty;

        if (!categoryTotals[category]) {
          categoryTotals[category] = 0;
        }
        categoryTotals[category] += itemTotal;
      });
    });

    setSummary(base);
    setCategorySummary(categoryTotals);
  };

  // ✅ NEW: Count total quantity per category
  const getCategoryQuantity = (category: string): number => {
    return orders.reduce((total, order) => {
      return total + order.items.reduce((catTotal, item) => {
        if (((item as any).category || "Others") === category) {
          return catTotal + item.qty;
        }
        return catTotal;
      }, 0);
    }, 0);
  };

  // 🧠 Group items by category (for table display)
  const groupItemsByCategory = (items: any[]) => {
    return items.reduce((acc: Record<string, any[]>, item) => {
      const category = item.category || "Others";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  };

  return (
    <div className="no-print h-full p-4 bg-slate-200">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="flex gap-2 flex-wrap">
            {(["TODAY", "LAST_7", "LAST_30"] as RangePreset[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setPreset(r);
                  applyRange(r);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                  preset === r
                    ? "bg-slate-900 text-white border-slate-900 shadow-md"
                    : "bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:shadow-sm"
                }`}
              >
                {r === "TODAY"
                  ? "Today"
                  : r === "LAST_7"
                  ? "Last 7 days"
                  : "Last 30 days"}
              </button>
            ))}
          </div>

          <div className="flex gap-2 text-sm items-center flex-wrap">
            <span className="text-slate-500 font-medium">Custom:</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <span className="text-slate-500">to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
            />
            <button
              onClick={() => {
                setPreset("CUSTOM");
                applyRange("CUSTOM", from, to);
              }}
              className="px-4 py-2 rounded-lg border-2 bg-white border-slate-300 hover:bg-slate-50 font-medium text-sm transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Sales Summary */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-6 border-b pb-3">
            💰 Sales Summary
          </h1>

          {summary ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 shadow-sm">
                <div className="text-sm text-emerald-700 font-medium uppercase tracking-wide">Total Sales</div>
                <div className="text-3xl font-black text-emerald-700 mt-1">₹{summary.totalAmount.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm">
                <div className="text-sm text-blue-700 font-medium uppercase tracking-wide">Total Bills</div>
                <div className="text-3xl font-black text-blue-700 mt-1">{summary.totalOrders}</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 shadow-sm">
                <div className="text-sm text-orange-700 font-medium uppercase tracking-wide">Cash</div>
                <div className="text-3xl font-black text-orange-700 mt-1">₹{summary.byPayment.CASH.toLocaleString()}</div>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
                <div className="text-sm text-purple-700 font-medium uppercase tracking-wide">Digital</div>
                <div className="text-lg font-black text-purple-700 mt-1">
                  UPI ₹{summary.byPayment.UPI.toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">Card ₹{summary.byPayment.CARD.toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">📊</div>
              <div>No sales data available for selected period</div>
            </div>
          )}
        </div>

        {/* ✅ UPDATED: Category-wise Sales with Quantity */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6 border-b pb-3">
            🍽️ Category-wise Sales
          </h2>

          {Object.keys(categorySummary).length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <div className="text-4xl mb-3">📦</div>
              <div>No category data available</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categorySummary)
                .sort(([,a], [,b]) => b - a) // Sort by amount descending
                .map(([cat, amt]) => {
                  const quantity = getCategoryQuantity(cat);
                  return (
                    <div
                      key={cat}
                      className="group p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 hover:border-orange-300"
                    >
                      {/* Category Icon & Name */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <span className="text-2xl">
                            {cat === 'SHAWARMA' ? '🌯' : 
                             cat === 'CHAAT' ? '🧆' : 
                             cat === 'JUICE' ? '🧃' : 
                             cat === 'ICE_CREAM' ? '🍦' : '🍽️'}
                          </span>
                        </div>
                        <div>
                          <div className="font-bold text-xl text-slate-900 capitalize tracking-tight">
                            {cat.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-slate-500">{quantity} items sold</div>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent mb-3">
                        ₹{amt.toLocaleString()}
                      </div>
                      
                      {/* Progress-like bar */}
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
                          style={{width: `${Math.min((amt / Math.max(...Object.values(categorySummary))) * 100, 100)}%`}}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Bills Table */}
        <div className="bg-white rounded-2xl shadow-lg border p-6">
          <div className="flex justify-between items-center mb-6 pb-3 border-b">
            <h2 className="text-xl font-bold text-slate-900">
              📋 Bills in selected period ({orders.length})
            </h2>
            <button 
              onClick={() => window.print()}
              className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium shadow-sm transition-all"
            >
              🖨️ Print Report
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="text-5xl mb-4">📄</div>
              <div className="text-lg font-medium mb-2">No bills found</div>
              <div className="text-sm">Try adjusting the date range above</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden shadow-inner">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100">
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Time</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Bill ID</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Items</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-right font-semibold text-slate-700">Total</th>
                    <th className="border-b border-slate-200 px-4 py-3 text-left font-semibold text-slate-700">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const d = new Date(o.createdAt);
                    const grouped = groupItemsByCategory(o.items);

                    return (
                      <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                        <td className="border-b border-slate-100 px-4 py-3 font-medium">
                          {d.toLocaleDateString('en-IN')}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3 text-slate-600">
                          {d.toLocaleTimeString('en-IN', { hour12: false })}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3 font-semibold text-orange-600">
                          #{o.id.slice(-6)}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3">
                          {Object.entries(grouped).map(([cat, items]) => (
                            <div key={cat} className="mb-2 pb-1 border-b border-dotted border-slate-200 last:border-b-0">
                              <div className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">
                                {cat}
                              </div>
                              <div className="text-xs text-slate-600 pl-2">
                                {(items as any[])
                                  .map((i: any) => `${i.name} x${i.qty}`)
                                  .join(", ")}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3 text-right font-bold text-lg text-emerald-700">
                          ₹{o.total.toLocaleString()}
                        </td>
                        <td className="border-b border-slate-100 px-4 py-3 font-semibold">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            o.paymentMethod === 'CASH' 
                              ? 'bg-green-100 text-green-800' 
                              : o.paymentMethod === 'UPI'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {o.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
