"use client";

import { useEffect, useState } from "react";
import { loadOrders } from "../lib/storage";
import { Order } from "../lib/types";

interface Expense {
  id: string;
  description: string;
  amount: number;
  type: "CASH" | "UPI";
  date: string;
}

export default function CashRegisterPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"CASH" | "UPI">("CASH");
  const [salesData, setSalesData] = useState({ cash: 0, upi: 0, total: 0 });

  useEffect(() => {
    // 1. Load Expenses
    const savedExp = localStorage.getItem("sar_expenses");
    if (savedExp) setExpenses(JSON.parse(savedExp));

    // 2. Load Today's Sales
    const today = new Date().toLocaleDateString();
    const orders: Order[] = loadOrders();
    const totals = orders
      .filter(o => new Date(o.createdAt).toLocaleDateString() === today)
      .reduce((acc, o) => {
        if (o.paymentMethod === "CASH") acc.cash += o.total;
        else acc.upi += o.total; 
        acc.total += o.total;
        return acc;
      }, { cash: 0, upi: 0, total: 0 });
    
    setSalesData(totals);
  }, []);

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    const newExp: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString(),
    };

    const updated = [newExp, ...expenses];
    setExpenses(updated);
    localStorage.setItem("sar_expenses", JSON.stringify(updated));
    setDescription("");
    setAmount("");
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(e => e.id !== id);
    setExpenses(updated);
    localStorage.setItem("sar_expenses", JSON.stringify(updated));
  };

  // Calculations for Today
  const todayStr = new Date().toLocaleDateString();
  const todayExpList = expenses.filter(e => e.date === todayStr);
  const totalExpenses = todayExpList.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = salesData.total - totalExpenses;

  return (
    <div className="h-screen w-full overflow-y-auto bg-slate-100 font-sans p-4 pb-24">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Daily Cash Register</h1>
          <p className="text-[10px] font-bold bg-white px-3 py-1 rounded-full border shadow-sm text-slate-500">{todayStr}</p>
        </div>

        {/* FINANCIAL OVERVIEW CARD */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Sales (Gross)</p>
                    <p className="text-4xl font-black">₹{salesData.total.toLocaleString()}</p>
                    <div className="flex gap-3 mt-2">
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Cash: ₹{salesData.cash}</span>
                        <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">UPI: ₹{salesData.upi}</span>
                    </div>
                </div>

                <div className="border-l border-slate-800 md:pl-8">
                    <p className="text-red-400 text-[10px] font-black uppercase tracking-widest mb-2">Total Expenses</p>
                    <p className="text-4xl font-black text-red-400">₹{totalExpenses.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-2">Total bills paid today</p>
                </div>

                <div className="bg-blue-600 rounded-3xl p-6 shadow-xl transform md:scale-110">
                    <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest mb-1">Final Balance (Net)</p>
                    <p className="text-4xl font-black text-white">₹{netBalance.toLocaleString()}</p>
                    <p className="text-[10px] text-blue-200 mt-2">Available Cash + Digital</p>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ADD EXPENSE FORM */}
            <div className="lg:col-span-1">
                <form onSubmit={addExpense} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h2 className="text-xs font-black uppercase text-slate-700 mb-4">Log New Expense</h2>
                    
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400">Expense Details</label>
                        <input 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: 10kg Onions" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400">Amount</label>
                            <input 
                                type="number" 
                                value={amount} 
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400">Mode</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as any)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mt-1 text-sm focus:outline-none"
                            >
                                <option value="CASH">CASH</option>
                                <option value="UPI">UPI</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-slate-900 text-white font-black text-xs uppercase py-4 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        Add to Expenses
                    </button>
                </form>
            </div>

            {/* EXPENSE LIST */}
            <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-full">
                    <div className="p-5 border-b bg-slate-50/50">
                        <h2 className="text-xs font-black uppercase text-slate-700">Today's Expense Log</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[9px] font-black text-slate-400 uppercase border-b">
                                    <th className="px-6 py-4">Item</th>
                                    <th className="px-6 py-4">Mode</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y text-sm">
                                {todayExpList.map((exp) => (
                                    <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">{exp.description}</td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[9px] font-black px-2 py-1 rounded-md ${exp.type === 'CASH' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {exp.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-black">₹{exp.amount}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button onClick={() => deleteExpense(exp.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {todayExpList.length === 0 && (
                            <div className="py-12 text-center">
                                <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">No Expenses Recorded Today</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}