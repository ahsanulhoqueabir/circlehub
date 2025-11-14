export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar_url: string | null;
          university: string | null;
          student_id: string | null;
          verified: boolean | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar_url?: string | null;
          university?: string | null;
          student_id?: string | null;
          verified?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar_url?: string | null;
          university?: string | null;
          student_id?: string | null;
          verified?: boolean | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lost_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          date_lost: string;
          image_url: string | null;
          contact_info: string;
          status: "active" | "found" | "closed";
          reward_amount: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          date_lost: string;
          image_url?: string | null;
          contact_info: string;
          status?: "active" | "found" | "closed";
          reward_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          date_lost?: string;
          image_url?: string | null;
          contact_info?: string;
          status?: "active" | "found" | "closed";
          reward_amount?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      found_items: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          date_found: string;
          image_url: string | null;
          contact_info: string;
          status: "available" | "claimed" | "returned";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description: string;
          category: string;
          location: string;
          date_found: string;
          image_url?: string | null;
          contact_info: string;
          status?: "available" | "claimed" | "returned";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          category?: string;
          location?: string;
          date_found?: string;
          image_url?: string | null;
          contact_info?: string;
          status?: "available" | "claimed" | "returned";
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};
