
export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  image?: string | null;
  is_digital?: boolean | null;
  digital?: boolean;
  usarProcessamentoPersonalizado?: boolean; 
  statusCartaoManual?: string;
  created_at?: string | null;
  updated_at?: string | null;
}
