// src/components/ProductSearch.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useCart } from "../hooks/useCart";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    async function search() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("name", `%${query}%`);

      if (error) {
        console.error("Search error:", error);
      } else {
        setResults(data || []);
      }
    }

    search();
  }, [query]);

  return (
    <div className="mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full border rounded-lg px-4 py-2 mb-3"
      />

      {results.length > 0 && (
        <ul className="border rounded-lg p-3 bg-white shadow">
          {results.map((p) => (
            <li
              key={p.id}
              className="py-2 border-b last:border-none flex justify-between items-center"
            >
              <div>
                <strong>{p.name}</strong> — ₹{p.price}
              </div>
              <button
                onClick={() =>
                  addToCart({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    quantity: 1,
                  })
                }
                className="ml-3 bg-primary text-white px-3 py-1 rounded hover:bg-primary/90"
              >
                Add
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
