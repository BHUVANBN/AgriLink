/**
 * Marketplace Service - Internal call to Supplier service 🛡️
 */

const SUPPLIER_URL = process.env.SUPPLIER_SERVICE_URL ?? 'http://localhost:4003';

export async function getSupplierTaxConfig(supplierId: string) {
  try {
    const res = await fetch(`${SUPPLIER_URL}/supplier/public/supplier/${supplierId}`);
    if (!res.ok) return { taxRate: 0.18, taxInclusive: true };

    const responseData = await res.json() as { success: boolean; data: any };
    if (!responseData.success || !responseData.data) return { taxRate: 0.18, taxInclusive: true };

    return {
      taxRate: responseData.data.taxRate ?? 0.18,
      taxInclusive: responseData.data.taxInclusive ?? true
    };
  } catch (err) {
    console.error(`Failed to fetch tax config for supplier ${supplierId}`, err);
    return { taxRate: 0.18, taxInclusive: true };
  }
}
