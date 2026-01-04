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

type RangePreset = "TODAY" | "LAST_7" | "LAST_30" | "CUSTOM";

export default function ReportsPage() {
  const router = useRouter();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [preset, setPreset] = useState<RangePreset>("TODAY");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  // auth guard
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allOrders]);

  const applyRange = (
    range: RangePreset,
    fromDate?: string,
    toDate?: string
  ) => {
    if (!allOrders.length) {
      setOrders([]);
      setSummary(null);
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
      // CUSTOM
      if (!fromDate || !toDate) {
        setOrders([]);
        setSummary(null);
        return;
      }
      start = new Date(fromDate);
      end = new Date(toDate);
      end.setDate(end.getDate() + 1); // include full "to" day
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

    filtered.forEach((o) => {
      base.totalAmount += o.total;
      base.byPayment[o.paymentMethod] += o.total;
    });

    setSummary(base);
  };

  return (
    <div className="no-print h-full p-4 bg-slate-200">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
          <div className="flex gap-2">
            {(["TODAY", "LAST_7", "LAST_30"] as RangePreset[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setPreset(r);
                  applyRange(r);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs border ${
                  preset === r
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-300"
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

          <div className="flex gap-2 text-xs items-center">
            <span className="text-slate-500">Custom:</span>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
            <span>to</span>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1 bg-white"
            />
            <button
              onClick={() => {
                setPreset("CUSTOM");
                applyRange("CUSTOM", from, to);
              }}
              className="px-3 py-1.5 rounded-lg border bg-white text-slate-700 text-xs"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4">
          <h1 className="text-lg font-semibold text-slate-900 mb-2">
            Sales Summary
          </h1>
          {summary ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Total sales</div>
                <div className="text-lg font-semibold text-slate-900">
                  ₹{summary.totalAmount}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Bills</div>
                <div className="text-lg font-semibold text-slate-900">
                  {summary.totalOrders}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">Cash</div>
                <div className="text-lg font-semibold text-slate-900">
                  ₹{summary.byPayment.CASH}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="text-xs text-slate-500">UPI</div>
                <div className="text-lg font-semibold text-slate-900">
                  ₹{summary.byPayment.UPI}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Card: ₹{summary.byPayment.CARD}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-sm text-slate-500">
              No data for this period.
            </div>
          )}
        </div>

        {/* Bills table */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-4">
          <h2 className="text-md font-semibold text-slate-900 mb-2">
            Bills in selected period
          </h2>
          {orders.length === 0 ? (
            <div className="text-sm text-slate-500">
              No bills in this period.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-600">
                    <th className="border px-2 py-1 text-left">Date</th>
                    <th className="border px-2 py-1 text-left">Time</th>
                    <th className="border px-2 py-1 text-left">ID</th>
                    <th className="border px-2 py-1 text-left">Items</th>
                    <th className="border px-2 py-1 text-right">Total</th>
                    <th className="border px-2 py-1 text-left">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => {
                    const d = new Date(o.createdAt);
                    return (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="border px-2 py-1">
                          {d.toLocaleDateString()}
                        </td>
                        <td className="border px-2 py-1">
                          {d.toLocaleTimeString()}
                        </td>
                        <td className="border px-2 py-1">
                          {o.id.slice(-6)}
                        </td>
                        <td className="border px-2 py-1">
                          {o.items
                            .map((i) => `${i.name} x${i.qty}`)
                            .join(", ")}
                        </td>
                        <td className="border px-2 py-1 text-right">
                          ₹{o.total}
                        </td>
                        <td className="border px-2 py-1">{o.paymentMethod}</td>
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
