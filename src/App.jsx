// src/App.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  // State for products and loading/error status
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for pagination
  const [page, setPage] = useState(() => parseInt(searchParams.get('page') || '1', 10));
  const [productsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);

  // State for filters and sorting
  const [filters, setFilters] = useState({
    name: searchParams.get('name') || '',
    category: searchParams.get('category') || 'all',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    stockStatus: searchParams.get('stockStatus') || 'all'
  });
  const [sortBy, setSortBy] = useState({
    column: searchParams.get('sortBy') || 'created_at',
    order: searchParams.get('order') || 'asc'
  });
  const [categories, setCategories] = useState([]);

  const clearFilters = () => {
    setFilters({
      name: '', category: 'all', minPrice: '', maxPrice: '', stockStatus: 'all'
    });
    setSortBy({ column: 'created_at', order: 'asc' });
    setPage(1); // Reset to first page
  };

  const fetchProducts = useCallback(async (pageToFetch) => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('products').select(`*, categories ( name )`, { count: 'exact' });

      // --- FILTERING LOGIC ---
      if (filters.name) {
        query = query.ilike('name', `%${filters.name}%`);
      }
      if (filters.category !== 'all') {
        query = query.eq('category_id', filters.category);
      }
      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice);
      }
      if (filters.stockStatus === 'in_stock') {
        query = query.gt('stock_quantity', 0);
      }
      if (filters.stockStatus === 'out_of_stock') {
        query = query.eq('stock_quantity', 0);
      }

      // --- SORTING LOGIC ---
      query = query.order(sortBy.column, { ascending: sortBy.order === 'asc' });

      // --- PAGINATION LOGIC ---
      const from = (pageToFetch - 1) * productsPerPage;
      const to = from + productsPerPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      setProducts(data);
      setTotalProducts(count);

    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [productsPerPage, filters, sortBy]);

  const prevFilters = useRef(filters);
  const prevSortBy = useRef(sortBy);

  // useEffect for fetching categories
  useEffect(() => {
    const fetchCategories = async () => {
        const { data, error } = await supabase.from('categories').select('id, name');
        if (!error) {
            setCategories(data);
        }
    };
    fetchCategories();
  }, []);

  // Consolidated useEffect for all data fetching
  useEffect(() => {
    const filtersChanged = JSON.stringify(prevFilters.current) !== JSON.stringify(filters);
    const sortChanged = JSON.stringify(prevSortBy.current) !== JSON.stringify(sortBy);

    if (filtersChanged || sortChanged) {
      // If filters or sorting have changed, we need to reset the page to 1.
      // If we're not on page 1, setting it will trigger this effect to run again.
      // On that subsequent run, filtersChanged will be false, and the `else`
      // block will execute, fetching the data for page 1.
      if (page !== 1) {
        setPage(1);
      } else {
        // If we are already on page 1, a page state change won't trigger a re-fetch.
        // We need to fetch the data manually.
        fetchProducts(1);
      }
    } else {
      // This block will run for simple page changes, or after a filter change
      // has reset the page to 1.
      fetchProducts(page);
    }

    // We must update the refs *after* the logic, so that on the next
    // render, we are comparing against the values from *this* render.
    prevFilters.current = filters;
    prevSortBy.current = sortBy;
  }, [page, filters, sortBy, fetchProducts]);

  // useEffect for syncing state with URL
  useEffect(() => {
    const params = new URLSearchParams();
    params.set('page', page);
    if (filters.name) params.set('name', filters.name);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.minPrice) params.set('minPrice', filters.minPrice);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.stockStatus !== 'all') params.set('stockStatus', filters.stockStatus);
    params.set('sortBy', sortBy.column);
    params.set('order', sortBy.order);
    setSearchParams(params);
  }, [page, filters, sortBy, setSearchParams]);


  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">
          Product Inventory Dashboard
        </h1>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
          clearFilters={clearFilters}
        />
        
        <div className="mt-6">
          {loading && <p className="text-center text-gray-500">Loading products...</p>}
          {error && <p className="text-red-500 bg-red-100 p-4 rounded-md text-center">Error: {error}</p>}
          {!loading && !error && products.length === 0 && <p className="text-center text-gray-500">No products found.</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Pagination
            page={page}
            setPage={setPage}
            totalProducts={totalProducts}
            productsPerPage={productsPerPage}
          />
        </div>
      </div>
    </div>
  );
}

export default App;