
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

// Adicionar tipo de entrada para criar produto com suporte a chaves legadas
export interface CreateProductInput {
  nome?: string; // Nome em português para compatibilidade
  name?: string;
  descricao?: string; // Descrição em português para compatibilidade
  description?: string;
  preco?: number; // Preço em português para compatibilidade
  price?: number;
  urlImagem?: string; // URL da imagem em português para compatibilidade
  image_url?: string;
  digital?: boolean; // Produto digital em português para compatibilidade
  is_digital?: boolean;
  usarProcessamentoPersonalizado?: boolean; // Processamento personalizado em português
  override_global_status?: boolean;
  statusCartaoManual?: string; // Status do cartão manual em português
  custom_manual_status?: string;
}

// Renomear tipo legado para manter compatibilidade
export type CriarProdutoInput = CreateProductInput;
