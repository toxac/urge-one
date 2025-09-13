import { useAuth } from "../../lib/hooks/useAuth";
import { clearAuth } from "../../stores/auth";
import { navigate } from "astro:transitions/client";

export default function Logout() {
    const { logout } = useAuth();
    const handleLogout = async () => {
        try {
            const { success, error } = await logout();
            if (success) {
                clearAuth();
                navigate("/");
            }
        } catch (error) {
            console.log("Error logging out!")
        }
    }
    return (
        <span onClick={handleLogout}>Logout</span>
    )

}