"use client";

import React, { useState, useEffect } from "react";

// 1. Define the Structure (Interface)
interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export default function MenuDatabasePage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", category: "" });
  const [message, setMessage] = useState("");

  // Load Menu on start
  useEffect(() => {
    const savedMenu = localStorage.getItem("sar_menu");
    if (savedMenu) {
      setMenu(JSON.parse(savedMenu));
    }
  }, []);

  // Save to LocalStorage
  const saveMenu = (updatedMenu: MenuItem[]) => {
    setMenu(updatedMenu);
    localStorage.setItem("sar_menu", JSON.stringify(updatedMenu));
    setMessage("Saved!");
    setTimeout(() => setMessage(""), 2000);
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price || !newItem.category) return;

    const item: MenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      price: parseFloat(newItem.price),
      category: newItem.category.toUpperCase(),
    };

    saveMenu([...menu, item]);
    setNewItem({ name: "", price: "", category: "" });
  };

  const deleteItem = (id: string) => {
    if (confirm("Delete this item?")) {
      saveMenu(menu.filter((i) => i.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof MenuItem, value: string) => {
    const updated = menu.map((item) => {
      if (item.id === id) {
        return { 
          ...item, 
          [field]: field === "price" ? (parseFloat(value) || 0) : value 
        };
      }
      return item;
    });
    saveMenu(updated);
  };

  // Get unique categories
  const categories = Array.from(new Set(menu.map((i) => i.category)));

  return (
    <div className="min-h-screen w-full bg-slate-50 p-4 pb-24 font-sans text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black uppercase tracking-tighter">Menu Database</h1>
          {message && <span className="rounded-full bg-emerald-100 px-4 py-1 text-[10px] font-bold text-emerald-600">{message}</span>}
        </div>

        {/* ADD ITEM FORM */}
        <form onSubmit={addItem} className="grid grid-cols-1 gap-4 rounded-[2rem] bg-slate-900 p-6 shadow-xl md:grid-cols-4">
          <div>
            <label className="ml-1 text-[10px] font-bold uppercase text-slate-500">Category</label>
            <input 
              value={newItem.category}
              onChange={(e) => setNewItem({...newItem, category: e.target.value})}
              placeholder="e.g. SHAWARMA"
              className="mt-1 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="ml-1 text-[10px] font-bold uppercase text-slate-500">Item Name</label>
            <input 
              value={newItem.name}
              onChange={(e) => setNewItem({...newItem, name: e.target.value})}
              placeholder="e.g. Special Roll"
              className="mt-1 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="ml-1 text-[10px] font-bold uppercase text-slate-500">Price (₹)</label>
            <input 
              type="number"
              value={newItem.price}
              onChange={(e) => setNewItem({...newItem, price: e.target.value})}
              placeholder="0.00"
              className="mt-1 w-full rounded-xl bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button type="submit" className="h-[46px] rounded-xl bg-blue-600 text-xs font-black uppercase text-white hover:bg-blue-500 transition-all">
            Add Item
          </button>
        </form>

        {/* LIST VIEW */}
        <div className="space-y-6">
          {categories.length === 0 && (
            <div className="rounded-[2rem] border-2 border-dashed border-slate-200 py-20 text-center text-xs font-bold uppercase text-slate-400">
              Your menu is empty. Add items above.
            </div>
          )}

          {categories.map((cat) => (
            <div key={cat} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-3">
                <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{cat}</h2>
              </div>
              <div className="divide-y divide-slate-50">
                {menu.filter((i) => i.category === cat).map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4 transition-all hover:bg-slate-50">
                    <input 
                      value={item.name}
                      onChange={(e) => updateItem(item.id, "name", e.target.value)}
                      className="w-1/2 bg-transparent text-sm font-bold text-slate-700 outline-none focus:underline"
                    />
                    
                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg bg-slate-100 px-3 py-1">
                        <span className="mr-1 text-xs font-bold text-slate-400">₹</span>
                        <input 
                          type="number"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", e.target.value)}
                          className="w-16 bg-transparent text-sm font-black text-slate-900 outline-none"
                        />
                      </div>
                      
                      <button 
                        onClick={() => deleteItem(item.id)}
                        className="rounded-lg bg-red-50 px-3 py-1 text-[10px] font-bold uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}