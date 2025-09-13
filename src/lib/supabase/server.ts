import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export function createSupabaseServerClient({request,cookies }: {request: Request;
  cookies: AstroCookies;
}) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          const parsedCookies = parseCookieHeader(request.headers.get("Cookie") ?? "");
          // Ensure all cookies have values (empty string if undefined)
          return parsedCookies.map(cookie => ({
            name: cookie.name,
            value: cookie.value ?? "",
          }));
          
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value ?? "", options);
          });
        }
      }
    }
  )
  
}