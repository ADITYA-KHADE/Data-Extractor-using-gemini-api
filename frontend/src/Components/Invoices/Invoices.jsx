import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllData } from "../../Store/Slice";

const Invoices = () => {
  const dispatch = useDispatch();

  // Extract the Redux state
  const { invoices, status, error } = useSelector((state) => state.data);

  useEffect(() => {
    // Fetch all data on component mount
    if (status === "idle") {
      dispatch(fetchAllData());
    }
  }, [dispatch, status]);

  // Loading, error, and empty state handling
  if (status === "loading") {
    return <p className="text-gray-500">Loading...</p>;
  }

  if (status === "failed") {
    return <p className="text-red-500">{error}</p>;
  }

  if (!invoices.length) {
    return <p className="text-gray-500">No invoices found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoices</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Serial Number</th>
            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
            <th className="border border-gray-300 px-4 py-2">Product Names</th>
            <th className="border border-gray-300 px-4 py-2">Quantity</th>
            <th className="border border-gray-300 px-4 py-2">Tax</th>
            <th className="border border-gray-300 px-4 py-2">Total Amount</th>
            <th className="border border-gray-300 px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((item) =>
            item.invoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.serialNumber}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.customerName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.productNames?.join(", ") || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.totalquantity || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.totaltax?.toFixed(2) || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.totalAmount || "N/A"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {invoice.date
                    ? new Date(invoice.date).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Invoices;
