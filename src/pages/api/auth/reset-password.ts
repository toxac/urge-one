import type { APIRoute } from 'astro'
import { createSupabaseServerClient } from '../../../lib/supabase/server'

export const POST: APIRoute = async (context) => {
    const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
    try {
    const { code, password } = await context.request.json()
    
    
    // Verify the reset code first
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: code,
      type: 'recovery'
    })

    if (verifyError) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired reset code' }),
        { status: 400 }
      )
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    })

    if (updateError) {
      return new Response(
        JSON.stringify({ error: updateError.message }),
        { status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Password updated successfully' }),
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500 }
    )
  }
}