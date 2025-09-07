// src/components/ProductSearch.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function ProductSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  async function doSearch(query) {
    if (!query || query.trim().length < 1) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      setErr(null);

      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(30);

      if (error) throw error;
      setResults(data || []);
    } catch (e) {
      console.error('search error', e);
      setErr(e.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === 'Enter') doSearch(q);
  }

  return (
    <div style={{ maxWidth: 900, margin: '16px auto', padding: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search products (type and press Enter)"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <button onClick={() => doSearch(q)} style={{ padding: '8px 12px' }}>
          Search
        </button>
      </div>

      {loading && <div style={{ marginTop: 8 }}>Searching...</div>}
      {err && <div style={{ marginTop: 8, color: 'red' }}>{err}</div>}

      <ul style={{ marginTop: 12, listStyle: 'none', padding: 0 }}>
        {results.map((r) => (
          <li key={r.id} style={{ padding: 12, borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 700 }}>
              {r.name} <small style={{ color:'#666', marginLeft:8 }}>{r.category}</small>
            </div>
            <div style={{ color: '#444' }}>{r.description}</div>
            <div style={{ marginTop: 6, fontWeight:600 }}>₹{r.price}</div>
          </li>
        ))}
        {results.length === 0 && !loading && <div style={{ marginTop: 12 }}>No results</div>}
      </ul>
    </div>
  );
}
