export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  fabric: string;
  fit: string;
  description: string;
  sizes: number[];
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  selectedSize: number;
  quantity: number;
}

export interface Order {
  id?: number;
  user_id?: number;
  customer_name: string;
  phone: string;
  address: string;
  total_amount: number;
  items: CartItem[];
  status?: string;
  created_at?: string;
}
