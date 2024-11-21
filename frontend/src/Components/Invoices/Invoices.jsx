import React, { useState, useEffect } from "react";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoices = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/data/invoices");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          // Extract all invoices from the `data` array
          const allInvoices = data.data.flatMap((item) => item.invoices);
          setInvoices(allInvoices);
        } else {
          throw new Error("Failed to fetch invoices.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Invoices</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && invoices.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Serial Number</th>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Product Name</th>
              <th className="border border-gray-300 px-4 py-2">Quantity</th>
              <th className="border border-gray-300 px-4 py-2">Tax</th>
              <th className="border border-gray-300 px-4 py-2">Total Amount</th>
              <th className="border border-gray-300 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{invoice.serialNumber}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.customerName}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.productName}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.quantity}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.tax.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{invoice.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(invoice.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && invoices.length === 0 && (
        <p className="text-gray-500">No invoices found.</p>
      )}
    </div>
  );
};

export default Invoices;
