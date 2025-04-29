export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string;
  subcategory?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  stockQuantity: number;
  seller: {
    name: string;
    id: string;
  };
  affiliateLink: string;
  affiliateCommission?: number;
  featured?: boolean;
  bestseller?: boolean;
  new?: boolean;
}