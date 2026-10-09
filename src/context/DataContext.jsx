import { createContext, useState, useContext, useCallback, useMemo } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX 1: useCallback gives a stable reference — no more scroll jump from re-renders
  // FIX 2: ?limit=0 fetches ALL products (default API only returns 30)
  const fetchAllProducts = useCallback(async () => {
    if (data.length > 0) return; // prevent duplicate fetch if already loaded

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://dummyjson.com/products?limit=0");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const productData = await response.json();
      setData(productData.products);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [data.length]);

  // FIX 3: filter out undefined/null — some products have no brand field
  const getUniqueValues = (arr, property) => {
    const values = arr?.map((item) => item[property]).filter(Boolean);
    return ["All", ...new Set(values)];
  };

  // FIX 4: useMemo — only recalculate when data actually changes
  const categoryOnlyData = useMemo(() => getUniqueValues(data, "category"), [data]);
  const brandOnlyData = useMemo(() => getUniqueValues(data, "brand"), [data]);

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchAllProducts,
        categoryOnlyData,
        brandOnlyData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

export default DataProvider;
