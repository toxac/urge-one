import { atom } from "nanostores";
import { type Database } from "../../database.types";
import { supabaseBrowserClient } from "../lib/supabase/client";

const supabase = supabaseBrowserClient;

// Define the UserRole type based on the user_roles table row
type UserRole = Database['public']['Tables']['user_roles']['Row'];

// Cache invalidation function using the shared API
const invalidateServerCache = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/invalidate-roles-cache', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success;
  } catch (error) {
    console.error('Failed to invalidate server cache:', error);
    return false;
  }
};

// Create a nanostore to hold an array of UserRole or null
export const rolesStore = atom<UserRole[] | null>(null);

// Optional: Store for loading state
export const rolesLoading = atom<boolean>(false);
export const rolesError = atom<string | null>(null);

// Fetch all roles for the current user
export const fetchUserRoles = async (userId: string) => {
  rolesLoading.set(true);
  rolesError.set(null);
  
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    rolesStore.set(data);
    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    rolesError.set(errorMessage);
    console.error('Error fetching user roles:', error);
    return null;
  } finally {
    rolesLoading.set(false);
  }
};

// Add a new role
export const addRole = async (roleData: {
  user_id: string;
  role_id: number;
  role_name?: string;
  valid_until?: string | null;
}) => {
  rolesLoading.set(true);
  rolesError.set(null);

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{
        ...roleData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Update the store with the new role
    const currentRoles = rolesStore.get();
    if (currentRoles) {
      rolesStore.set([data, ...currentRoles]);
    } else {
      rolesStore.set([data]);
    }
    // Invalidate server cache to ensure middleware gets fresh data
    await invalidateServerCache();

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    rolesError.set(errorMessage);
    console.error('Error adding role:', error);
    return { data: null, error: errorMessage };
  } finally {
    rolesLoading.set(false);
  }
};

// Update an existing role
export const updateRole = async (
  roleId: number,
  updates: Partial<{
    role_id: number;
    role_name: string | null;
    valid_until: string | null;
  }>
) => {
  rolesLoading.set(true);
  rolesError.set(null);

  try {
    const { data, error } = await supabase
      .from('user_roles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roleId)
      .select()
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    // Update the store with the modified role
    const currentRoles = rolesStore.get();
    if (currentRoles) {
      const updatedRoles = currentRoles.map(role =>
        role.id === roleId ? { ...role, ...data, updated_at: new Date().toISOString() } : role
      );
      rolesStore.set(updatedRoles);
    }
    // Invalidate server cache
    await invalidateServerCache();

    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    rolesError.set(errorMessage);
    console.error('Error updating role:', error);
    return { data: null, error: errorMessage };
  } finally {
    rolesLoading.set(false);
  }
};

// Delete a role
export const deleteRole = async (roleId: number) => {
  rolesLoading.set(true);
  rolesError.set(null);

  try {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', roleId);

    if (error) {
      return { success: false, error: error };
    }

    // Remove the role from the store
    const currentRoles = rolesStore.get();
    if (currentRoles) {
      const filteredRoles = currentRoles.filter(role => role.id !== roleId);
      rolesStore.set(filteredRoles);
    }

    // Invalidate server cache
    await invalidateServerCache();

    return { success: true, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    rolesError.set(errorMessage);
    console.error('Error deleting role:', error);
    return { success: false, error: errorMessage };
  } finally {
    rolesLoading.set(false);
  }
};

// Optional: Clear roles store
export const clearRoles = () => {
  rolesStore.set(null);
  rolesError.set(null);
};