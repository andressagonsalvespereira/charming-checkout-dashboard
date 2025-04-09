
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      checkout_customization: {
        Row: {
          id: number
          header_message: string
          banner_image_url: string | null
          show_banner: boolean
          button_color: string
          button_text_color: string | null
          heading_color: string | null
          button_text: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          header_message?: string
          banner_image_url?: string | null
          show_banner?: boolean
          button_color?: string
          button_text_color?: string | null
          heading_color?: string | null
          button_text?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          header_message?: string
          banner_image_url?: string | null
          show_banner?: boolean
          button_color?: string
          button_text_color?: string | null
          heading_color?: string | null
          button_text?: string
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          customer_name: string
          customer_email: string
          customer_cpf: string
          customer_phone: string | null
          product_id: number | null
          product_name: string
          price: number
          payment_method: string | null
          payment_status: string | null
          payment_id: string | null
          credit_card_brand: string | null
          device_type: string | null
          is_digital_product: boolean | null
          asaas_payment_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          customer_name: string
          customer_email: string
          customer_cpf: string
          customer_phone?: string | null
          product_id?: number | null
          product_name: string
          price: number
          payment_method?: string | null
          payment_status?: string | null
          payment_id?: string | null
          credit_card_brand?: string | null
          device_type?: string | null
          is_digital_product?: boolean | null
          asaas_payment_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          customer_name?: string
          customer_email?: string
          customer_cpf?: string
          customer_phone?: string | null
          product_id?: number | null
          product_name?: string
          price?: number
          payment_method?: string | null
          payment_status?: string | null
          payment_id?: string | null
          credit_card_brand?: string | null
          device_type?: string | null
          is_digital_product?: boolean | null
          asaas_payment_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      products: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          price: number
          image_url: string | null
          image: string | null
          is_digital: boolean | null
          override_global_status: boolean | null
          custom_manual_status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          price: number
          image_url?: string | null
          image?: string | null
          is_digital?: boolean | null
          override_global_status?: boolean | null
          custom_manual_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          price?: number
          image_url?: string | null
          image?: string | null
          is_digital?: boolean | null
          override_global_status?: boolean | null
          custom_manual_status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          id: string
          name: string
          owner: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      objects: {
        Row: {
          id: string
          bucket_id: string
          name: string
          owner: string | null
          created_at: string | null
          updated_at: string | null
          last_accessed_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          bucket_id: string
          name: string
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          bucket_id?: string
          name?: string
          owner?: string | null
          created_at?: string | null
          updated_at?: string | null
          last_accessed_at?: string | null
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
