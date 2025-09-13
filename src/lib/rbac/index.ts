/**
 * @file /src/lib/rbac/index.ts
 * @description enforces role based access check 
 */
import type { Database } from "../../../database.types.ts";
type UserRole = Database['public']['Tables']["user_roles"]["Row"]

type AccessProfiles = Record<string, number[]>;

export const accessProfiles: AccessProfiles = {
    superadmin: [7],
    admin: [5, 7],
    contributor: [5, 7, 6],
    programStart: [2, 5, 7],
    premium: [3,4,5,7]
}


/**
 * Checks if the user has the required roles.
 * @param userRoles - The user's roles from Astro.locals.
 * @param permittedRoles - Array of permitted role IDs.
 * @returns true if the user has access, false otherwise.
 */
export function hasAccess(
  userRoles: App.Locals['userRoles'],
  permittedRoles: number[]
): boolean {
  if (!userRoles || userRoles.length === 0) return false;

  const now = new Date();

  // Check if the user has any of the permitted roles
  return userRoles.some((role: UserRole) => {
    // Check if the role is permitted
    const isPermitted = permittedRoles.includes(role.role_id);

    // Check if the role is still valid
    const isValid = role.valid_until === null || new Date(role.valid_until) >= now;

    return isPermitted && isValid;
  });
}
