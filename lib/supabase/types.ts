export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          avatar_url: string | null
          language: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string
          avatar_url?: string | null
          language?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          avatar_url?: string | null
          language?: string
          created_at?: string
        }
        Relationships: []
      }
      coffee_profiles: {
        Row: {
          id: string
          user_id: string
          name: string
          drink_type: string
          size: string
          temperature: string
          shots: number
          milk_type: string
          sugar_level: string
          sweetener_type: string | null
          foam_preference: string
          syrups: string[]
          toppings: string[]
          special_instructions: string | null
          allergens: string[]
          is_seasonal: boolean
          season: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          drink_type: string
          size?: string
          temperature?: string
          shots?: number
          milk_type?: string
          sugar_level?: string
          sweetener_type?: string | null
          foam_preference?: string
          syrups?: string[]
          toppings?: string[]
          special_instructions?: string | null
          allergens?: string[]
          is_seasonal?: boolean
          season?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          drink_type?: string
          size?: string
          temperature?: string
          shots?: number
          milk_type?: string
          sugar_level?: string
          sweetener_type?: string | null
          foam_preference?: string
          syrups?: string[]
          toppings?: string[]
          special_instructions?: string | null
          allergens?: string[]
          is_seasonal?: boolean
          season?: string
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'coffee_profiles_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      privacy_settings: {
        Row: {
          id: string
          user_id: string
          public_by_default: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          public_by_default?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          public_by_default?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'privacy_settings_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      privacy_blocks: {
        Row: {
          id: string
          owner_user_id: string
          blocked_user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          blocked_user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          blocked_user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'privacy_blocks_owner_user_id_fkey'
            columns: ['owner_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'privacy_blocks_blocked_user_id_fkey'
            columns: ['blocked_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      groups: {
        Row: {
          id: string
          created_by: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          created_by: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          created_by?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'groups_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'admin' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'admin' | 'member'
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'group_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      badges: {
        Row: {
          id: string
          key: string
          label_en: string
          label_he: string
          icon: string
        }
        Insert: {
          id?: string
          key: string
          label_en: string
          label_he: string
          icon: string
        }
        Update: {
          id?: string
          key?: string
          label_en?: string
          label_he?: string
          icon?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_badges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_badges_badge_id_fkey'
            columns: ['badge_id']
            isOneToOne: false
            referencedRelation: 'badges'
            referencedColumns: ['id']
          }
        ]
      }
      recommendations: {
        Row: {
          id: string
          from_user_id: string
          to_user_id: string
          drink_name: string
          note: string | null
          sent_at: string
        }
        Insert: {
          id?: string
          from_user_id: string
          to_user_id: string
          drink_name: string
          note?: string | null
          sent_at?: string
        }
        Update: {
          id?: string
          from_user_id?: string
          to_user_id?: string
          drink_name?: string
          note?: string | null
          sent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'recommendations_from_user_id_fkey'
            columns: ['from_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'recommendations_to_user_id_fkey'
            columns: ['to_user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type CoffeeProfile = Database['public']['Tables']['coffee_profiles']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type Badge = Database['public']['Tables']['badges']['Row']
export type UserBadge = Database['public']['Tables']['user_badges']['Row']
export type Recommendation = Database['public']['Tables']['recommendations']['Row']
export type PrivacySettings = Database['public']['Tables']['privacy_settings']['Row']
