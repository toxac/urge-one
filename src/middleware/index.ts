import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerClient } from "../lib/supabase/server";
import { rolesCacheUtils } from "../lib/cache/roles";
import { type Database } from "../../database.types";
type UserRole = Database['public']['Tables']['user_roles']['Row']



export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  console.log("Middleware executing for path:", pathname);

  const supabase = createSupabaseServerClient({
    request: context.request,
    cookies: context.cookies
  });

  // Get user session
  const { data: { session } } = await supabase.auth.getSession();

  // Add session to context locals
  context.locals.session = session;
  context.locals.user = session?.user ?? null;
  context.locals.userRoles = [];

  // If user is authenticated, get their roles
  if (session?.user) {
    const userId = session.user.id;
    
    // Check if roles are cached
    const cachedRoles = rolesCacheUtils.get(userId);
    
    if (cachedRoles && Array.isArray(cachedRoles)) {
      // Use cached roles
      context.locals.userRoles = cachedRoles as UserRole[] ;
      console.log("Using cached roles for user:", userId);
    } else {
      // Fetch roles from database
      console.log("Fetching roles from database for user:", userId);
      
      const { data: rolesData, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        // Optional: filter out expired roles if needed
        .is('valid_until', null) // Only roles without expiration
        .or(`valid_until.gt.${new Date().toISOString()},valid_until.is.null`); // Or not yet expired
      
      if (!error && rolesData && rolesData.length > 0) {
        // Cache the roles
        rolesCacheUtils.set(userId, rolesData);
        context.locals.userRoles = rolesData;
        
        console.log("Roles cached for user:", userId, "Roles:", rolesData.map(r => r.role_name));
      } else if (error) {
        console.error("Error fetching user roles:", error);
      } else {
        console.log("No roles found for user:", userId);
      }
    }
  }

  return next();
});