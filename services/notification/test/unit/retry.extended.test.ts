/**
 * Notification Service — Retry Logic Extended Tests
 * Tests edge cases: single retry, zero max retries, async fn throwing synchronously
 */
import { describe, it, expect, vi } from 'vitest';
import { withRetry } from '../../src/utils/retry.js';

describe('Retry Utility — Extended Cases 🔄', () => {

  it('should return result on the very first attempt', async () => {
    const fn = vi.fn().mockResolvedValue(42);
    const { result, attempts, error } = await withRetry(fn, 3, 0);
    expect(result).toBe(42);
    expect(attempts).toBe(1);
    expect(error).toBeUndefined();
  });

  it('should respect maxRetries = 1 (no actual retries)', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('fail'));
    const { attempts } = await withRetry(fn, 1, 0);
    expect(attempts).toBe(1);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should retry exactly maxRetries times on continuous failure', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'));
    await withRetry(fn, 4, 0);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it('should return the LAST error message when all retries fail', async () => {
    let attempt = 0;
    const fn = vi.fn().mockImplementation(async () => {
      attempt++;
      throw new Error(`Error attempt ${attempt}`);
    });
    const { error } = await withRetry(fn, 3, 0);
    expect(error).toBe('Error attempt 3');
  });

  it('should succeed on the last allowed attempt', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail 1'))
      .mockRejectedValueOnce(new Error('fail 2'))
      .mockResolvedValue('last-chance');

    const { result, attempts } = await withRetry(fn, 3, 0);
    expect(result).toBe('last-chance');
    expect(attempts).toBe(3);
  });

  it('should return "Unknown error" for errors with no message', async () => {
    const fn = vi.fn().mockRejectedValue({});
    const { error } = await withRetry(fn, 1, 0);
    expect(error).toBe('Unknown error');
  });

  it('should pass the return value of the fn through untouched', async () => {
    const payload = { id: 1, status: 'sent', messageId: '<abc@srv>' };
    const fn = vi.fn().mockResolvedValue(payload);
    const { result } = await withRetry(fn, 3, 0);
    expect(result).toEqual(payload);
  });
});
