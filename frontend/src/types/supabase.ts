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
            users: {
                Row: {
                    id: string
                    phone: string | null
                    full_name: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    phone?: string | null
                    full_name?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    phone?: string | null
                    full_name?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "users_id_fkey"
                        columns: ["id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    difficulty: number | null
                    status: 'pending' | 'active' | 'completed'
                    created_at: string
                    completed_at: string | null
                    deleted_at: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    difficulty?: number | null
                    status?: 'pending' | 'active' | 'completed'
                    created_at?: string
                    completed_at?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    difficulty?: number | null
                    status?: 'pending' | 'active' | 'completed'
                    created_at?: string
                    completed_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "tasks_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            learning_logs: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    tags: string[]
                    embedding: string | null // Vector is typically a string in JSON response or number[] depending on client usage
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    tags?: string[]
                    embedding?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    tags?: string[]
                    embedding?: string | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "learning_logs_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            system_stats: {
                Row: {
                    id: string
                    user_id: string
                    cognitive_load: number | null
                    energy_level: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    cognitive_load?: number | null
                    energy_level?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    cognitive_load?: number | null
                    energy_level?: number | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "system_stats_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
            }
            brain_dumps: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    type: 'stress' | 'thoughts' | 'worries' | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    type?: 'stress' | 'thoughts' | 'worries' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    type?: 'stress' | 'thoughts' | 'worries' | null
                    created_at?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "brain_dumps_user_id_fkey"
                        columns: ["user_id"]
                        referencedRelation: "users"
                        referencedColumns: ["id"]
                    }
                ]
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
