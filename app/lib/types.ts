// Add this to your existing types.ts
export type Category = "Shawarma" | "Puri"| "Pav Bhaji" | "Fries & Sandwich" | "Chaats" | "Juice" | "Ice Cream" | "Vada Pav" ;

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: Category; // required, not optional
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
}
