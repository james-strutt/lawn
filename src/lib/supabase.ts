import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase: SupabaseClient = (() => {
  if (!supabaseUrl || !supabaseAnonKey) {
    const errorMessage =
      "⚠️ Supabase credentials not found!\n\n" +
      "Please create a .env file in the project root with:\n\n" +
      "VITE_SUPABASE_URL=https://your-project.supabase.co\n" +
      "VITE_SUPABASE_ANON_KEY=your-anon-key\n\n" +
      "Get these values from: https://app.supabase.com → Your Project → Settings → API";

    console.error(errorMessage);

    // Use a valid-looking placeholder URL to prevent immediate validation errors
    // Actual operations will fail gracefully with network errors
    return createClient(
      "https://placeholder.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTIwMDAsImV4cCI6MTk2MDc2ODAwMH0.placeholder",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
      },
    );
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });
})();

export { supabase };

// Database Types (can be generated with: npx supabase gen types typescript)
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          user_type: "first-home-buyer" | "investor" | "upgrader" | null;
          subscription_tier: "free" | "pro";
          annual_income: number | null;
          deposit: number | null;
          is_first_home_buyer: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["profiles"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      saved_properties: {
        Row: {
          id: string;
          user_id: string;
          address: string;
          lot_dp: string | null;
          property_value: number | null;
          zone: string | null;
          area: number | null;
          flood: boolean | null;
          bushfire: boolean | null;
          heritage: boolean | null;
          weekly_rent: number | null;
          geometry: object | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["saved_properties"]["Row"],
          "id" | "created_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["saved_properties"]["Insert"]
        >;
      };
      property_comparisons: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          property_ids: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["property_comparisons"]["Row"],
          "id" | "created_at" | "updated_at"
        >;
        Update: Partial<
          Database["public"]["Tables"]["property_comparisons"]["Insert"]
        >;
      };
    };
  };
};
