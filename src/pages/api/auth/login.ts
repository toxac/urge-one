import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async (context) => {
    const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  const body = await context.request.json()
  const { email, password } = body

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: 'Email and password are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ user: data.user, session: data.session }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}