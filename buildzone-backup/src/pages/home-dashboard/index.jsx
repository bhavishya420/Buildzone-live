// src/pages/home-dashboard/index.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useCart } from '../../hooks/useCart';
import { useLanguage } from '../../hooks/useLanguage';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeDashboard() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { t } = useLanguage();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, description, price, category, image_url')
        .order('created_at', { ascending: false })
        .limit(20);
      if (error) throw error;
      setProducts(data || []);
    } catch (e) {
      console.error('Failed to load products', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function handleAddToCart(p) {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      quantity: 1,
      image_url: p.image_url || null,
      category: p.category || ''
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Header creditData={{ available: 0, used: 0, currency: '₹' }} />
      <main className="pb-20">
        <div className="px-4 py-4 border-b border-border flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">BuildZone</h1>
            <p className="text-sm text-muted-foreground">{t('welcome_message') || 'Find building supplies & sanitaryware'}</p>
          </div>
        </div>

        <div className="px-4 py-6">
          {loading && <div className="text-center py-12">Loading products…</div>}
          {!loading && products.length === 0 && <div className="text-center text-muted-foreground py-12">No products found.</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-surface rounded-lg p-4 border border-border flex flex-col">
                <div className="w-full h-40 bg-muted rounded overflow-hidden mb-3 flex items-center justify-center" style={{ minHeight: 120 }}>
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="text-muted-foreground">No image</div>}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground truncate">{p.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{p.category}</p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div><div className="text-lg font-bold">₹{Number(p.price || 0).toFixed(2)}</div></div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/product/${p.id}`)} className="px-3 py-2 rounded-md border border-border hover:bg-muted">View</button>
                    <Button onClick={() => handleAddToCart(p)}>Add</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
