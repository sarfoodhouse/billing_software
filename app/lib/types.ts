// lib/types.ts

export type Category =
  | "Shawarma"
  | "Puri"
  | "Pav Bhaji"
  | "Fries & Sandwich"
  | "Chaats"
  | "Juice"
  | "Ice Cream"
  | "Vada Pav"
  | "Water"
  | "Biryani"
  | "Grill Chicken"
  | "Haleem"
  | "Fried Chicken"
  | "Burgers"
  | "Chicken Roll"
  | "Snack Attack"
  | "Pizza"
  | "Starters"
  | "Fried Rice"
  | "Noodles"
  | "Veg Curries"
  | "Non-Veg Curries"
  | "Tandoori"
  | "Breads"
  | "Rice & Others"
  | "Crispy"
  | "Chicken Sandwich"
  | "Veg Sandwich";

export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: Category; 
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
  subtotal: number;       // Now recognized
  total: number;
  paymentMethod: "CASH" | "UPI" | "CARD";
  tableNumber?: string | null;
  isParcel?: boolean;
  customerName: string;   // Added to match your page code
  parcelCharge: number;   // Added to match your page code
}
