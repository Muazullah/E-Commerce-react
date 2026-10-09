import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { ChevronLeft } from 'lucide-react';
import ProductListView from '../components/ProductListView';

// Format slug → readable label: "womens-dresses" → "Womens Dresses"
function formatLabel(slug) {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Skeleton card shown while data is loading
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 animate-pulse">
      <div className="flex-shrink-0 w-32 h-32 sm:w-36 sm:h-36 rounded-xl bg-gray-100" />
      <div className="flex-1 flex flex-col gap-3 justify-center">
        <div className="h-2.5 w-16 bg-gray-100 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-100 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-100 rounded-full" />
        <div className="h-3 w-1/3 bg-gray-100 rounded-full" />
        <div className="flex gap-2 mt-1">
          <div className="h-8 w-28 bg-gray-100 rounded-xl" />
          <div className="h-8 w-24 bg-gray-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const CategoryProduct = () => {
  const { data, fetchAllProducts } = useData();
  const { category } = useParams();
  const navigate = useNavigate();

  // Filter from the already-fetched global data — no separate API call needed
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      // Fetch global data if not loaded yet
      if (!data || data.length === 0) {
        await fetchAllProducts();
      }
      setLoading(false);
    };
    run();
  }, [category]);

  // Re-filter whenever data or category changes
  useEffect(() => {
    if (!data || data.length === 0) return;
    const results = data.filter(
      (p) => p.category?.toLowerCase() === category?.toLowerCase()
    );
    setFiltered(results);
    setLoading(false);
  }, [data, category]);

  const label = formatLabel(category || '');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200
                       hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                       text-gray-600 text-xs font-semibold px-4 py-2 rounded-xl
                       transition-all duration-150"
          >
            <ChevronLeft size={14} />
            Back
          </button>

          {!loading && (
            <p className="text-xs text-gray-400 font-medium">
              <span className="font-bold text-gray-800">{filtered.length}</span>{' '}
              {filtered.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {/* Heading */}
        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
          Category
        </p>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-6">
          Browsing <span className="text-indigo-600">{label}</span>
        </h1>

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-lg font-bold text-gray-800 mb-2">No products found</h2>
            <p className="text-sm text-gray-400 mb-6">
              We couldn't find anything in <span className="font-semibold">"{label}"</span>.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm
                         font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
              Back to Home
            </button>
          </div>
        )}

        {/* Product list */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map((product) => (
              <ProductListView key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryProduct;
