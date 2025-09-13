// lib/roles-cache.ts
import NodeCache from 'node-cache';
import { type Database } from '../../../database.types';

type UserRole = Database['public']['Tables']['user_roles']['Row'];

// Initialize cache with 1-hour TTL
const rolesCache = new NodeCache({ stdTTL: 3600 });

export const rolesCacheUtils = {
  // Get roles for a user from cache
  get: (userId: string): UserRole[] | undefined => {
    const cacheKey = `roles_${userId}`;
    return rolesCache.get(cacheKey) as UserRole[];
  },

  // Set roles for a user in cache
  set: (userId: string, roles: UserRole[]): void => {
    const cacheKey = `roles_${userId}`;
    rolesCache.set(cacheKey, roles);
    console.log(`Roles cached for user: ${userId}`);
  },

  // Invalidate cache for a specific user
  invalidate: (userId: string): void => {
    const cacheKey = `roles_${userId}`;
    rolesCache.del(cacheKey);
    console.log(`Cache invalidated for user: ${userId}`);
  },

  // Invalidate cache for all users (use cautiously)
  invalidateAll: (): void => {
    rolesCache.flushAll();
    console.log('All roles cache invalidated');
  },

  // Get cache stats (for debugging/monitoring)
  getStats: () => {
    return rolesCache.getStats();
  }
};