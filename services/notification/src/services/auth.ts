import { ApiResponse, UserDto } from '@agrilink/types';

const AUTH_URL = process.env.INTERNAL_AUTH_URL ?? 'http://auth:4001';

export async function getUsersForBroadcast(role: 'farmer' | 'supplier' | 'all'): Promise<UserDto[]> {
  try {
    const search = role === 'all' ? '' : `?role=${role}`;
    // Fetch from internal admin endpoint (requires service token or internal trust)
    // For simplicity, I'll use a direct internal fetch.
    const res = await fetch(`${AUTH_URL}/auth/admin/users${search}&limit=1000`, {
       headers: { 'X-Internal-Secret': process.env.INTERNAL_SECRET ?? 'agrilink-secret-2026' }
    });
    const data = await res.json() as ApiResponse<{ users: UserDto[] }>;
    return data.data?.users ?? [];
  } catch (err) {
    console.error('[auth-proxy] Failed to fetch users for broadcast:', err);
    return [];
  }
}
