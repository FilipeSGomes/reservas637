// Tipos TypeScript do schema Supabase
// Gerado manualmente a partir de supabase/schema.sql
// Atualizar após rodar: npx supabase gen types typescript --project-id <id> > types/supabase.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          short_name: string | null;
          timezone: string;
          active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tenants"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
      };
      tenant_domains: {
        Row: {
          id: string;
          tenant_id: string;
          hostname: string;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tenant_domains"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tenant_domains"]["Insert"]>;
      };
      tenant_settings: {
        Row: {
          id: string;
          tenant_id: string;
          primary_color: string | null;
          bg_color: string | null;
          font_body: string | null;
          font_heading: string | null;
          logo_url: string | null;
          whatsapp_phone: string | null;
          pix_key: string | null;
          opening_start: string;
          opening_end: string;
          slot_minutes: number;
          pricing: Json;
          pix_enabled: boolean;
          billing_enabled: boolean;
          texts: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["tenant_settings"]["Row"], "id" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["tenant_settings"]["Insert"]>;
      };
      tenant_memberships: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          role: "owner" | "admin" | "attendant";
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["tenant_memberships"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["tenant_memberships"]["Insert"]>;
      };
      courts: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          type: string;
          active: boolean;
          sort_order: number;
        };
        Insert: Database["public"]["Tables"]["courts"]["Row"];
        Update: Partial<Database["public"]["Tables"]["courts"]["Row"]>;
      };
      reservations: {
        Row: {
          id: string;
          tenant_id: string;
          court_id: string;
          date: string;
          time: string;
          customer_name: string | null;
          customer_phone: string | null;
          customer_cpf: string | null;
          payment_method: string | null;
          amount: number | null;
          pricing_snapshot: Json | null;
          status: "pendente" | "confirmado" | "faturado" | "bloqueado" | "cancelado";
          created_at: string;
          updated_at: string;
          confirmed_by: string | null;
          confirmed_at: string | null;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reservations"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["reservations"]["Insert"]>;
      };
      blocks: {
        Row: {
          id: string;
          tenant_id: string;
          court_id: string | null;
          date: string;
          start_time: string | null;
          end_time: string | null;
          type: string | null;
          reason: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: Omit<Database["public"]["Tables"]["blocks"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["blocks"]["Insert"]>;
      };
      audit_events: {
        Row: {
          id: string;
          tenant_id: string | null;
          user_id: string | null;
          action: string;
          entity_type: string | null;
          entity_id: string | null;
          payload: Json | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["audit_events"]["Row"], "id" | "created_at">;
        Update: never;
      };
    };
    Views: Record<string, never>;
    Functions: {
      auth_tenant_id: { Args: Record<string, never>; Returns: string };
      is_tenant_member: { Args: { p_tenant_id: string }; Returns: boolean };
    };
    Enums: Record<string, never>;
  };
}
