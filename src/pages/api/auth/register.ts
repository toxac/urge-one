import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  const body = await context.request.json()
  const { email, password, confirmPassword } = body

  if (!email || !password || !confirmPassword) {
    return new Response(
      JSON.stringify({ error: 'All fields are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  if (password !== confirmPassword) {
    return new Response(
      JSON.stringify({ error: 'Passwords do not match' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${context.url.origin}/api/auth/callback`
    }
  })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ 
      user: data.user, 
      session: data.session,
      message: data.user && !data.session ? 'Check your email for verification link' : undefined
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}