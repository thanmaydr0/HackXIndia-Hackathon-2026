import { createContext, useContext, useEffect, useState } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { AuthContextType, AuthState } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        session: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            if (error) {
                setState((prev) => ({ ...prev, loading: false, error }))
            } else {
                setState((prev) => ({
                    ...prev,
                    session,
                    user: session?.user ?? null,
                    loading: false,
                }))
            }
        })

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setState((prev) => ({
                ...prev,
                session,
                user: session?.user ?? null,
                loading: false,
            }))
        })

        return () => subscription.unsubscribe()
    }, [])

    const signInWithOTP = async (phone: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            const { error } = await supabase.auth.signInWithOtp({
                phone,
            })

            if (error) throw error

            return { error: null }
        } catch (error: any) {
            const wrappedError = new Error(error.message || 'Failed to send OTP')
            setState(prev => ({ ...prev, error: wrappedError }))
            return { error: wrappedError }
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    const verifyOTP = async (phone: string, token: string) => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            const { data, error } = await supabase.auth.verifyOtp({
                phone,
                token,
                type: 'sms',
            })

            if (error) throw error

            return { error: null, session: data.session }
        } catch (error: any) {
            const wrappedError = new Error(error.message || 'Failed to verify OTP')
            setState(prev => ({ ...prev, error: wrappedError }))
            return { error: wrappedError, session: null }
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    const signOut = async () => {
        try {
            setState(prev => ({ ...prev, loading: true, error: null }))
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { error: null }
        } catch (error: any) {
            const wrappedError = new Error(error.message || 'Failed to sign out')
            setState(prev => ({ ...prev, error: wrappedError }))
            return { error: wrappedError }
        } finally {
            setState(prev => ({ ...prev, loading: false }))
        }
    }

    const clearError = () => setState(prev => ({ ...prev, error: null }))

    return (
        <AuthContext.Provider
            value={{
                ...state,
                signInWithOTP,
                verifyOTP,
                signOut,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
