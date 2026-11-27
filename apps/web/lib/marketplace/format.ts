/**
 * Shared display helpers for marketplace data.
 *
 * Order items created by the server store name/image at the top level;
 * older orders and cart items keep them inside `snapshot`. These helpers read
 * both shapes so no page crashes on either.
 */

export function inr(paise: number | null | undefined): string {
  const rupees = (paise ?? 0) / 100;
  return rupees.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 });
}

export function itemName(item: any): string {
  return item?.name ?? item?.snapshot?.name ?? 'Product';
}

export function itemImage(item: any): string | null {
  return item?.image ?? item?.snapshot?.image ?? item?.snapshot?.images?.[0] ?? item?.images?.[0] ?? null;
}

export function itemPrice(item: any): number {
  return item?.pricePaise ?? item?.snapshot?.price ?? item?.price ?? 0;
}
