"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { products } from "./lib/data";
import type { OrderItem, Order } from "./lib/types";
import { saveOrder } from "./lib/storage";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "./lib/auth";

const categories = ["Shawarma" , "Fries & Sandwich" ,"Puri","Chaats","Vada Pav", "Pav Bhaji", "Juice", "Ice Cream"];

export default function BillingPage() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<string>("");
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "UPI" | "CARD">(
    "CASH"
  );
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Shawarma");

  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setNow(new Date().toISOString());
    }
  }, [mounted, cart, paymentMethod]);

  if (!mounted) return null;

  const filteredProducts = products.filter(
  (p) => p.category === activeCategory
);

  const addToCart = (prod: {
    id: string;
    name: string;
    price: number;
    image?: string;
  }) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === prod.id);
      if (existing) {
        return prev.map((i) =>
          i.id === prod.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...prod, qty: 1 }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== id));
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, qty } : i))
      );
    }
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );
  const total = subtotal;

  const handleSaveAndPrint = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      createdAt: now || new Date().toISOString(),
      items: cart,
      subtotal,
      total,
      paymentMethod,
    };

    saveOrder(order);
    setLastOrder(order);
    setShowReceipt(true);

    setTimeout(() => {
      window.print();
      setShowReceipt(false);
      setCart([]);
    }, 200);
  };

  return (
    <>
      <div className="no-print min-h-screen flex flex-col p-3 bg-gradient-to-br from-slate-50 to-slate-200">
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-2rem)]">

          {/* PRODUCTS */}
          <section className="flex-1 bg-white rounded-2xl shadow-xl p-4 flex flex-col">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-3">
              <h1 className="text-lg font-bold">Menu Items</h1>
              <span className="text-sm text-slate-500">Tap to add</span>
            </div>

            {/* CATEGORY BAR */}
            <div className="sticky top-0 z-10 bg-white pb-3 border-b mb-3">
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all
                      ${
                        activeCategory === cat
                          ? "bg-blue-600 text-white shadow-md scale-105"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* PRODUCTS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3 overflow-y-auto auto-rows-max">
              {filteredProducts.map((p) => (
                <button
  key={p.id}
  onClick={() => addToCart(p)}
  className="border rounded-2xl bg-white hover:bg-blue-50 transition shadow-sm active:scale-95 text-left h-[120px] flex flex-col justify-between"
>


                  {p.image && (
                    <div className="relative h-16 bg-slate-100 rounded-t-lg overflow-hidden">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        className="object-cover group-hover:scale-105 transition"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-sm font-semibold leading-tight line-clamp-2">
                          {p.name}
                           </div>

  <div className="flex justify-between items-center mt-1">
    <span className="text-sm font-bold text-slate-900">
      ₹{p.price}
    </span>
    <span className="bg-blue-600 text-white px-2 py-[2px] rounded text-[10px] font-bold">
      ADD
    </span>
  </div>
</div>

                </button>
              ))}
            </div>
          </section>

          {/* CART */}
          <section className="w-full lg:w-[400px] bg-white rounded-2xl shadow-xl p-4 flex flex-col">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Current Order</h2>
              <button
                onClick={clearCart}
                className="text-sm text-red-500"
                disabled={cart.length === 0}
              >
                Clear
              </button>
            </div>

            <div className="flex-1 overflow-auto border rounded-xl mb-4">
              {cart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400">
                  No items added
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 border-b"
                  >
                    <div>
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-sm text-slate-500">
                        ₹{item.price} × {item.qty}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-2 border rounded"
                      >
                        −
                      </button>
                      <span className="font-bold">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-2 border rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {(["CASH", "UPI", "CARD"] as const).map((pm) => (
                <button
                  key={pm}
                  onClick={() => setPaymentMethod(pm)}
                  className={`py-2 rounded-xl font-bold ${
                    paymentMethod === pm
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100"
                  }`}
                >
                  {pm}
                </button>
              ))}
            </div>

            <button
              onClick={handleSaveAndPrint}
              disabled={cart.length === 0}
              className="bg-slate-900 text-white py-4 rounded-2xl font-bold disabled:bg-slate-300"
            >
              Save & Print Bill
            </button>
          </section>
        </div>
      </div>
      {/* Print Receipt - Optimized for 58mm thermal */}       
      {showReceipt && lastOrder && (         
        <div className="print-only text-lg sm:text-lg p-2 w-[58mm] max-w-[58mm] mx-auto">
          <div className="text-center mb-2 pb-1">
            <div className="font-black text-lg tracking-tight">S.A.R Food House</div>
             <div className="text-base">Kotapalli Circle, opp: TVS Showroom, Piler</div>
              <div className="text-base mt-1">Phone: 9398525322,9398969430</div>
               <div className="text-xs mt-1 border-t border-dashed pt-1">
                 Bill: {lastOrder.id.slice(-6)} | {new Date(lastOrder.createdAt).toLocaleString('en-IN')}
                  </div>
                   <div className="text-xs font-medium">PMT: {lastOrder.paymentMethod}</div>
                   </div>
                     <div className="border-t border-dashed my-1" />
                       {lastOrder.items.map((item) => (            
                         <div key={item.id} className="flex justify-between text-lg my-1 ">               
                         <span className="truncate flex-1">{item.name} × {item.qty}</span>              
                          <span className="w-16 text-right font-medium">₹{item.price * item.qty}</span>             
                          </div>           ))}           
                          <div className="border-t border-dashed my-1 pt-1" />           
                          <div className="flex justify-between font-bold text-lg mb-2">             
                            <span>Total</span>             
                            <span>₹{lastOrder.total.toFixed(0)}</span>           
                            </div>
                            <div className="text-center text-xs font-medium text-slate-600 pb-2">
                              Thank you! Visit again.          
                              </div>         
                              </div>
                              )}
    </>
  );
}
