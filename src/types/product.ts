
export interface Product {
  id: number | string;
  name: string;
  slug: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  is_digital?: boolean | null;
  custom_manual_status?: string | null;
  override_global_status?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_digital: boolean;
  override_global_status?: boolean;
  custom_manual_status?: string;
}
