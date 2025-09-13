import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
  
  const { error } = await supabase.auth.signOut()

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ message: 'Logged out successfully' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}