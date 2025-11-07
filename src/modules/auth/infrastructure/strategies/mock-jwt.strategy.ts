/**
 * Mock JWT Token Parser para testes
 *
 * Token format: "user-<role1>-<role2>"
 * Exemplo: "user-admin-moderator"
 *
 * Uso:
 * const user = parseTokenWithRoles('user-admin-moderator');
 * // returns { id: 'mock-user-123', email: 'mock@example.com', roles: ['admin', 'moderator'] }
 */
export function parseTokenWithRoles(token: string): any {
  if (!token || !token.startsWith('user-')) {
    throw new Error('Invalid token format');
  }

  const parts = token.split('-');
  const roles = parts.slice(1);

  return {
    id: 'mock-user-123',
    email: 'mock@example.com',
    roles: roles.length > 0 ? roles : ['user'],
  };
}
