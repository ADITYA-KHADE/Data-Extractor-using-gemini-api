import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../Store/Slice"; // Adjust the path as needed

const Products = () => {
  const dispatch = useDispatch();

  // Extract the Redux state
  const { products, status, error } = useSelector((state) => state.data);

  useEffect(() => {
    // Fetch all data on component mount if not already fetched
    if (status === "idle") {
      dispatch(fetchAllData());
    }
  }, [dispatch, status]);

  // Handle loading, error, and no products state
  if (status === "loading") {
    return <p className="text-gray-500">Loading products...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500">{error}</p>;
  }

  if (!products.length) {
    return <p className="text-gray-500">No products found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-50 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Products</h2>
      {products.map((record) => (
        <div key={record._id} className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700">
            Record ID: {record._id}
          </h3>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
                <th className="border border-gray-300 px-4 py-2">Unit Price</th>
                <th className="border border-gray-300 px-4 py-2">Tax</th>
                <th className="border border-gray-300 px-4 py-2">
                  Price With Tax
                </th>
              </tr>
            </thead>
            <tbody>
              {record.products.map((product, idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2">
                    {product.productname || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.quantity || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.unitPrice?.toFixed(2) || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.tax?.toFixed(2) || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {product.priceWithTax?.toFixed(2) || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default Products;
