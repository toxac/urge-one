import type { APIRoute } from 'astro';
import { createSupabaseServerClient } from '../../../lib/supabase/server';

export const GET: APIRoute = async(context) => {
    const { url, redirect } = context
    const code = url.searchParams.get('code')

    if (!code) {
        return redirect('/auth/login?error=missing_code')
    }

    const supabase = createSupabaseServerClient({ request: context.request, cookies: context.cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
    return redirect('/auth/login?error=' + encodeURIComponent(error.message))
  }

    return redirect('/dashboard');

}