export const USER_ROLES = ['USER', 'EDITOR', 'ADMIN'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export function normalizeUserRole(role?: string | null): UserRole {
  return USER_ROLES.find((candidate) => candidate === role) ?? 'USER';
}
