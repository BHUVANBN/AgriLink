const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

export async function addToWishlist(product: any) {
  const res = await fetch(`${API}/marketplace/wishlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      productId: product.id,
      supplierId: product.supplierId,
      snapshot: {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        image: product.image,
        category: product.category,
      }
    }),
  });
  return res.json();
}

export async function removeFromWishlist(productId: string) {
  const res = await fetch(`${API}/marketplace/wishlist/${productId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return res.json();
}

export async function getWishlist() {
  const res = await fetch(`${API}/marketplace/wishlist`, {
    credentials: 'include',
  });
  return res.json();
}

export async function checkWishlist(productId: string) {
  const res = await fetch(`${API}/marketplace/wishlist/check/${productId}`, {
    credentials: 'include',
  });
  return res.json();
}
