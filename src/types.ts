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
  category: string;
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
  payment_method?: string;
  transaction_id?: string;
  created_at?: string;
}

export interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  link: string;
  created_at: string;
}

export interface Coupon {
  id: number;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_purchase: number;
  expiry_date: string;
  is_active: number;
  created_at: string;
}

export interface Review {
  id: number;
  product_id: number;
  user_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}
