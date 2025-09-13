import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  const body = await context.request.json()
  const { email } = body

  if (!email) {
    return new Response(
      JSON.stringify({ error: 'Email is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${context.url.origin}/auth/reset-password`
  })

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Password reset email sent' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}