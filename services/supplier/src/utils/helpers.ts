/**
 * Auth Service — Supplier slugify utility (extracted from supplier service for reuse)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .slice(0, 100);
}

/**
 * Generate a SKU for a product
 * Format: SUP12345-1711234567890
 */
export function generateSku(supplierId: string): string {
  return `${supplierId.slice(0, 8).toUpperCase()}-${Date.now()}`;
}

/**
 * Calculate the final price after discount percentage
 */
export function applyDiscount(priceInPaise: number, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) throw new Error('Discount must be 0–100%');
  return Math.floor(priceInPaise * (1 - discountPercent / 100));
}

/**
 * Calculate stock status label
 */
export function getStockStatus(quantity: number, reorderThreshold: number): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (quantity === 0) return 'out_of_stock';
  if (quantity <= reorderThreshold) return 'low_stock';
  return 'in_stock';
}

/**
 * Validate GST number format (Indian standard: 2 digits + 10 chars PAN + 1 digit + 1 char + 1 char)
 */
export function isValidGstNumber(gst: string): boolean {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

/**
 * Format paise (integer) to INR string
 */
export function formatPaiseToRupees(paise: number): string {
  return `₹${(paise / 100).toFixed(2)}`;
}

/**
 * Convert rupees string to paise integer
 */
export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
