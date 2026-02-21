import { useState, useEffect } from 'react';
import { FALLBACK_PRODUCTS, type Product } from '@/data/products';

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  source: 'api' | 'fallback';
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'api' | 'fallback'>('fallback');

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();
        
        if (data.error) {
          setProducts(FALLBACK_PRODUCTS);
          setError(data.error);
          setSource('fallback');
        } else {
          const apiProducts = data.products || FALLBACK_PRODUCTS;
          setProducts(apiProducts);
          setError(null);
          setSource('api');
        }
      } catch (error) {
        setProducts(FALLBACK_PRODUCTS);
        setError('Failed to fetch products');
        setSource('fallback');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    source
  };
}
