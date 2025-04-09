
export interface Product {
  id: number | string;
  name: string;
  nome: string; // Compatibilidade com código legado
  slug: string;
  description?: string | null;
  descricao?: string | null; // Compatibilidade com código legado
  price: number;
  preco: number; // Compatibilidade com código legado
  image_url?: string | null;
  urlImagem?: string | null; // Compatibilidade com código legado
  is_digital?: boolean | null;
  digital?: boolean | null; // Compatibilidade com código legado
  custom_manual_status?: string | null;
  statusCartaoManual?: string | null; // Compatibilidade com código legado
  override_global_status?: boolean | null;
  usarProcessamentoPersonalizado?: boolean | null; // Compatibilidade com código legado
  created_at?: string | null;
  updated_at?: string | null;
}
