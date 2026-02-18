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
    // Add logic here if you want automatic parcel charging per item added
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
      // Recalculate parcel charge based on current logic or stored state
      const newParcelCharge = occupiedTables[t].isParcel ? occupiedTables[t].items.reduce((sum, item) => sum + 10 * item.qty, 0) : 0;
      setParcelCharge(newParcelCharge);
    } else {
      setCart([]);
      setIsParcel(false);
      setCustomerName("");
      setParcelCharge(0);
    }
  };

  const holdOrder = () => {
    if (!selectedTable || cart.length === 0) return;
    setOccupiedTables(prev => ({
      ...prev,
      [selectedTable]: { items: cart, isParcel }
    }));
    setCart([]);
    setSelectedTable(null);
    setIsParcel(false);
    setCustomerName("");
    setParcelCharge(0);
  };

  const handleSaveAndPrint = () => {
    if (cart.length === 0) return;

    // Fixed: Matching the Order type exactly
    const order: Order = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      items: cart,
      subtotal: subtotal,
      total: total,
      paymentMethod,
      tableNumber: selectedTable,
      isParcel,
      customerName: customerName || "Walk-in",
      parcelCharge,
    };

    saveOrder(order); 
    setLastOrder(order); 
    setShowReceipt(true);

    setTimeout(() => {
      window.print();
      setShowReceipt(false);
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
    }, 200);
  };

  const adjustParcelCharge = (amount: number) => {
    setParcelCharge(prev => Math.max(0, prev + amount));
  };

  return (
    <>
      <div className="no-print h-screen w-full bg-slate-100 flex overflow-hidden font-sans p-2 gap-2">
        
        {/* LEFT: TABLE STATUS */}
        <section className="w-28 bg-white rounded-xl border border-slate-200 flex flex-col items-center py-3 overflow-y-auto gap-3 shadow-sm">
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Tables</p>
          {tableNumbers.map((t) => {
            const isOccupied = !!occupiedTables[t];
            return (
              <button
                key={t}
                onClick={() => handleTableSelect(t)}
                className={`w-18 h-18 rounded-2xl flex flex-col items-center justify-center border-b-4 transition-all active:scale-95 ${
                  selectedTable === t 
                    ? "bg-blue-600 border-blue-800 text-white shadow-lg -translate-y-1" 
                    : isOccupied 
                      ? "bg-red-500 border-red-700 text-white" 
                      : "bg-emerald-500 border-emerald-700 text-white"
                }`}
              >
                <span className="text-sm font-black">{t}</span>
                <span className="text-[10px] font-bold opacity-80 uppercase">
                  {isOccupied ? "Busy" : "Free"}
                </span>
              </button>
            );
          })}
        </section>

        {/* MIDDLE: MENU SELECTION */}
        <section className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden border border-slate-200">
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex flex-wrap gap-2 mb-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm uppercase transition-all ${
                    activeCategory === cat ? "bg-blue-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 content-start">
            {filteredProducts.map((p) => (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between min-h-[100px]"
              >
                <span className="font-bold text-slate-800 text-sm leading-tight">{p.name}</span>
                <span className="text-blue-600 font-black text-lg mt-2">₹{p.price}</span>
              </button>
            ))}
          </div>
        </section>

        {/* RIGHT: BILLING PANEL */}
        <section className="w-96 bg-slate-900 rounded-xl shadow-xl flex flex-col overflow-hidden text-white">
          <div className="p-4 border-b border-slate-800">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-black text-sm text-slate-500 uppercase tracking-[0.2em]">
                {selectedTable ? `TABLE ${selectedTable}` : "WALK-IN ORDER"}
              </h2>
              <button 
                onClick={() => {setCart([]); setSelectedTable(null); setIsParcel(false); setCustomerName(""); setParcelCharge(0);}} 
                className="text-sm text-red-400 font-bold hover:underline"
              >
                VOID ALL
              </button>
            </div>
            
            <input
              type="text"
              placeholder="Customer Name (Optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 mb-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm focus:outline-none"
            />
            
            <div className="flex gap-2">
              <button 
                onClick={() => {setIsParcel(false); setParcelCharge(0);}} 
                className={`flex-1 py-3 rounded-lg text-sm font-black border transition-all ${!isParcel ? "bg-emerald-600 border-emerald-600 shadow-lg" : "bg-slate-800 border-slate-700 text-slate-500"}`}
              >
                DINE-IN
              </button>
              <button 
                onClick={() => {setIsParcel(true); setParcelCharge(10 * totalItems);}} 
                className={`flex-1 py-3 rounded-lg text-sm font-black border transition-all ${isParcel ? "bg-orange-600 border-orange-600 shadow-lg" : "bg-slate-800 border-slate-700 text-slate-500"}`}
              >
                PARCEL
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {cart.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No items in cart.</p>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="bg-slate-800/40 p-3 rounded-lg flex justify-between items-center border border-slate-800/50">
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-bold">{item.name}</p>
                    <p className="text-xs text-slate-500">₹{item.price} each</p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 rounded p-1">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-8 h-8 text-blue-400 font-bold hover:bg-slate-700 rounded">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-8 h-8 text-blue-400 font-bold hover:bg-slate-700 rounded">+</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-slate-800/90 border-t border-slate-700">
            <div className="space-y-1 mb-4">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Items: {totalItems}</span>
                <span>Subtotal: ₹{subtotal}</span>
              </div>
              {isParcel && (
                <div className="flex justify-between items-center text-sm text-orange-400">
                  <span>Parcel Charge</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => adjustParcelCharge(-10)} className="w-6 h-6 bg-slate-700 text-orange-400 font-bold rounded">-</button>
                    <span>₹{parcelCharge}</span>
                    <button onClick={() => adjustParcelCharge(10)} className="w-6 h-6 bg-slate-700 text-orange-400 font-bold rounded">+</button>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-end pt-2 border-t border-slate-600">
                <span className="text-white text-lg font-bold uppercase">Total</span>
                <span className="text-4xl font-black text-white">₹{total}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["CASH", "UPI", "CARD"] as const).map((pm) => (
                <button 
                  key={pm} 
                  onClick={() => setPaymentMethod(pm)} 
                  className={`py-2 rounded-lg text-sm font-black border transition-all ${paymentMethod === pm ? "bg-white text-slate-900 border-white" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                >
                  {pm}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={holdOrder}
                disabled={!selectedTable || cart.length === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 py-3 rounded-xl font-bold text-xs uppercase"
              >
                Hold
              </button>
              <button
                onClick={handleSaveAndPrint}
                disabled={cart.length === 0}
                className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 py-3 rounded-xl font-black text-sm tracking-widest shadow-lg active:scale-95"
              >
                SETTLE & PRINT
              </button>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @media print { .no-print { display: none !important; } .print-only { display: block !important; } }
      `}</style>

      {/* THERMAL RECEIPT */}
      {showReceipt && lastOrder && (
        <div className="print-only hidden p-2 w-[58mm] mx-auto text-black font-mono">
          <div className="text-center font-bold text-xl mb-1">S.A.R FOOD HOUSE</div>
          <div className="text-[14px] text-center border-b border-dashed pb-1 mb-2 italic">
            {lastOrder.tableNumber ? `Table: ${lastOrder.tableNumber}` : 'Parcel'} | {new Date(lastOrder.createdAt).toLocaleTimeString()}
          </div>
          {lastOrder.items.map((item) => (
            <div key={item.id} className="flex justify-between text-[14px] mb-1">
              <span className="flex-1">{item.name} x{item.qty}</span>
              <span>₹{item.price * item.qty}</span>
            </div>
          ))}
          {lastOrder.isParcel && <div className="flex justify-between text-[14px]"><span>Parcel Charge</span><span>₹{lastOrder.parcelCharge}</span></div>}
          <div className="border-t border-dashed mt-1 pt-1 flex justify-between font-bold text-base">
            <span>TOTAL</span>
            <span>₹{lastOrder.total}</span>
          </div>
          <div className="text-center text-[14px] mt-2">Payment: {lastOrder.paymentMethod}</div>
          <div className="text-center text-[14px] mt-4 uppercase">--- Thank You ---</div>
        </div>
      )}
    </>
  );
}