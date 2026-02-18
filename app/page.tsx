"use client";

import { useEffect, useState } from "react";
import { products } from "./lib/data";
import type { OrderItem, Order } from "./lib/types";
import { saveOrder } from "./lib/storage";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./lib/auth";

const categories = ["Shawarma", "Fries & Sandwich", "Puri", "Chaats", "Vada Pav", "Pav Bhaji", "Juice", "Ice Cream", "Water", "Grill Chicken", "Haleem"];
const tableNumbers = ["T1", "T2", "T3", "T4", "T5", "B1", "B2", "B3", "B4"];

interface ActiveTable {
  items: OrderItem[];
  isParcel: boolean;
}

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD">("CASH");
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isParcel, setIsParcel] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isMasterOnly, setIsMasterOnly] = useState(false); // Track if we only print master copy
  const [activeCategory, setActiveCategory] = useState("Shawarma");
  const [occupiedTables, setOccupiedTables] = useState<Record<string, ActiveTable>>({});
  const [searchQuery, setSearchQuery] = useState(""); 
  const [customerName, setCustomerName] = useState(""); 
  const [parcelCharge, setParcelCharge] = useState<number>(0); 

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) router.replace("/login");
    setMounted(true);
  }, [router]);

  if (!mounted) return null;

  const filteredProducts = products
    .filter((p) => p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const addToCart = (prod: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === prod.id);
      if (existing) {
        return prev.map((i) => (i.id === prod.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty } : i)));
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal + parcelCharge;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleTableSelect = (t: string) => {
    if (selectedTable === t) {
      setSelectedTable(null);
      setCart([]);
      setCustomerName("");
      setParcelCharge(0);
      return;
    }
    setSelectedTable(t);
    if (occupiedTables[t]) {
      setCart(occupiedTables[t].items);
      setIsParcel(occupiedTables[t].isParcel);
      const newParcelCharge = occupiedTables[t].isParcel ? occupiedTables[t].items.reduce((sum, item) => sum + 10 * item.qty, 0) : 0;
      setParcelCharge(newParcelCharge);
    } else {
      setCart([]);
      setIsParcel(false);
      setCustomerName("");
      setParcelCharge(0);
    }
  };

  // --- PRINT LOGIC ---
  const triggerPrint = (order: Order, masterOnly: boolean) => {
    setLastOrder(order);
    setIsMasterOnly(masterOnly);
    setShowReceipt(true);
    setTimeout(() => {
      window.print();
      setShowReceipt(false);
    }, 200);
  };

  const holdOrder = () => {
    if (!selectedTable || cart.length === 0) return;
    
    const order: Order = {
        id: "HOLD-" + Date.now().toString(),
        createdAt: new Date().toISOString(),
        items: cart,
        subtotal, total, paymentMethod,
        tableNumber: selectedTable,
        isParcel,
        customerName: customerName || "Table Guest",
        parcelCharge,
      };

    setOccupiedTables(prev => ({ ...prev, [selectedTable]: { items: cart, isParcel } }));
    
    // Print only Master Copy for Hold
    triggerPrint(order, true);

    setCart([]);
    setSelectedTable(null);
    setIsParcel(false);
    setCustomerName("");
    setParcelCharge(0);
  };

  const handleSaveAndPrint = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal, total, paymentMethod,
      tableNumber: selectedTable,
      isParcel,
      customerName: customerName || "Walk-in",
      parcelCharge,
    };

    saveOrder(order); 
    
    // Print both for Settlement
    triggerPrint(order, false);

    if (selectedTable) {
      const newOccupied = { ...occupiedTables };
      delete newOccupied[selectedTable];
      setOccupiedTables(newOccupied);
    }
    setCart([]);
    setSelectedTable(null);
    setIsParcel(false);
    setCustomerName("");
    setParcelCharge(0);
  };

  const adjustParcelCharge = (amount: number) => {
    setParcelCharge(prev => Math.max(0, prev + amount));
  };

  return (
    <>
      {/* UI SECTION (Omitted for brevity, same as your previous code) */}
      <div className="no-print h-screen w-full bg-slate-100 flex overflow-hidden font-sans p-2 gap-2">
         {/* ... (Existing table, menu, and billing panel code here) ... */}
         {/* Ensure the Hold and Settle buttons call the updated functions */}
         <section className="w-28 bg-white rounded-xl border border-slate-200 flex flex-col items-center py-3 overflow-y-auto gap-3 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tables</p>
          {tableNumbers.map((t) => {
            const isOccupied = !!occupiedTables[t];
            return (
              <button
                key={t}
                onClick={() => handleTableSelect(t)}
                className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center border-b-4 transition-all active:scale-95 ${
                  selectedTable === t ? "bg-blue-600 border-blue-800 text-white shadow-lg -translate-y-1" : isOccupied ? "bg-red-500 border-red-700 text-white" : "bg-emerald-500 border-emerald-700 text-white"
                }`}
              >
                <span className="text-sm font-black">{t}</span>
                <span className="text-[10px] font-bold opacity-80 uppercase">{isOccupied ? "Busy" : "Free"}</span>
              </button>
            );
          })}
        </section>

        <section className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200">
            <div className="p-3 border-b border-slate-100 flex flex-wrap gap-2">
                {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg font-bold text-sm uppercase ${activeCategory === cat ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{cat}</button>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto p-3 grid grid-cols-3 gap-3">
                {filteredProducts.map(p => (
                    <button key={p.id} onClick={() => addToCart(p)} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500">
                        <span className="block font-bold text-slate-800 text-sm">{p.name}</span>
                        <span className="text-blue-600 font-black">₹{p.price}</span>
                    </button>
                ))}
            </div>
        </section>

        <section className="w-96 bg-slate-900 rounded-xl flex flex-col overflow-hidden text-white">
            <div className="p-4 border-b border-slate-800">
                <h2 className="font-black text-sm text-slate-500 mb-2 uppercase">{selectedTable ? `TABLE ${selectedTable}` : "WALK-IN"}</h2>
                <div className="flex gap-2">
                    <button onClick={() => {setIsParcel(false); setParcelCharge(0);}} className={`flex-1 py-2 rounded-lg text-xs font-bold ${!isParcel ? "bg-emerald-600" : "bg-slate-800"}`}>DINE-IN</button>
                    <button onClick={() => {setIsParcel(true); setParcelCharge(10 * totalItems);}} className={`flex-1 py-2 rounded-lg text-xs font-bold ${isParcel ? "bg-orange-600" : "bg-slate-800"}`}>PARCEL</button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {cart.map(item => (
                    <div key={item.id} className="bg-slate-800 p-2 rounded flex justify-between items-center">
                        <span className="text-sm">{item.name} x{item.qty}</span>
                        <div className="flex gap-2">
                            <button onClick={() => updateQty(item.id, item.qty - 1)} className="px-2 bg-slate-700">-</button>
                            <button onClick={() => updateQty(item.id, item.qty + 1)} className="px-2 bg-slate-700">+</button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="p-4 bg-slate-800">
                <div className="flex justify-between text-xl font-black mb-4"><span>TOTAL</span><span>₹{total}</span></div>
                <div className="flex gap-2">
                    <button onClick={holdOrder} disabled={!selectedTable || cart.length === 0} className="flex-1 bg-slate-700 py-3 rounded-xl font-bold">HOLD</button>
                    <button onClick={handleSaveAndPrint} disabled={cart.length === 0} className="flex-[2] bg-blue-600 py-3 rounded-xl font-black uppercase">Settle & Print</button>
                </div>
            </div>
        </section>
      </div>

      <style jsx global>{`
        @media print { 
            .no-print { display: none !important; } 
            .print-only { display: block !important; }
            @page { margin: 0; }
            body { margin: 0; padding: 0; }
        }
      `}</style>

      {/* --- THERMAL RECEIPT COMPONENT --- */}
      {showReceipt && lastOrder && (
        <div className="print-only hidden p-2 w-[58mm] mx-auto text-black font-mono text-[12px]">
          
          {/* 1. MASTER COPY (Always prints) */}
          <div className="receipt-section">
            <div className="text-center font-bold text-lg">--- MASTER COPY ---</div>
            <div className="text-center font-bold text-sm mb-1">S.A.R FOOD HOUSE</div>
            <div className="border-b border-dashed mb-2"></div>
            <div className="flex justify-between font-bold">
                <span>{lastOrder.isParcel ? 'PARCEL' : `DINE-IN (${lastOrder.tableNumber})`}</span>
                <span>#{lastOrder.id.slice(-4)}</span>
            </div>
          
            {lastOrder.items.map((item) => (
              <div key={item.id} className="flex justify-between mb-1">
                <span className="flex-1 font-bold">{item.name}</span>
                <span>x{item.qty}</span>
              </div>
            ))}
            
          </div>

          {/* 2. CUSTOMER COPY (Only prints if NOT master-only) */}
          {!isMasterOnly && (
            <div className="receipt-section mt-10 border-t-2 border-double pt-5">
              <div className="text-center font-bold text-lg">S.A.R FOOD HOUSE</div>
              <div className="text-center text-[10px] mb-2">Customer Receipt</div>
              <div className="flex justify-between">
                <span>Date: {new Date(lastOrder.createdAt).toLocaleDateString()}</span>
                <span>Time: {new Date(lastOrder.createdAt).toLocaleTimeString()}</span>
              </div>
              <div className="border-b border-dashed my-1"></div>
              
              {lastOrder.items.map((item) => (
                <div key={item.id} className="flex justify-between mb-1">
                  <span>{item.name} x{item.qty}</span>
                  <span>₹{item.price * item.qty}</span>
                </div>
              ))}
              
              {lastOrder.isParcel && (
                <div className="flex justify-between italic">
                  <span>Parcel Charge</span>
                  <span>₹{lastOrder.parcelCharge}</span>
                </div>
              )}
              
              <div className="border-t border-dashed mt-1 pt-1 flex justify-between font-black text-[14px]">
                <span>TOTAL</span>
                <span>₹{lastOrder.total}</span>
              </div>
              <div className="text-center mt-2 italic">Payment: {lastOrder.paymentMethod}</div>
              <div className="text-center mt-4 uppercase font-bold">--- Thank You ---</div>
            </div>
          )}
        </div>
      )}
    </>
  );
}