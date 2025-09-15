import { useAuth } from "../../lib/hooks/useAuth";
import { clearAuth } from "../../stores/auth";
import { navigate } from "astro:transitions/client";
import type { PostgrestError } from "@supabase/supabase-js";

export default function Logout() {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            const { success, error } = await logout();
            if (success) {
                clearAuth();
                navigate("/");
            }
            if(error){
                 // Type guard to check if it's a PostgrestError
                const supabaseError = error as PostgrestError;
                console.error("Supabase logout error:", {
                    code: supabaseError.code,
                    message: supabaseError.message,
                    details: supabaseError.details,
                    hint: supabaseError.hint
                });
                
                // Handle specific error codes if needed
                if (supabaseError.code === 'auth_session_missing') {
                    // Session already expired, just clear local auth
                    clearAuth();
                    navigate("/");
                    return;
                }
                
                throw new Error(`Logout failed: ${supabaseError.message}`);
            }
        } catch (error) {
            console.log("Error logging out!")
        }
    }
    return (
        <span onClick={handleLogout}>Logout</span>
    )

}