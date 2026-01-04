import type { Order } from "./types";

const KEY = "sar_orders";

export function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Order[];
  } catch {
    // if data is corrupted, reset it
    window.localStorage.removeItem(KEY);
    return [];
  }
}

export function saveOrder(order: Order) {
  if (typeof window === "undefined") return;
  const existing = loadOrders();
  existing.push(order);
  window.localStorage.setItem(KEY, JSON.stringify(existing));
}
