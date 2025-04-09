
export interface Product {
  id: number | string;
  name: string;
  nome?: string; // Legacy compatibility
  slug: string;
  description?: string | null;
  descricao?: string | null; // Legacy compatibility
  price: number;
  preco?: number; // Legacy compatibility
  image_url?: string | null;
  urlImagem?: string | null; // Legacy compatibility
  image?: string | null;
  is_digital?: boolean | null;
  digital?: boolean; // Legacy compatibility
  override_global_status?: boolean | null;
  usarProcessamentoPersonalizado?: boolean; // Legacy compatibility
  custom_manual_status?: string | null;
  statusCartaoManual?: string; // Legacy compatibility
  created_at?: string | null;
  updated_at?: string | null;
}

export interface CriarProdutoInput {
  nome: string;
  descricao?: string;
  preco: number;
  urlImagem?: string;
  digital: boolean;
  usarProcessamentoPersonalizado?: boolean;
  statusCartaoManual?: string;
}
