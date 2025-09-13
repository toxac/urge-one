import { createSignal, createEffect, onMount } from 'solid-js'
import { useStore } from '@nanostores/solid'
import { authStore, setAuth, setLoading, clearAuth } from '../../stores/auth'
import { supabaseBrowserClient } from '../../lib/supabase/client'

export function useAuth() {
    const auth = useStore(authStore)
    const supabase = supabaseBrowserClient;

    const [error, setError] = createSignal<string | null>(null)

    onMount(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setAuth(session?.user ?? null, session)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                setAuth(session?.user ?? null, session)
            }
        )

        return () => subscription.unsubscribe()
    });
  
    // Login helper
    const login = async (email: string, password: string) => {
        setError(null)
        setLoading(true)

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }
            return { success: true }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    // Signup Handler 
    const register = async (email: string, password: string, confirmPassword: string) => {
        setError(null)
        setLoading(true)

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, confirmPassword })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }
            return { success: true, message: data.message }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
        setLoading(false)
        }
    }

    // Forgot Password Handler
    const forgotPassword = async (email: string) => {
        setError(null)
        setLoading(true)

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error)
            }

            return { success: true, message: data.message }
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

    // Logout handler
    const logout = async () => {
        setError(null)
        setLoading(true)

        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST'
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error)
            }else {
                clearAuth();
                return { success: true, error: null }
            }
            
        } catch (err: any) {
            setError(err.message)
            return { success: false, error: err.message }
        } finally {
            setLoading(false)
        }
    }

  return {
    auth,
    error,
    login,
    register,
    forgotPassword,
    logout
  }
}