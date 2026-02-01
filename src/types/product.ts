export interface Product {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  price: number;
  image: string | null;
  user_id: string;
  created_at: string;
}
