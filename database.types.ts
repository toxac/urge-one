export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      accomplishments: {
        Row: {
          category: string | null
          created_at: string
          criteria: Json | null
          description: string | null
          id: number
          image_url: string | null
          is_active: boolean | null
          level: string | null
          name: string | null
          points: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          name?: string | null
          points?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          criteria?: Json | null
          description?: string | null
          id?: number
          image_url?: string | null
          is_active?: boolean | null
          level?: string | null
          name?: string | null
          points?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      auth_group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      auth_group_permissions: {
        Row: {
          group_id: number
          id: number
          permission_id: number
        }
        Insert: {
          group_id: number
          id?: number
          permission_id: number
        }
        Update: {
          group_id?: number
          id?: number
          permission_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "auth_permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "auth_group"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_permission: {
        Row: {
          codename: string
          content_type_id: number
          id: number
          name: string
        }
        Insert: {
          codename: string
          content_type_id: number
          id?: number
          name: string
        }
        Update: {
          codename?: string
          content_type_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "auth_permission_content_type_id_2f476e4b_fk_django_co"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "django_content_type"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_user: {
        Row: {
          date_joined: string
          email: string
          first_name: string
          id: number
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login: string | null
          last_name: string
          password: string
          username: string
        }
        Insert: {
          date_joined: string
          email: string
          first_name: string
          id?: number
          is_active: boolean
          is_staff: boolean
          is_superuser: boolean
          last_login?: string | null
          last_name: string
          password: string
          username: string
        }
        Update: {
          date_joined?: string
          email?: string
          first_name?: string
          id?: number
          is_active?: boolean
          is_staff?: boolean
          is_superuser?: boolean
          last_login?: string | null
          last_name?: string
          password?: string
          username?: string
        }
        Relationships: []
      }
      auth_user_groups: {
        Row: {
          group_id: number
          id: number
          user_id: number
        }
        Insert: {
          group_id: number
          id?: number
          user_id: number
        }
        Update: {
          group_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "auth_user_groups_group_id_97559544_fk_auth_group_id"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "auth_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_user_groups_user_id_6a12ed8b_fk_auth_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_user"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_user_user_permissions: {
        Row: {
          id: number
          permission_id: number
          user_id: number
        }
        Insert: {
          id?: number
          permission_id: number
          user_id: number
        }
        Update: {
          id?: number
          permission_id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "auth_permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_user"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_steps: {
        Row: {
          challenge_id: string | null
          created_at: string
          id: number
          instructions: string | null
          reflection_questions: string[] | null
          sequence: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string
          id?: number
          instructions?: string | null
          reflection_questions?: string[] | null
          sequence?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string
          id?: number
          instructions?: string | null
          reflection_questions?: string[] | null
          sequence?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenge_steps_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          archived: boolean | null
          badges: Json | null
          content_meta_id: string | null
          cover_image: Json | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          id: string
          is_open: boolean | null
          language: string
          milestone_id: string | null
          program_id: string | null
          pub_date: string
          sequence: number | null
          subtitle: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_date: string | null
          version: number | null
        }
        Insert: {
          archived?: boolean | null
          badges?: Json | null
          content_meta_id?: string | null
          cover_image?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_open?: boolean | null
          language?: string
          milestone_id?: string | null
          program_id?: string | null
          pub_date: string
          sequence?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_date?: string | null
          version?: number | null
        }
        Update: {
          archived?: boolean | null
          badges?: Json | null
          content_meta_id?: string | null
          cover_image?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          is_open?: boolean | null
          language?: string
          milestone_id?: string | null
          program_id?: string | null
          pub_date?: string
          sequence?: number | null
          subtitle?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_date?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_content_meta_id_fkey"
            columns: ["content_meta_id"]
            isOneToOne: false
            referencedRelation: "content_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "content_meta"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      content_meta: {
        Row: {
          accomplishment_id: number | null
          content: string | null
          content_type: string
          created_at: string
          description: string | null
          difficulty: string | null
          has_form: boolean | null
          id: string
          milestone_id: string | null
          program_id: string | null
          related_content: Json | null
          sequence: number | null
          slug: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          accomplishment_id?: number | null
          content?: string | null
          content_type: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          has_form?: boolean | null
          id?: string
          milestone_id?: string | null
          program_id?: string | null
          related_content?: Json | null
          sequence?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          accomplishment_id?: number | null
          content?: string | null
          content_type?: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          has_form?: boolean | null
          id?: string
          milestone_id?: string | null
          program_id?: string | null
          related_content?: Json | null
          sequence?: number | null
          slug?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_meta_accomplishment_id_fkey"
            columns: ["accomplishment_id"]
            isOneToOne: false
            referencedRelation: "accomplishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_meta_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "content_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      discounts: {
        Row: {
          code: string
          created_at: string
          currency: string | null
          entity_id: string
          entity_name: string | null
          entity_type: string
          id: number
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
          value: number
          value_type: string
        }
        Insert: {
          code: string
          created_at?: string
          currency?: string | null
          entity_id: string
          entity_name?: string | null
          entity_type: string
          id?: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          value: number
          value_type: string
        }
        Update: {
          code?: string
          created_at?: string
          currency?: string | null
          entity_id?: string
          entity_name?: string | null
          entity_type?: string
          id?: number
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
          value?: number
          value_type?: string
        }
        Relationships: []
      }
      django_admin_log: {
        Row: {
          action_flag: number
          action_time: string
          change_message: string
          content_type_id: number | null
          id: number
          object_id: string | null
          object_repr: string
          user_id: number
        }
        Insert: {
          action_flag: number
          action_time: string
          change_message: string
          content_type_id?: number | null
          id?: number
          object_id?: string | null
          object_repr: string
          user_id: number
        }
        Update: {
          action_flag?: number
          action_time?: string
          change_message?: string
          content_type_id?: number | null
          id?: number
          object_id?: string | null
          object_repr?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "django_admin_log_content_type_id_c4bce8eb_fk_django_co"
            columns: ["content_type_id"]
            isOneToOne: false
            referencedRelation: "django_content_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "django_admin_log_user_id_c564eba6_fk_auth_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "auth_user"
            referencedColumns: ["id"]
          },
        ]
      }
      django_content_type: {
        Row: {
          app_label: string
          id: number
          model: string
        }
        Insert: {
          app_label: string
          id?: number
          model: string
        }
        Update: {
          app_label?: string
          id?: number
          model?: string
        }
        Relationships: []
      }
      django_migrations: {
        Row: {
          app: string
          applied: string
          id: number
          name: string
        }
        Insert: {
          app: string
          applied: string
          id?: number
          name: string
        }
        Update: {
          app?: string
          applied?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      django_session: {
        Row: {
          expire_date: string
          session_data: string
          session_key: string
        }
        Insert: {
          expire_date: string
          session_data: string
          session_key: string
        }
        Update: {
          expire_date?: string
          session_data?: string
          session_key?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          capacity: number | null
          created_at: string | null
          created_by: string
          currency: string | null
          description: string | null
          end_time: string
          event_format: string
          event_type: string
          exhibits: Json[] | null
          featured_image_url: string | null
          id: string
          is_member_only: boolean
          is_paid: boolean
          location: Json | null
          online_link: string | null
          price: number | null
          sessions: Json[] | null
          start_time: string
          title: string
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          created_at?: string | null
          created_by: string
          currency?: string | null
          description?: string | null
          end_time: string
          event_format: string
          event_type: string
          exhibits?: Json[] | null
          featured_image_url?: string | null
          id?: string
          is_member_only?: boolean
          is_paid?: boolean
          location?: Json | null
          online_link?: string | null
          price?: number | null
          sessions?: Json[] | null
          start_time: string
          title: string
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          created_at?: string | null
          created_by?: string
          currency?: string | null
          description?: string | null
          end_time?: string
          event_format?: string
          event_type?: string
          exhibits?: Json[] | null
          featured_image_url?: string | null
          id?: string
          is_member_only?: boolean
          is_paid?: boolean
          location?: Json | null
          online_link?: string | null
          price?: number | null
          sessions?: Json[] | null
          start_time?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          city: string | null
          communications: Json | null
          country: string | null
          created_at: string
          email: string | null
          first_name: string | null
          gender: string | null
          id: number
          last_name: string | null
          notes: string | null
          opt_newsletter: boolean | null
          opt_updates: boolean | null
          other_details: Json | null
          phone: string | null
          program_id: string | null
          segment: string | null
          source: string | null
          source_details: Json | null
          status: string | null
        }
        Insert: {
          city?: string | null
          communications?: Json | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          last_name?: string | null
          notes?: string | null
          opt_newsletter?: boolean | null
          opt_updates?: boolean | null
          other_details?: Json | null
          phone?: string | null
          program_id?: string | null
          segment?: string | null
          source?: string | null
          source_details?: Json | null
          status?: string | null
        }
        Update: {
          city?: string | null
          communications?: Json | null
          country?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          gender?: string | null
          id?: number
          last_name?: string | null
          notes?: string | null
          opt_newsletter?: boolean | null
          opt_updates?: boolean | null
          other_details?: Json | null
          phone?: string | null
          program_id?: string | null
          segment?: string | null
          source?: string | null
          source_details?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string | null
          id: number
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      offerings: {
        Row: {
          base_price_amount: number | null
          created_at: string
          currency: string | null
          description: string | null
          duration_months: number | null
          entity_type: string | null
          id: number
          is_active: boolean | null
          name: string
          related_entity_id: string | null
          updated_at: string | null
        }
        Insert: {
          base_price_amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_months?: number | null
          entity_type?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          related_entity_id?: string | null
          updated_at?: string | null
        }
        Update: {
          base_price_amount?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          duration_months?: number | null
          entity_type?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          related_entity_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          created_at: string
          description: string | null
          id: string
          mode: string | null
          name: string
          price: Json | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: string | null
          name: string
          price?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          mode?: string | null
          name?: string
          price?: Json | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resource_meta: {
        Row: {
          categories: string[] | null
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          slug: string | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          categories?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          categories?: string[] | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      resources_comments: {
        Row: {
          created_at: string
          created_by: string
          id: number
          resources_meta_id: number
          status: string | null
          text: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: number
          resources_meta_id: number
          status?: string | null
          text?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: number
          resources_meta_id?: number
          status?: string | null
          text?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_comments_resources_meta_id_fkey"
            columns: ["resources_meta_id"]
            isOneToOne: false
            referencedRelation: "resource_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_accomplishments: {
        Row: {
          accomplishment_id: number | null
          context_data: Json | null
          created_at: string
          earned_at: string | null
          id: number
          user_id: string | null
        }
        Insert: {
          accomplishment_id?: number | null
          context_data?: Json | null
          created_at?: string
          earned_at?: string | null
          id?: number
          user_id?: string | null
        }
        Update: {
          accomplishment_id?: number | null
          context_data?: Json | null
          created_at?: string
          earned_at?: string | null
          id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_accomplishments_accomplishment_id_fkey"
            columns: ["accomplishment_id"]
            isOneToOne: false
            referencedRelation: "accomplishments"
            referencedColumns: ["id"]
          },
        ]
      }
      user_bookmarks: {
        Row: {
          content_type: string | null
          created_at: string
          id: number
          reference_table: string | null
          reference_url: string
          related_content_id: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          id?: number
          reference_table?: string | null
          reference_url: string
          related_content_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          id?: number
          reference_table?: string | null
          reference_url?: string
          related_content_id?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed_at: string | null
          created_at: string
          email: string | null
          feedback_rating: number | null
          feedback_text: string | null
          id: number
          last_step_completed: number | null
          notification_sent: Json | null
          reflections: Json[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          challenge_id: string
          completed_at?: string | null
          created_at?: string
          email?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: number
          last_step_completed?: number | null
          notification_sent?: Json | null
          reflections?: Json[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          challenge_id?: string
          completed_at?: string | null
          created_at?: string
          email?: string | null
          feedback_rating?: number | null
          feedback_text?: string | null
          id?: number
          last_step_completed?: number | null
          notification_sent?: Json | null
          reflections?: Json[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cheer_squad: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          relationship: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          relationship?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          relationship?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_cheer_squad_updates: {
        Row: {
          cheer_squad_id: string
          created_at: string | null
          id: string
          status: string | null
          type: string
          update_link: string | null
          update_text: string | null
          user_id: string
        }
        Insert: {
          cheer_squad_id: string
          created_at?: string | null
          id?: string
          status?: string | null
          type: string
          update_link?: string | null
          update_text?: string | null
          user_id: string
        }
        Update: {
          cheer_squad_id?: string
          created_at?: string | null
          id?: string
          status?: string | null
          type?: string
          update_link?: string | null
          update_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cheer_squad_updates_cheer_squad_id_fkey"
            columns: ["cheer_squad_id"]
            isOneToOne: false
            referencedRelation: "user_cheer_squad"
            referencedColumns: ["id"]
          },
        ]
      }
      user_enrollments: {
        Row: {
          enrolled_at: string
          id: number
          program_id: string | null
          program_name: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          enrolled_at?: string
          id?: number
          program_id?: string | null
          program_name?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          enrolled_at?: string
          id?: number
          program_id?: string | null
          program_name?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "program_enrollments_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
        ]
      }
      user_events: {
        Row: {
          attendance_status: string | null
          created_at: string
          email: string | null
          event_id: string | null
          id: string
          name: string | null
          organization: string | null
          organization_role: string | null
          participant_avatar_url: string | null
          participant_bio: string | null
          participant_type: string | null
          status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          organization?: string | null
          organization_role?: string | null
          participant_avatar_url?: string | null
          participant_bio?: string | null
          participant_type?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          created_at?: string
          email?: string | null
          event_id?: string | null
          id?: string
          name?: string | null
          organization?: string | null
          organization_role?: string | null
          participant_avatar_url?: string | null
          participant_bio?: string | null
          participant_type?: string | null
          status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_events_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "user_purchases"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "user_events_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "user_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_journals: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          entry_data: Json | null
          id: string
          is_public: boolean | null
          related_entity_id: string | null
          related_entity_slug: string | null
          related_entity_type: string | null
          title: string | null
          type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          entry_data?: Json | null
          id?: string
          is_public?: boolean | null
          related_entity_id?: string | null
          related_entity_slug?: string | null
          related_entity_type?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          entry_data?: Json | null
          id?: string
          is_public?: boolean | null
          related_entity_id?: string | null
          related_entity_slug?: string | null
          related_entity_type?: string | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          created_at: string
          id: string
          offering_id: number | null
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          offering_id?: number | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          offering_id?: number | null
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_memberships_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings_with_details"
            referencedColumns: ["offering_id"]
          },
          {
            foreignKeyName: "user_memberships_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "user_purchases"
            referencedColumns: ["transaction_id"]
          },
          {
            foreignKeyName: "user_memberships_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "user_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string | null
          content_type: string | null
          created_at: string
          id: number
          reference_table: string | null
          reference_url: string
          related_content_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          id?: number
          reference_table?: string | null
          reference_url: string
          related_content_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          content?: string | null
          content_type?: string | null
          created_at?: string
          id?: number
          reference_table?: string | null
          reference_url?: string
          related_content_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_opportunities: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          discovery_method: string
          goal_alignment: string | null
          id: string
          observation_type: string | null
          rank: number | null
          status: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          discovery_method: string
          goal_alignment?: string | null
          id?: string
          observation_type?: string | null
          rank?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          discovery_method?: string
          goal_alignment?: string | null
          id?: string
          observation_type?: string | null
          rank?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_opportunity_comments: {
        Row: {
          comment_type: string | null
          content: string | null
          created_at: string
          id: string
          opportunity_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          comment_type?: string | null
          content?: string | null
          created_at?: string
          id?: string
          opportunity_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          comment_type?: string | null
          content?: string | null
          created_at?: string
          id?: string
          opportunity_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunity_comments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "user_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_opportunity_segments: {
        Row: {
          accessibility_score: number | null
          age_range_end: number | null
          age_range_start: number | null
          budget_range: string | null
          created_at: string
          education_level: string[] | null
          estimated_segment_size: number | null
          evidence_date: string | null
          evidence_details: string
          evidence_type: string
          family_status: string | null
          gender_focus: string[] | null
          geographic_focus: string | null
          id: string
          income_level: string | null
          next_validation_steps: string | null
          occupation_types: string[] | null
          opportunity_id: string
          outreach_plan: string | null
          people_researched: number | null
          psychographic_traits: string[] | null
          purchase_frequency: string | null
          segment_description: string
          segment_name: string
          specific_needs: string[]
          specific_pains: string[]
          updated_at: string | null
          user_id: string | null
          validation_status: string
          willingness_to_pay: string | null
        }
        Insert: {
          accessibility_score?: number | null
          age_range_end?: number | null
          age_range_start?: number | null
          budget_range?: string | null
          created_at?: string
          education_level?: string[] | null
          estimated_segment_size?: number | null
          evidence_date?: string | null
          evidence_details: string
          evidence_type: string
          family_status?: string | null
          gender_focus?: string[] | null
          geographic_focus?: string | null
          id?: string
          income_level?: string | null
          next_validation_steps?: string | null
          occupation_types?: string[] | null
          opportunity_id: string
          outreach_plan?: string | null
          people_researched?: number | null
          psychographic_traits?: string[] | null
          purchase_frequency?: string | null
          segment_description: string
          segment_name: string
          specific_needs: string[]
          specific_pains: string[]
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string
          willingness_to_pay?: string | null
        }
        Update: {
          accessibility_score?: number | null
          age_range_end?: number | null
          age_range_start?: number | null
          budget_range?: string | null
          created_at?: string
          education_level?: string[] | null
          estimated_segment_size?: number | null
          evidence_date?: string | null
          evidence_details?: string
          evidence_type?: string
          family_status?: string | null
          gender_focus?: string[] | null
          geographic_focus?: string | null
          id?: string
          income_level?: string | null
          next_validation_steps?: string | null
          occupation_types?: string[] | null
          opportunity_id?: string
          outreach_plan?: string | null
          people_researched?: number | null
          psychographic_traits?: string[] | null
          purchase_frequency?: string | null
          segment_description?: string
          segment_name?: string
          specific_needs?: string[]
          specific_pains?: string[]
          updated_at?: string | null
          user_id?: string | null
          validation_status?: string
          willingness_to_pay?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_opportunity_segments_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "user_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          activations: Json[] | null
          address: Json | null
          age_group: string | null
          bio: string | null
          created_at: string | null
          education: Json | null
          employment: Json | null
          entrepreneurial_assessment: Json | null
          first_name: string | null
          gender: string | null
          interests: Json | null
          last_active_at: string | null
          last_name: string | null
          motivation_deal_breakers: string | null
          motivation_emotions: string[] | null
          motivation_perfect_day: string | null
          motivation_statement: string | null
          motivations: Json | null
          myths: Json | null
          preferences: Json | null
          profile_picture: string | null
          roles: Json[] | null
          settings: Json | null
          social_links: Json | null
          updated_at: string | null
          user_id: string
          username: string
          website: string | null
        }
        Insert: {
          activations?: Json[] | null
          address?: Json | null
          age_group?: string | null
          bio?: string | null
          created_at?: string | null
          education?: Json | null
          employment?: Json | null
          entrepreneurial_assessment?: Json | null
          first_name?: string | null
          gender?: string | null
          interests?: Json | null
          last_active_at?: string | null
          last_name?: string | null
          motivation_deal_breakers?: string | null
          motivation_emotions?: string[] | null
          motivation_perfect_day?: string | null
          motivation_statement?: string | null
          motivations?: Json | null
          myths?: Json | null
          preferences?: Json | null
          profile_picture?: string | null
          roles?: Json[] | null
          settings?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          user_id: string
          username: string
          website?: string | null
        }
        Update: {
          activations?: Json[] | null
          address?: Json | null
          age_group?: string | null
          bio?: string | null
          created_at?: string | null
          education?: Json | null
          employment?: Json | null
          entrepreneurial_assessment?: Json | null
          first_name?: string | null
          gender?: string | null
          interests?: Json | null
          last_active_at?: string | null
          last_name?: string | null
          motivation_deal_breakers?: string | null
          motivation_emotions?: string[] | null
          motivation_perfect_day?: string | null
          motivation_statement?: string | null
          motivations?: Json | null
          myths?: Json | null
          preferences?: Json | null
          profile_picture?: string | null
          roles?: Json[] | null
          settings?: Json | null
          social_links?: Json | null
          updated_at?: string | null
          user_id?: string
          username?: string
          website?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          content_meta_id: string | null
          content_slug: string | null
          content_title: string | null
          content_type: string | null
          created_at: string
          feedback_rating: number | null
          feedback_text: string | null
          form_completed: boolean | null
          has_form: boolean | null
          id: number
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_meta_id?: string | null
          content_slug?: string | null
          content_title?: string | null
          content_type?: string | null
          created_at?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          form_completed?: boolean | null
          has_form?: boolean | null
          id?: number
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_meta_id?: string | null
          content_slug?: string | null
          content_title?: string | null
          content_type?: string | null
          created_at?: string
          feedback_rating?: number | null
          feedback_text?: string | null
          form_completed?: boolean | null
          has_form?: boolean | null
          id?: number
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_content_meta_id_fkey"
            columns: ["content_meta_id"]
            isOneToOne: false
            referencedRelation: "content_meta"
            referencedColumns: ["id"]
          },
        ]
      }
      user_question_responses: {
        Row: {
          asker_id: string
          content: string
          created_at: string
          feedback_rating: number | null
          id: number
          question_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          asker_id: string
          content: string
          created_at?: string
          feedback_rating?: number | null
          id?: number
          question_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          asker_id?: string
          content?: string
          created_at?: string
          feedback_rating?: number | null
          id?: number
          question_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_question_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "user_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_questions: {
        Row: {
          content: string
          content_type: string
          created_at: string
          id: number
          is_public: boolean
          reference_table: string
          reference_url: string
          related_content_id: string
          status: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          content_type: string
          created_at?: string
          id?: number
          is_public: boolean
          reference_table: string
          reference_url: string
          related_content_id: string
          status: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string
          created_at?: string
          id?: number
          is_public?: boolean
          reference_table?: string
          reference_url?: string
          related_content_id?: string
          status?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role_id: number
          role_name: string | null
          updated_at: string | null
          user_id: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          role_id: number
          role_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          role_id?: number
          role_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_skills: {
        Row: {
          assessment_market_demand: string | null
          assessment_monetization_ideas: Json[] | null
          assessment_notes: string | null
          assessment_passion_level: number | null
          assessment_required_investment: string | null
          assessment_status: string | null
          assessment_viability: Json[] | null
          category: string
          created_at: string | null
          description: string | null
          experience: string | null
          frequency_of_use: string | null
          id: string
          is_public: boolean | null
          name: string | null
          professional_training: string | null
          proficiency_level: string | null
          project_examples: Json | null
          subcategory: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assessment_market_demand?: string | null
          assessment_monetization_ideas?: Json[] | null
          assessment_notes?: string | null
          assessment_passion_level?: number | null
          assessment_required_investment?: string | null
          assessment_status?: string | null
          assessment_viability?: Json[] | null
          category: string
          created_at?: string | null
          description?: string | null
          experience?: string | null
          frequency_of_use?: string | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          professional_training?: string | null
          proficiency_level?: string | null
          project_examples?: Json | null
          subcategory: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assessment_market_demand?: string | null
          assessment_monetization_ideas?: Json[] | null
          assessment_notes?: string | null
          assessment_passion_level?: number | null
          assessment_required_investment?: string | null
          assessment_status?: string | null
          assessment_viability?: Json[] | null
          category?: string
          created_at?: string | null
          description?: string | null
          experience?: string | null
          frequency_of_use?: string | null
          id?: string
          is_public?: boolean | null
          name?: string | null
          professional_training?: string | null
          proficiency_level?: string | null
          project_examples?: Json | null
          subcategory?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_transactions: {
        Row: {
          base_amount: number | null
          created_at: string
          currency: string | null
          discount_amount: number | null
          discount_id: number | null
          id: string
          offering_id: number | null
          offering_name: string | null
          offering_type: string | null
          payment_method: string | null
          payment_provider: string | null
          provider_data: Json | null
          provider_transaction_id: string | null
          status: string | null
          tax_amount: number | null
          total_amount_paid: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          base_amount?: number | null
          created_at?: string
          currency?: string | null
          discount_amount?: number | null
          discount_id?: number | null
          id?: string
          offering_id?: number | null
          offering_name?: string | null
          offering_type?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          provider_data?: Json | null
          provider_transaction_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount_paid?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          base_amount?: number | null
          created_at?: string
          currency?: string | null
          discount_amount?: number | null
          discount_id?: number | null
          id?: string
          offering_id?: number | null
          offering_name?: string | null
          offering_type?: string | null
          payment_method?: string | null
          payment_provider?: string | null
          provider_data?: Json | null
          provider_transaction_id?: string | null
          status?: string | null
          tax_amount?: number | null
          total_amount_paid?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_discount_id_fkey"
            columns: ["discount_id"]
            isOneToOne: false
            referencedRelation: "discounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings_with_details"
            referencedColumns: ["offering_id"]
          },
        ]
      }
    }
    Views: {
      offerings_with_details: {
        Row: {
          base_price_amount: number | null
          currency: string | null
          duration_months: number | null
          entity_type: string | null
          event_capacity: number | null
          event_created_by: string | null
          event_description: string | null
          event_end_time: string | null
          event_exhibits: Json[] | null
          event_format: string | null
          event_image: string | null
          event_member_only: boolean | null
          event_sessions: Json[] | null
          event_start_time: string | null
          event_title: string | null
          event_type: string | null
          is_active: boolean | null
          location: Json | null
          offering_created_at: string | null
          offering_description: string | null
          offering_id: number | null
          offering_name: string | null
          offering_updated_at: string | null
          online_link: string | null
          program_created_at: string | null
          program_description: string | null
          program_mode: string | null
          program_name: string | null
          program_type: string | null
          program_updated_at: string | null
          related_entity_id: string | null
        }
        Relationships: []
      }
      user_purchases: {
        Row: {
          base_amount: number | null
          currency: string | null
          discount_amount: number | null
          duration_months: number | null
          entity_type: string | null
          event_end_time: string | null
          event_start_time: string | null
          event_title: string | null
          membership_end: string | null
          membership_start: string | null
          membership_status: string | null
          offering_id: number | null
          offering_name: string | null
          offering_type: string | null
          payment_method: string | null
          payment_provider: string | null
          program_enrollment_date: string | null
          program_name: string | null
          purchase_date: string | null
          related_entity_id: string | null
          tax_amount: number | null
          total_amount_paid: number | null
          transaction_id: string | null
          transaction_status: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_transactions_offering_id_fkey"
            columns: ["offering_id"]
            isOneToOne: false
            referencedRelation: "offerings_with_details"
            referencedColumns: ["offering_id"]
          },
        ]
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
