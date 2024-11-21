import React, { useState, useEffect } from "react";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/data/products");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          // Extract all products from the `data` array
          const allProducts = data.data.flatMap((item) => item.products);
          setProducts(allProducts);
        } else {
          throw new Error("Failed to fetch products.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && products.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Unit Price</th>
              <th className="border border-gray-300 px-4 py-2">Tax</th>
              <th className="border border-gray-300 px-4 py-2">Price with Tax</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{product.name}</td>
                <td className="border border-gray-300 px-4 py-2">{product.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{product.unitPrice.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{product.tax.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{product.priceWithTax.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && products.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
};

export default Products;
