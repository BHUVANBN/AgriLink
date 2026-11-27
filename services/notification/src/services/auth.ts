import type { UserDto } from '@agrilink/types';

const AUTH_URL = process.env.INTERNAL_AUTH_URL ?? 'http://localhost:4001';
const PAGE_SIZE = 500;

/**
 * Streams users for a broadcast page by page (cursor pagination) so memory
 * stays flat no matter how many users the platform has.
 */
export async function* getUsersForBroadcast(
  role: 'farmer' | 'supplier' | 'all',
): AsyncGenerator<UserDto[]> {
  let cursor: string | null = null;
  do {
    const params = new URLSearchParams({ role, limit: String(PAGE_SIZE) });
    if (cursor) params.set('cursor', cursor);
    try {
      const res = await fetch(`${AUTH_URL}/auth/internal/users?${params}`, {
        headers: { 'x-internal-key': process.env.INTERNAL_API_KEY ?? '' },
        signal: AbortSignal.timeout(15_000),
      });
      if (!res.ok) throw new Error(`auth responded ${res.status}`);
      const json = (await res.json()) as { data?: { users: UserDto[]; nextCursor: string | null } };
      const users = json.data?.users ?? [];
      if (users.length) yield users;
      cursor = json.data?.nextCursor ?? null;
    } catch (err) {
      console.error('[auth-proxy] Failed to fetch users for broadcast:', err);
      return;
    }
  } while (cursor);
}
