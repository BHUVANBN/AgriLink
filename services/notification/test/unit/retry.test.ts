import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../../src/utils/retry.js';

describe('Notification Service - Retry Logic 📬', () => {
  it('should succeed immediately without retries', async () => {
    const fn = vi.fn().mockResolvedValue('success');
    const { result, attempts, error } = await withRetry(fn);

    expect(result).toBe('success');
    expect(attempts).toBe(1);
    expect(error).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry and eventually succeed', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail-1'))
      .mockRejectedValueOnce(new Error('fail-2'))
      .mockResolvedValue('finally-success');

    const { result, attempts, error } = await withRetry(fn, 3, 10); // 10ms delay

    expect(result).toBe('finally-success');
    expect(attempts).toBe(3);
    expect(error).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it('should fail after max retries', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always-fails'));
    const { result, attempts, error } = await withRetry(fn, 3, 10);

    expect(result).toBeUndefined();
    expect(attempts).toBe(3);
    expect(error).toBe('always-fails');
    expect(fn).toHaveBeenCalledTimes(3);
  });
});
