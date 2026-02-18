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
  parcelCharge: number;
}

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [isParcel, setIsParcel] = useState<boolean>(false);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [isMasterOnly, setIsMasterOnly] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Shawarma");
  const [occupiedTables, setOccupiedTables] = useState<Record<string, ActiveTable>>({});
  const [searchQuery, setSearchQuery] = useState(""); 
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

  const handleTableSelect = (t: string) => {
    if (selectedTable === t) {
      setSelectedTable(null);
      setCart([]);
      setParcelCharge(0);
      return;
    }
    setSelectedTable(t);
    if (occupiedTables[t]) {
      setCart(occupiedTables[t].items);
      setIsParcel(occupiedTables[t].isParcel);
      setParcelCharge(occupiedTables[t].parcelCharge);
    } else {
      setCart([]);
      setIsParcel(false);
      setParcelCharge(0);
    }
  };

  const triggerPrint = (order: Order, masterOnly: boolean) => {
    setLastOrder(order);
    setIsMasterOnly(masterOnly);
    setShowReceipt(true);
    setTimeout(() => {
      window.print();
      setShowReceipt(false);
    }, 250);
  };

  const holdOrder = () => {
    if (!selectedTable || cart.length === 0) return;
    const order: Order = {
        id: "KOT-" + Date.now().toString(),
        createdAt: new Date().toISOString(),
        items: cart,
        subtotal, total, paymentMethod: "CASH",
        tableNumber: selectedTable,
        isParcel,
        parcelCharge,
    };
    setOccupiedTables(prev => ({ ...prev, [selectedTable]: { items: cart, isParcel, parcelCharge } }));
    triggerPrint(order, true);
    setCart([]);
    setSelectedTable(null);
    setIsParcel(false);
    setParcelCharge(0);
  };

  const handleSaveAndPrint = () => {
    if (cart.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal, total, paymentMethod: "CASH",
      tableNumber: selectedTable,
      isParcel,
      parcelCharge,
    };
    saveOrder(order); 
    triggerPrint(order, false);
    if (selectedTable) {
      const newOccupied = { ...occupiedTables };
      delete newOccupied[selectedTable];
      setOccupiedTables(newOccupied);
    }
    setCart([]);
    setSelectedTable(null);
    setIsParcel(false);
    setParcelCharge(0);
  };

  return (
    <>
      <div className="no-print h-screen w-full bg-slate-100 flex overflow-hidden font-sans p-2 gap-2">
        
        {/* LEFT: SLIM TABLES (Red for Occupied) */}
        <section className="w-16 bg-white rounded-xl border flex flex-col items-center py-2 overflow-y-auto gap-2">
          <div className="mt-12"></div> 
          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Tables</p>
          {tableNumbers.map((t) => (
            <button 
              key={t} 
              onClick={() => handleTableSelect(t)} 
              className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all active:scale-90 shadow-sm
                ${selectedTable === t ? "bg-blue-600 text-white" : 
                  occupiedTables[t] ? "bg-red-600 text-white" : "bg-emerald-500 text-white"}`}
            >
              <span className="text-[11px] font-black">{t}</span>
              {occupiedTables[t] && <span className="text-[7px] font-bold">BUSY</span>}
            </button>
          ))}
        </section>

        {/* MIDDLE: MENU CARDS */}
        <section className="flex-1 bg-white rounded-xl flex flex-col overflow-hidden border">
          <div className="p-2 border-b flex flex-col gap-2 bg-slate-50/30">
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-md font-bold text-[10px] uppercase transition-all ${activeCategory === cat ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-500 border"}`}>{cat}</button>
              ))}
            </div>
            <input type="text" placeholder="Search menu..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-3 py-1.5 border rounded-lg text-xs outline-none focus:ring-1 focus:ring-blue-500" />
          </div>

          <div className="flex-1 overflow-y-auto p-2 grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 content-start">
            {filteredProducts.map(p => (
              <button key={p.id} onClick={() => addToCart(p)} className="bg-white border border-slate-200 rounded-xl p-2.5 hover:border-blue-500 flex flex-col justify-between min-h-[90px] active:bg-slate-50 transition-all shadow-sm">
                <span className="font-bold text-slate-700 text-[10px] leading-tight uppercase line-clamp-3">
                    {p.name}
                </span>
                <span className="text-blue-600 font-black text-[13px] mt-2 pt-1 border-t border-slate-50">₹{p.price}</span>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: BILLING PANEL */}
        <section className="w-80 bg-slate-900 rounded-xl flex flex-col text-white shadow-2xl">
          <div className="p-3 border-b border-slate-800">
            <div className="flex gap-1.5 mb-2">
              <button onClick={() => {setIsParcel(false); setParcelCharge(0);}} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${!isParcel ? "bg-emerald-600" : "bg-slate-800 text-slate-500"}`}>Dine-In</button>
              <button onClick={() => {setIsParcel(true); setParcelCharge(10);}} className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase ${isParcel ? "bg-orange-600" : "bg-slate-800 text-slate-500"}`}>Parcel</button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {cart.map(item => (
              <div key={item.id} className="bg-slate-800/40 p-2 rounded-lg flex justify-between items-center border border-slate-800/50">
                <span className="text-[10px] font-bold uppercase truncate w-28">{item.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-6 h-6 bg-slate-700 rounded-md text-xs">-</button>
                  <span className="text-xs font-bold w-4 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-6 h-6 bg-slate-700 rounded-md text-xs">+</button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-800/80 rounded-b-xl border-t border-slate-700">
            {isParcel && (
              <div className="flex justify-between items-center mb-2 px-1 text-orange-400">
                <span className="text-[10px] font-bold uppercase">Parcel Fee</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setParcelCharge(prev => Math.max(0, prev - 10))} className="w-5 h-5 bg-slate-700 rounded text-xs">-</button>
                  <span className="text-xs font-black">₹{parcelCharge}</span>
                  <button onClick={() => setParcelCharge(prev => prev + 10)} className="w-5 h-5 bg-slate-700 rounded text-xs">+</button>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase">Net Total</span>
              <span className="text-3xl font-black">₹{total}</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={holdOrder} 
                disabled={!selectedTable || cart.length === 0} 
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl font-bold text-[10px] uppercase transition-all"
              >
                Hold / KOT
              </button>
              <button 
                onClick={handleSaveAndPrint} 
                disabled={cart.length === 0} 
                className="flex-[2] bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-black text-xs uppercase shadow-lg transition-all"
              >
                Settle & Print
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print { 
          .no-print { display: none !important; } 
          .print-only { display: block !important; }
          @page { margin: 0; }
        }
      `}</style>

      {/* --- LARGE FONT PRINT TEMPLATE --- */}
      {showReceipt && lastOrder && (
        <div className="print-only hidden mx-auto text-black font-mono leading-tight w-[58mm] p-1">
          <div className="text-center font-bold mb-1 uppercase text-[16px]">
            {isMasterOnly ? "--- MASTER COPY ---" : "S.A.R FOOD HOUSE"}
          </div>
          <div className="flex justify-between text-[12px] mb-2 border-b border-black pb-1 font-bold">
            <span>{lastOrder.isParcel ? "PARCEL" : `TABLE: ${lastOrder.tableNumber}`}</span>
            <span>{new Date(lastOrder.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          </div>
          
          <div className="space-y-2 mb-2">
            {lastOrder.items.map(item => (
              <div key={item.id} className="border-b border-dotted pb-1">
                <div className="flex justify-between text-[14px] font-bold">
                  <span className="uppercase flex-1">{item.name}</span>
                  <span>x{item.qty}</span>
                </div>
                {!isMasterOnly && (
                  <div className="text-right text-[12px]">₹{item.price * item.qty}</div>
                )}
              </div>
            ))}
          </div>

          {!isMasterOnly && (
            <div className="mt-2 border-t border-black pt-1">
               {lastOrder.isParcel && lastOrder.parcelCharge > 0 && (
                 <div className="flex justify-between text-[12px] mb-1">
                   <span>Parcel Fee</span>
                   <span>₹{lastOrder.parcelCharge}</span>
                 </div>
               )}
               <div className="flex justify-between font-black text-[18px] pt-1 border-t-2 border-double mt-1">
                 <span>TOTAL</span>
                 <span>₹{lastOrder.total}</span>
               </div>
               <div className="text-center mt-6 text-[12px] font-bold uppercase">*** Thank You ***</div>
            </div>
          )}
          
          {isMasterOnly && (
             <div className="mt-8 border-t border-black pt-2 text-center text-[12px] font-bold">
                --- KOT END ---
             </div>
          )}
        </div>
      )}
    </>
  );
}