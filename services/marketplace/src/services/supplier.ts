/**
 * Marketplace → Supplier service client.
 * Prices, stock and tax config always come from the supplier service,
 * never from the browser.
 */

const SUPPLIER_URL = process.env.SUPPLIER_SERVICE_URL ?? 'http://localhost:4003';

export interface QuoteLine {
  productId: string;
  quantity: number;
  ok: boolean;
  reason?: 'NOT_FOUND' | 'UNAVAILABLE' | 'SUPPLIER_UNVERIFIED' | 'OUT_OF_STOCK';
  available?: number;
  name?: string;
  unit?: string;
  image?: string | null;
  supplierId?: string;
  pricePaise?: number;
  totalPaise?: number;
}

export interface QuoteSupplier {
  id: string;
  userId: string;
  companyName: string;
  taxRate: number;
  taxInclusive: boolean;
}

export interface Quote {
  lines: QuoteLine[];
  suppliers: Record<string, QuoteSupplier>;
}

export class SupplierUnavailableError extends Error {}

export async function getQuote(items: { productId: string; quantity: number }[]): Promise<Quote> {
  let res: Response;
  try {
    res = await fetch(`${SUPPLIER_URL}/supplier/products/public/quote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err: any) {
    throw new SupplierUnavailableError(err?.message ?? 'supplier service unreachable');
  }
  if (!res.ok) throw new SupplierUnavailableError(`supplier service responded ${res.status}`);
  const json = (await res.json()) as { success: boolean; data: Quote };
  if (!json.success || !json.data) throw new SupplierUnavailableError('invalid quote response');
  return json.data;
}

export interface CatalogueProduct {
  id: string;
  supplierId: string;
  name: string;
  price: number;
  mrp?: number;
  unit?: string;
  category?: string;
  images?: string[];
  stockQuantity: number;
  supplier?: { userId?: string; companyName?: string; kycStatus?: string } | null;
}

/** Active product from the public catalogue, or null if missing/inactive. */
export async function getProduct(productId: string): Promise<CatalogueProduct | null> {
  try {
    const res = await fetch(`${SUPPLIER_URL}/supplier/products/public/${encodeURIComponent(productId)}`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { success: boolean; data: CatalogueProduct };
    return json.success ? json.data : null;
  } catch {
    return null;
  }
}
