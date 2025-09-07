import React from "react";
import { useCart } from "../../hooks/useCart";

export default function CartPage() {
  const { cartItems, removeFromCart, clearCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <ul className="divide-y border rounded-lg bg-white shadow">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center p-4">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <h2 className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</h2>

            <button
              onClick={() => alert("Checkout prototype — payment not wired")}
              className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Proceed to Checkout
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-2 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}
