import { Product } from "./types";

export const products: Product[] = [
  // Shawarma items
  { id: "sh1", name: "Classic Shawarma", price: 79, category: "Shawarma" },
  { id: "sh2", name: "Special Shawarma", price: 99, category: "Shawarma" },
  { id: "sh3", name: "Peri Peri Shawarma", price: 120, category: "Shawarma" },
  { id: "sh4", name: "Lebanese Shawarma", price: 140, category: "Shawarma" },
  { id: "sh5", name: "Turkish Shawarma", price: 150, category: "Shawarma" },
  { id: "sh6", name: "King Size Shawarma", price: 170, category: "Shawarma" },
  { id: "sh7", name: "S.A.R Shawarma", price: 180, category: "Shawarma" },
  { id: "sh8", name: "Classic Platter Shawarma", price: 120, category: "Shawarma" },
  { id: "sh9", name: "Special Platter Shawarma", price: 150, category: "Shawarma" },
  { id: "sh10", name: "S.A.R Platter Shawarma", price: 180, category: "Shawarma" },

  // Fries
  { id: "FF1", name: "Classic Fries", price: 50, category: "Fries & Sandwich" },
  { id: "FF2", name: "Peri Peri Fries", price: 60, category: "Fries & Sandwich" },
  { id: "FF3", name: "Cheese Fries", price: 80, category: "Fries & Sandwich" },
  { id: "FF4", name: "Special Chicken Fries", price: 99, category: "Fries & Sandwich" },

  //Sandwhich
  { id: "FF5", name: "Veg Sandwich", price: 60, category: "Fries & Sandwich" },
  { id: "FF6", name: "Cheese Sandwich", price: 80, category: "Fries & Sandwich" },
  { id: "FF7", name: "Butter Sandwich", price: 80, category: "Fries & Sandwich" },
  { id: "FF8", name: "Panner Sandwich", price: 80, category: "Fries & Sandwich" },

  //Pav Bhaji
  { id: "pb1", name: "Classic Pav Bhaji", price: 50, category: "Pav Bhaji" },
  { id: "pb2", name: "Masala Pav Bhaji", price: 60, category: "Pav Bhaji" },
  { id: "pb3", name: "Butter Pav Bhaji", price: 70, category: "Pav Bhaji" },
  { id: "pb4", name: "Panner Pav Bhaji", price: 80, category: "Pav Bhaji" },
  { id: "pb5", name: "Cheese Pav Bhaji", price: 80, category: "Pav Bhaji" },
  { id: "pb6", name: "Extra Pav ", price: 10, category: "Pav Bhaji" },

  //Vada Pav
  { id: "vp1", name: "Single Vada Pav", price: 30, category: "Vada Pav" },
  { id: "vp2", name: "Plate Vada Pav", price: 50, category: "Vada Pav" },

  //Puri
  { id: "Pi1", name: "Pani Puri", price: 20, category: "Puri" },
  { id: "Pi2", name: "Masala Puri", price: 30, category: "Puri" },
  { id: "Pi3", name: "Sweet Puri", price: 30, category: "Puri" },
  { id: "Pi4", name: "Dahi Puri", price: 40, category: "Puri" },
  { id: "Pi5", name: "Bhel Puri", price: 40, category: "Puri" },
  { id: "Pi6", name: "Sev Puri", price: 40, category: "Puri" },
  { id: "Pi7", name: "Dahi Samosa", price: 40, category: "Puri" },
  { id: "Pi8", name: "Dahi Papadi", price: 40, category: "Puri" },
  { id: "Pi9", name: "Dahi Kachori", price: 50, category: "Puri" },

  // Chaats items
  { id: "ch1", name: "Samosa Chaat", price: 40, category: "Chaats" },
  { id: "ch2", name: "Aloo Chaat", price: 40, category: "Chaats" },
  { id: "ch3", name: "Papdi Chaat", price: 40, category: "Chaats" },
  { id: "ch4", name: "Gobi Chaat", price: 40, category: "Chaats" },
  { id: "ch5", name: "Kachori Chaat", price: 50, category: "Chaats" },
  { id: "ch6", name: "Mix Veg Chaat", price: 50, category: "Chaats" },
  { id: "ch7", name: "Mushroom Chaat", price: 80, category: "Chaats" },
  { id: "ch8", name: "Kaju Chaat", price: 80, category: "Chaats" },
  { id: "ch9", name: "Panner Chaat", price: 80, category: "Chaats" },
  { id: "ch10", name: "S.A.R Special", price: 60, category: "Chaats" },



  // Juice items
  { id: "j1", name: "Pineapple Fresh", price: 40, category: "Juice" },
  { id: "j2", name: "Mosambi Fresh", price: 40, category: "Juice" },
  { id: "j3", name: "Water Melon Fresh", price: 40, category: "Juice" },
  { id: "j4", name: "Papya Fresh", price: 50, category: "Juice" },
  { id: "j5", name: "Orange Fresh", price: 50, category: "Juice" },
  { id: "j6", name: "Guava Fresh", price: 50, category: "Juice" },
  { id: "j7", name: "Graps Fresh", price: 60, category: "Juice" },
  { id: "j8", name: "Pomegranate Fresh", price: 60, category: "Juice" },
  { id: "j9", name: "Mix Fruit Fresh", price: 70, category: "Juice" },
  { id: "j10", name: "S.A.R Special Fresh", price: 60, category: "Juice" },
  { id: "j11", name: "Lime Moktail", price: 50, category: "Juice" },
  { id: "j12", name: "BlackCurrant Moktail", price: 50, category: "Juice" },
  { id: "j13", name: "BlueBerry Moktail", price: 50, category: "Juice" },
  { id: "j14", name: "Strawberry Moktail", price: 50, category: "Juice" },
  { id: "j15", name: "Mango Moktail", price: 50, category: "Juice" },
  { id: "j16", name: "Orange Moktail", price: 50, category: "Juice" },
  { id: "j17", name: "Muskmelon MS", price: 50, category: "Juice" },
  { id: "j18", name: "Banana MilkShake", price: 50, category: "Juice" },
  { id: "j19", name: "Mango MilkShake", price: 50, category: "Juice" },
  { id: "j20", name: "Strawberry MS", price: 60, category: "Juice" },
  { id: "j21", name: "Kiwi MilkShake", price: 80, category: "Juice" },
  { id: "j22", name: "Custard Apple MS", price: 80, category: "Juice" },
  { id: "j23", name: "Avacoda Milk Shake", price: 80, category: "Juice" },
  { id: "j24", name: "Dragon MilkShake", price: 80, category: "Juice" },
  { id: "j25", name: "Oreo MilkShake", price: 80, category: "Juice" },
  { id: "j26", name: "Kit Kat Milkshake", price: 90, category: "Juice" },
  { id: "j27", name: "Badam Milkshake", price: 100, category: "Juice" },
  { id: "j28", name: "Butterscotch MS", price: 100, category: "Juice" },
  { id: "j29", name: "Anjeer Badam MS", price: 120, category: "Juice" },
  { id: "j30", name: "Dry Fruits Milkshake", price: 140, category: "Juice" },
  { id: "j31", name: "Spical Lassi", price: 50, category: "Juice" },
  { id: "j32", name: "Rose Milk", price: 50, category: "Juice" },
  { id: "j33", name: "Fruit Salad", price: 60, category: "Juice" },
  { id: "j34", name: "Faluda", price: 60, category: "Juice" },
  { id: "j35", name: "Mango Lassi", price: 60, category: "Juice" },
  { id: "j36", name: "ABC", price: 80, category: "Juice" },
  { id: "j37", name: "Beetroot", price: 50, category: "Juice" },
  { id: "j38", name: "Carrot", price: 50, category: "Juice" },


  // Ice Cream items
{ id: "ic1", name: "Vanilla", price: 50, category: "Ice Cream" },
{ id: "ic2", name: "Strawberry", price: 50, category: "Ice Cream" },
{ id: "ic3", name: "Pista", price: 50, category: "Ice Cream" },
{ id: "ic4", name: "Butterscotch", price: 50, category: "Ice Cream" },
{ id: "ic5", name: "Orange", price: 50, category: "Ice Cream" },
{ id: "ic6", name: "Chocolate", price: 50, category: "Ice Cream" },
{ id: "ic7", name: "Vanilla Strawberry", price: 50, category: "Ice Cream" },
{ id: "ic8", name: "Vanilla Chocolate", price: 50, category: "Ice Cream" },
{ id: "ic9", name: "Coffee", price: 60, category: "Ice Cream" },
{ id: "ic10", name: "Alphonso Mango", price: 60, category: "Ice Cream" },
{ id: "ic11", name: "Spanish Delight", price: 60, category: "Ice Cream" },
{ id: "ic12", name: "Black Currant", price: 60, category: "Ice Cream" },
{ id: "ic13", name: "Kesar Badam Pista", price: 60, category: "Ice Cream" },
{ id: "ic14", name: "Kulfi", price: 60, category: "Ice Cream" },
{ id: "ic15", name: "Pineapple", price: 60, category: "Ice Cream" },
{ id: "ic16", name: "Fig & Honey", price: 70, category: "Ice Cream" },

// Newly added flavors
{ id: "ic17", name: "Chikoo", price: 70, category: "Ice Cream" },
{ id: "ic18", name: "Passion Fruit", price: 70, category: "Ice Cream" },
{ id: "ic19", name: "Sitaphal", price: 70, category: "Ice Cream" },
{ id: "ic20", name: "Tender Coconut", price: 70, category: "Ice Cream" },
{ id: "ic21", name: "Blueberry", price: 70, category: "Ice Cream" },
{ id: "ic22", name: "Jackfruit", price: 70, category: "Ice Cream" },
{ id: "ic23", name: "Avocado", price: 70, category: "Ice Cream" },
{ id: "ic24", name: "Red Velvet", price: 70, category: "Ice Cream" },
{ id: "ic25", name: "Cheese Strawberry", price: 120, category: "Ice Cream" },
{ id: "ic26", name: "Lots of Nuts", price: 150, category: "Ice Cream" },
{ id: "ic27", name: "Extra Toppings", price: 10, category: "Ice Cream" },

  // Water Bottol
{ id: "bw1", name: "Water", price: 20, category: "Water" },

  //Biryani
  { id: "by1", name: "Hyd chicken dumbiryani", price: 120, category: "Biryani" },
  { id: "by2", name: "Hyd Kuska Rice", price: 70, category: "Biryani" },

];
