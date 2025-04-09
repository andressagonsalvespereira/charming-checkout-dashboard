export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      asaas_config: {
        Row: {
          created_at: string | null
          id: number
          production_api_key: string | null
          sandbox_api_key: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          production_api_key?: string | null
          sandbox_api_key?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          production_api_key?: string | null
          sandbox_api_key?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checkout_customization: {
        Row: {
          banner_image_url: string | null
          button_color: string | null
          button_text: string | null
          button_text_color: string | null
          created_at: string | null
          header_message: string
          heading_color: string | null
          id: number
          show_banner: boolean | null
          updated_at: string | null
        }
        Insert: {
          banner_image_url?: string | null
          button_color?: string | null
          button_text?: string | null
          button_text_color?: string | null
          created_at?: string | null
          header_message?: string
          heading_color?: string | null
          id?: number
          show_banner?: boolean | null
          updated_at?: string | null
        }
        Update: {
          banner_image_url?: string | null
          button_color?: string | null
          button_text?: string | null
          button_text_color?: string | null
          created_at?: string | null
          header_message?: string
          heading_color?: string | null
          id?: number
          show_banner?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          asaas_payment_id: string | null
          created_at: string | null
          credit_card_brand: string | null
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          device_type: string | null
          id: number
          is_digital_product: boolean | null
          payment_id: string | null
          payment_method: string | null
          payment_status: string | null
          price: number
          product_id: number | null
          product_name: string
          updated_at: string | null
        }
        Insert: {
          asaas_payment_id?: string | null
          created_at?: string | null
          credit_card_brand?: string | null
          customer_cpf: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          device_type?: string | null
          id?: number
          is_digital_product?: boolean | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price: number
          product_id?: number | null
          product_name: string
          updated_at?: string | null
        }
        Update: {
          asaas_payment_id?: string | null
          created_at?: string | null
          credit_card_brand?: string | null
          customer_cpf?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          device_type?: string | null
          id?: number
          is_digital_product?: boolean | null
          payment_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          price?: number
          product_id?: number | null
          product_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pixel_settings: {
        Row: {
          created_at: string | null
          google_page_view: boolean | null
          google_pixel_enabled: boolean | null
          google_pixel_id: string | null
          google_purchase: boolean | null
          id: number
          meta_add_to_cart: boolean | null
          meta_page_view: boolean | null
          meta_pixel_enabled: boolean | null
          meta_pixel_id: string | null
          meta_purchase: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          google_page_view?: boolean | null
          google_pixel_enabled?: boolean | null
          google_pixel_id?: string | null
          google_purchase?: boolean | null
          id?: number
          meta_add_to_cart?: boolean | null
          meta_page_view?: boolean | null
          meta_pixel_enabled?: boolean | null
          meta_pixel_id?: string | null
          meta_purchase?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          google_page_view?: boolean | null
          google_pixel_enabled?: boolean | null
          google_pixel_id?: string | null
          google_purchase?: boolean | null
          id?: number
          meta_add_to_cart?: boolean | null
          meta_page_view?: boolean | null
          meta_pixel_enabled?: boolean | null
          meta_pixel_id?: string | null
          meta_purchase?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          created_at: string | null
          custom_manual_status: string | null
          description: string | null
          id: number
          image_url: string | null
          is_digital: boolean | null
          name: string
          override_global_status: boolean | null
          price: number
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_manual_status?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_digital?: boolean | null
          name: string
          override_global_status?: boolean | null
          price: number
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_manual_status?: string | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_digital?: boolean | null
          name?: string
          override_global_status?: boolean | null
          price?: number
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          allow_credit_card: boolean | null
          allow_pix: boolean | null
          asaas_enabled: boolean | null
          created_at: string | null
          id: number
          manual_card_processing: boolean | null
          manual_card_status: string | null
          manual_credit_card: boolean | null
          manual_payment_config: boolean | null
          manual_pix_page: boolean | null
          sandbox_mode: boolean | null
          updated_at: string | null
        }
        Insert: {
          allow_credit_card?: boolean | null
          allow_pix?: boolean | null
          asaas_enabled?: boolean | null
          created_at?: string | null
          id?: number
          manual_card_processing?: boolean | null
          manual_card_status?: string | null
          manual_credit_card?: boolean | null
          manual_payment_config?: boolean | null
          manual_pix_page?: boolean | null
          sandbox_mode?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allow_credit_card?: boolean | null
          allow_pix?: boolean | null
          asaas_enabled?: boolean | null
          created_at?: string | null
          id?: number
          manual_card_processing?: boolean | null
          manual_card_status?: string | null
          manual_credit_card?: boolean | null
          manual_payment_config?: boolean | null
          manual_pix_page?: boolean | null
          sandbox_mode?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
