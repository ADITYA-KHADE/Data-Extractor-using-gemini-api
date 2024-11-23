import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../Store/Slice";

const Customers = () => {
  const dispatch = useDispatch();

  // Extract Redux state for customers
  const { customers, status, error } = useSelector((state) => state.data);

  useEffect(() => {
    // Fetch all data if not already fetched
    if (status === "idle") {
      dispatch(fetchAllData());
    }
  }, [dispatch, status]);

  // Handle loading, error, and no customers state
  if (status === "loading") {
    return <p className="text-gray-500">Loading customers...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500">{error}</p>;
  }

  if (!customers.length) {
    return <p className="text-gray-500">No customers found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-slate-300 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Customers</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Company Name</th>
            <th className="border border-gray-300 px-4 py-2">Phone Number</th>
            <th className="border border-gray-300 px-4 py-2">Total Invoices</th>
            <th className="border border-gray-300 px-4 py-2">Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((record) =>
            record.customers.map((customer, index) => (
              <tr key={`${record._id}-${index}`} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {customer.customerName || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.companyName || "Unknown"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.phoneNumber || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.totalAmount?.toFixed(2) || "0.00"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.address || "N/A"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
