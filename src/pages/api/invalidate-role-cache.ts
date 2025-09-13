// pages/api/invalidate-roles-cache.ts
import type { APIRoute } from "astro";
import { createSupabaseServerClient } from '../../lib/supabase/server';
import { rolesCacheUtils } from '../../lib/cache/roles';

export const POST: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({
    request: context.request,
    cookies: context.cookies
  });

  // Verify authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Invalidate cache for the current user using shared utility
  rolesCacheUtils.invalidate(session.user.id);

  return new Response(JSON.stringify({ 
    success: true,
    message: 'Roles cache invalidated successfully'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

// Optional: GET endpoint to check cache status
export const GET: APIRoute = async (context) => {
  const supabase = createSupabaseServerClient({
    request: context.request,
    cookies: context.cookies
  });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const cachedRoles = rolesCacheUtils.get(session.user.id);
  const stats = rolesCacheUtils.getStats();

  return new Response(JSON.stringify({
    userId: session.user.id,
    hasCachedRoles: !!cachedRoles,
    cachedRolesCount: cachedRoles?.length || 0,
    cacheStats: stats
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};