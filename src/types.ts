export interface Product {
  id: string;
  name: string;
  category: string; // 'cleanser' | 'serum' | 'cream' | 'exfoliant' | 'mask'
  skinConcern: string[]; // 'Dry Skin' | 'Oily Skin' | 'Acne-Prone' | 'Sensitive Skin' | 'Anti-Aging'
  ingredients: string[];
  fullIngredients: string;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  description: string;
  benefits: string[];
  usage: string;
  image: string;
  images?: string[];
  reviews?: Review[];
  tag?: string; // 'Bestseller' | 'New' | 'Tested'
  metaTitle?: string;
  metaDescription?: string;
  seoUrl?: string;
}

export interface Review {
  id: string;
  productId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

export interface Article {
  id: string;
  title: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  image: string;
  author: string;
  readTime: string;
  keyTakeaways?: string[];
  relatedProductIds?: string[];
  metaTitle?: string;
  metaDescription?: string;
  seoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    email: string;
    phone?: string;
    address: string;
    city: string;
    zipCode: string;
  };
  paymentMethod: string;
}

export interface QuizAnswers {
  skinType: string;
  concern: string;
  sensitivity: string;
  ageGroup: string;
  budget: string;
}

export interface QuizRecommendation {
  routine: {
    step: number;
    type: string;
    productId: string;
    productName: string;
    instructions: string;
  }[];
  explanation: string;
  tips: string[];
}

export interface DBState {
  products: Product[];
  articles: Article[];
  orders: Order[];
  promoBanner: {
    text: string;
    visible: boolean;
  };
}
