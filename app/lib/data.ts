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
{ id: "bw1", name: "Water 1liter", price: 20, category: "Water" },
{ id: "bw2", name: "Water 500ml", price: 10, category: "Water" },

  //Biryani
  { id: "by1", name: "Hyd chicken dumbiryani", price: 120, category: "Biryani" },
  { id: "by2", name: "Hyd Kuska Rice", price: 80, category: "Biryani" },

  //Grill Chicken
  { id: "gc1", name: "Grill Chicken Full", price: 400, category: "Grill Chicken" },
  { id: "gc2", name: "Grill Chicken Half", price: 230, category: "Grill Chicken" },

  //Haleem
  { id: "hl1", name: "Mutton Haleem Large ", price: 350, category: "Haleem" },
  { id: "hl2", name: "Mutton Haleem Medium", price: 180, category: "Haleem" },
  { id: "hl3", name: "Mutton Haleem Small", price: 100, category: "Haleem" },
  { id: "hl4", name: "Chicken Haleem Large ", price: 250, category: "Haleem" },
  { id: "hl5", name: "chicken Haleem Medium", price: 130, category: "Haleem" },
  { id: "hl6", name: "chicken Haleem Small", price: 80, category: "Haleem" },

  //Fried Chicken
  { id: "fc1", name: "Classic Chicken", price: 75, category: "Fried Chicken" },
  { id: "fc2", name: "Thai Cruspy Mini", price: 285, category: "Fried Chicken" },
  { id: "fc3", name: "Thai Cruspy Big", price: 565, category: "Fried Chicken" },
  { id: "fc4", name: "Cruspy Masala Mini", price: 285, category: "Fried Chicken" },
  { id: "fc5", name: "Cruspy Masala Big", price: 565, category: "Fried Chicken" },
  { id: "fc6", name: "Chilli Burst Mini", price: 285, category: "Fried Chicken" },
  { id: "fc7", name: "Chilli Burst Big", price: 565, category: "Fried Chicken" },

  //Burgers
  { id: "bs1", name: "Star Burgers", price: 75, category: "Burgers" },
  { id: "bs2", name: "Classic Burgers", price: 85, category: "Burgers" },
  { id: "bs3", name: "Tandoori Burgers", price: 110, category: "Burgers" },
  { id: "bs4", name: "Hot Crispy Burgers", price: 120, category: "Burgers" },
  { id: "bs5", name: "Veg Burgers", price: 65, category: "Burgers" },
  { id: "bs6", name: "Panner Delight Burgers", price: 89, category: "Burgers" },

  //Chicken Roll
  { id: "cr1", name: "Chicken Roll", price: 85, category: "Chicken Roll" },
  { id: "cr2", name: "Tandoori Roll", price: 95, category: "Chicken Roll" },
  { id: "cr3", name: "Veg Roll", price: 75, category: "Chicken Roll" },
  { id: "cr4", name: "Crispy Roll", price: 110, category: "Chicken Roll" },
  { id: "cr5", name: "Panner Roll", price: 89, category: "Chicken Roll" },
  
   //Snack Attack
  { id: "s1", name: "Masala Fries Reg", price: 65, category: "Snack Attack" },
  { id: "s2", name: "Masala Fries Lag", price: 95, category: "Snack Attack" },
  { id: "s3", name: "Cheese Fries Reg", price: 75, category: "Snack Attack" },
  { id: "s4", name: "Cheese Fries Lag", price: 110, category: "Snack Attack" },
  { id: "s5", name: "Classic Fries Reg", price: 50, category: "Snack Attack" },
  { id: "s6", name: "Classic Fries Lag", price: 85, category: "Snack Attack" },
  { id: "s7", name: "Chicken Overloaded Fries Reg", price: 75, category: "Snack Attack" },
  { id: "s8", name: "Chicken Overloaded Fries Lag", price: 90, category: "Snack Attack" },
  { id: "s9", name: "Nuggets Reg", price: 75, category: "Snack Attack" },
  { id: "s10", name: "Nuggets Lag", price: 85, category: "Snack Attack" },
  { id: "s11", name: "Fingers Reg", price: 40, category: "Snack Attack" },
  { id: "s12", name: "Fingers Lag", price: 75, category: "Snack Attack" },
  { id: "s13", name: "Popcorn Reg", price: 70, category: "Snack Attack" },
  { id: "s14", name: "Popcorn Lag", price: 120, category: "Snack Attack" },
  { id: "s15", name: "Chicken cheese shot Reg", price: 80, category: "Snack Attack" },
  { id: "s16", name: "Chicken cheese shot Lag", price: 130, category: "Snack Attack" },
  { id: "s17", name: "Peri Peri Chwins Reg", price: 99, category: "Snack Attack" },
  { id: "s18", name: "Strips Reg", price: 95, category: "Snack Attack" },
  { id: "s19", name: "Strips Lag", price: 155, category: "Snack Attack" },
  { id: "s20", name: "Crispy Moms Reg", price: 60, category: "Snack Attack" },
  { id: "s21", name: "Veg Momos", price: 49, category: "Snack Attack" },
  { id: "s22", name: "Veg Fingers", price: 49, category: "Snack Attack" },

  //Pizza 
  { id: "p1", name: "Classic Chicken Pizza", price: 250, category: "Pizza" },
  { id: "p2", name: "BBQ Pizza", price: 270, category: "Pizza" },
  { id: "p3", name: "Tandori Pizza", price: 270, category: "Pizza" },
  { id: "p4", name: "Perri Pizza", price: 250, category: "Pizza" },
  { id: "p5", name: "Chicken Pizza Cheese Blast", price: 320, category: "Pizza" },
  { id: "p6", name: "Corn Pizza", price: 200, category: "Pizza" },
  { id: "p7", name: "Cheese Brust Pizza", price: 270, category: "Pizza" },
  { id: "p8", name: "Paneer Pizza", price: 230, category: "Pizza" },
  { id: "p9", name: "Spl. Veggi Pizza", price: 180, category: "Pizza" },
  { id: "p10", name: "Mushroom Pizza", price: 200, category: "Pizza" },
  { id: "p11", name: "Veg Cheese Burst Pizza", price: 290, category: "Pizza" },

    // STARTERS
  { id: "STR1", name: "Veg Manchurian", price: 80, category: "Starters" },
  { id: "STR2", name: "Mushroom Manchurian", price: 80, category: "Starters" },
  { id: "STR3", name: "Chicken Pakoda", price: 90, category: "Starters" },
  { id: "STR4", name: "Chilli Gobi", price: 100, category: "Starters" },
  { id: "STR5", name: "Chilli Mushroom", price: 100, category: "Starters" },
  { id: "STR6", name: "Gobi Manchurian", price: 110, category: "Starters" },
  { id: "STR7", name: "Pepper Chicken", price: 120, category: "Starters" },
  { id: "STR8", name: "Chilli Chicken", price: 120, category: "Starters" },
  { id: "STR9", name: "Chicken 65", price: 120, category: "Starters" },
  { id: "STR10", name: "Chilli Paneer", price: 120, category: "Starters" },
  { id: "STR11", name: "Chicken Manchurian", price: 130, category: "Starters" },
  { id: "STR12", name: "Paneer Manchurian", price: 140, category: "Starters" },
  { id: "STR13", name: "Dry Chicken Lollipop (4 pcs)", price: 150, category: "Starters" },
  { id: "STR14", name: "Dragon Chicken", price: 170, category: "Starters" },
  { id: "STR15", name: "Juicy Chicken Lollipop (4 pcs)", price: 170, category: "Starters" },

  // BIRYANI
  { id: "BRY1", name: "Veg Biryani", price: 80, category: "Biryani" },
  { id: "BRY2", name: "Mix Veg Biryani", price: 90, category: "Biryani" },
  { id: "BRY3", name: "Mushroom Biryani", price: 120, category: "Biryani" },
  { id: "BRY4", name: "Paneer Biryani", price: 120, category: "Biryani" },
  { id: "BRY5", name: "Chicken Dum Biryani", price: 120, category: "Biryani" },
  { id: "BRY6", name: "Fry Piece Chicken Biryani", price: 140, category: "Biryani" },
  { id: "BRY7", name: "Chicken Lollipop Biryani", price: 150, category: "Biryani" },
  { id: "BRY8", name: "Chicken Tikka Biryani", price: 170, category: "Biryani" },
  { id: "BRY9", name: "Chicken Kalmi Biryani", price: 190, category: "Biryani" },
  { id: "BRY10", name: "Chicken Tandoori Biryani", price: 190, category: "Biryani" },
  { id: "BRY11", name: "S.A.R Special Biryani", price: 200, category: "Biryani" },

  // FRIED RICE
  { id: "FRD1", name: "Veg Fried Rice", price: 70, category: "Fried Rice" },
  { id: "FRD2", name: "Gobi Fried Rice", price: 80, category: "Fried Rice" },
  { id: "FRD3", name: "Egg Fried Rice", price: 80, category: "Fried Rice" },
  { id: "FRD4", name: "Mushroom Fried Rice", price: 100, category: "Fried Rice" },
  { id: "FRD5", name: "Paneer Fried Rice", price: 120, category: "Fried Rice" },
  { id: "FRD6", name: "Chicken Fried Rice", price: 120, category: "Fried Rice" },
  { id: "FRD7", name: "Schezwan Chicken Fried Rice", price: 130, category: "Fried Rice" },

  // NOODLES
  { id: "NOD1", name: "Veg Noodles", price: 70, category: "Noodles" },
  { id: "NOD2", name: "Egg Noodles", price: 80, category: "Noodles" },
  { id: "NOD3", name: "Gobi Noodles", price: 80, category: "Noodles" },
  { id: "NOD4", name: "Schezwan Noodles", price: 80, category: "Noodles" },
  { id: "NOD5", name: "Schezwan Veg Noodles", price: 80, category: "Noodles" },
  { id: "NOD6", name: "Chicken Noodles", price: 100, category: "Noodles" },
  { id: "NOD7", name: "Schezwan Chicken Noodles", price: 110, category: "Noodles" },

  // VEG CURRIES
  { id: "VCR1", name: "Veg Curry", price: 80, category: "Veg Curries" },
  { id: "VCR2", name: "Mix Veg Curry", price: 90, category: "Veg Curries" },
  { id: "VCR3", name: "Paneer Curry", price: 100, category: "Veg Curries" },
  { id: "VCR4", name: "Mushroom Curry", price: 100, category: "Veg Curries" },
  { id: "VCR5", name: "Mushroom Butter Masala", price: 120, category: "Veg Curries" },
  { id: "VCR6", name: "Paneer Butter Masala", price: 130, category: "Veg Curries" },
  { id: "VCR7", name: "Paneer Lababdar", price: 130, category: "Veg Curries" },
  { id: "VCR8", name: "Paneer Pyaza", price: 140, category: "Veg Curries" },

  // NON-VEG CURRIES
  { id: "NVC1", name: "Chicken Curry", price: 120, category: "Non-Veg Curries" },
  { id: "NVC2", name: "Chicken Tandoori Curry", price: 140, category: "Non-Veg Curries" },
  { id: "NVC3", name: "Butter Chicken", price: 140, category: "Non-Veg Curries" },
  { id: "NVC4", name: "Chicken Tikka Curry", price: 150, category: "Non-Veg Curries" },
  { id: "NVC5", name: "Punjabi Chicken Curry", price: 150, category: "Non-Veg Curries" },
  { id: "NVC6", name: "Tandoori Chicken Curry", price: 160, category: "Non-Veg Curries" },
  { id: "NVC7", name: "Fish Curry", price: 180, category: "Non-Veg Curries" },
  { id: "NVC8", name: "Prawns Fry", price: 200, category: "Non-Veg Curries" },
  { id: "NVC9", name: "Mutton Curry", price: 250, category: "Non-Veg Curries" },

  // TANDOORI
  { id: "TND1", name: "Chicken Tikka (5 pcs)", price: 120, category: "Tandoori" },
  { id: "TND2", name: "Kalmi Kebab (4 pcs)", price: 120, category: "Tandoori" },
  { id: "TND3", name: "Half Tandoori Chicken (2 pcs)", price: 140, category: "Tandoori" },
  { id: "TND4", name: "Paneer Tikka", price: 140, category: "Tandoori" },
  { id: "TND5", name: "Full Tandoori Chicken (4 pcs)", price: 180, category: "Tandoori" },

  // BREADS
  { id: "BRD1", name: "Plain Naan", price: 20, category: "Breads" },
  { id: "BRD2", name: "Butter Naan", price: 25, category: "Breads" },
  { id: "BRD3", name: "Plain Roti", price: 20, category: "Breads" },
  { id: "BRD4", name: "Butter Roti", price: 25, category: "Breads" },
  { id: "BRD5", name: "Rumali Roti", price: 25, category: "Breads" },

  // OTHER
  { id: "OTH1", name: "Curd Rice", price: 100, category: "Rice & Others" },

    // CRISPY
  { id: "CRS1", name: "Chicken Lollipop (4 pcs)", price: 110, category: "Crispy" },
  { id: "CRS2", name: "Chicken Lollipop (10 pcs)", price: 110, category: "Crispy" },
  { id: "CRS3", name: "Hot Wings (4 pcs)", price: 250, category: "Crispy" },
  { id: "CRS4", name: "Hot Wings (10 pcs)", price: 250, category: "Crispy" },
  { id: "CRS5", name: "Hot Wings & Lollipop Bucket (20 pcs)", price: 500, category: "Crispy" },

  // CHICKEN SANDWICH
  { id: "SCN1", name: "BBQ Chicken Sandwich", price: 130, category: "Chicken Sandwich" },
  { id: "SCN2", name: "Peri Peri Chicken Sandwich", price: 100, category: "Chicken Sandwich" },
  { id: "SCN3", name: "Classic Chicken Sandwich", price: 100, category: "Chicken Sandwich" },
  { id: "SCN4", name: "Special Double Dose Chicken Sandwich", price: 150, category: "Chicken Sandwich" },

  // VEG SANDWICH
  { id: "SVG1", name: "Italian Sweet Corn Sandwich", price: 90, category: "Veg Sandwich" },
  { id: "SVG2", name: "BBQ Paneer Sandwich", price: 90, category: "Veg Sandwich" },
  { id: "SVG3", name: "Cheese Corn Sandwich", price: 90, category: "Veg Sandwich" },
  { id: "SVG4", name: "Tandoori Paneer Sandwich", price: 110, category: "Veg Sandwich" },

  
  
  
];
