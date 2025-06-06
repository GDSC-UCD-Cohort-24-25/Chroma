import { Plane, Laptop, Utensils, Home, Lightbulb, Shirt, Heart, BookOpen, PiggyBank, Car, Coffee, DollarSign, Gift, ShoppingBag, } from 'lucide-react';

export const iconMap: { [key: string]: React.ReactNode } = {
  'Food': <Utensils className="w-6 h-6" />,
  'Transportation': <Car className="w-6 h-6" />,
  'Entertainment': <Home className="w-6 h-6" />, // use proper icon
  'Utilities': <Lightbulb className="w-6 h-6" />,
  'Rent': <Home className="w-6 h-6" />,
  'Groceries': <Utensils className="w-6 h-6" />,
  'Clothing': <Shirt className="w-6 h-6" />,
  'Health': <Heart className="w-6 h-6" />,
  'Education': <BookOpen className="w-6 h-6" />,
  'Savings': <PiggyBank className="w-6 h-6" />,
  'Electronics': <Laptop className="w-6 h-6" />,
  'Travel': <Plane className="w-6 h-6" />,
  'Shopping': <ShoppingBag className="w-6 h-6" />,
  'Coffee': <Coffee className="w-6 h-6" />,
  'Gifts': <Gift className="w-6 h-6" />,
  'Investments': <DollarSign className="w-6 h-6" />,
  
};
export const colors = [
  '#8FB6B0', // soft teal
  '#F3DFA1', // warm pastel yellow
  '#EEAB8C', // light coral / peach
  '#C18BC1', // muted lavender
  '#A5A1E3', // soft periwinkle
  '#FFC9DE', // blush pink
  '#F9B57E', // apricot
  '#B5EAD7', // mint
  '#FFD6A5', // pastel orange
  '#D4A5A5', // dusty rose
  '#F5CBA7', // light sand
  '#C3B1E1', // soft lilac
  '#F7E3AF', // creamy yellow
  '#E8A9C9', // pastel magenta
  '#B0D6E8', // light sky blue
  '#F4BFBF'  // soft pink
];
