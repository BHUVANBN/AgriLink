const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface CartItem {
  id: string;
  productId: string;
  supplierId: string;
  quantity: number;
  snapshot: {
    name: string;
    price: number;
    images: string[];
    category: string;
  };
}

export async function getCart() {
  const res = await fetch(`${API_URL}/marketplace/cart`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  const data = await res.json();
  return data.success ? data.data : [];
}

export async function addToCart(productId: string, quantity: number = 1) {
  const res = await fetch(`${API_URL}/marketplace/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });
  return await res.json();
}

export async function updateCartItem(id: string, quantity: number) {
  const res = await fetch(`${API_URL}/marketplace/cart/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ quantity }),
  });
  return await res.json();
}

export async function removeFromCart(id: string) {
  const res = await fetch(`${API_URL}/marketplace/cart/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return await res.json();
}
