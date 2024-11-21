import React, { useState, useEffect } from "react";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/data/customers");
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (data.success) {
          // Extract all customers from the `data` array
          const allCustomers = data.data.flatMap((item) => item.customers);
          setCustomers(allCustomers);
        } else {
          throw new Error("Failed to fetch customers.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Customers</h2>
      {isLoading && <p className="text-gray-500">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && customers.length > 0 && (
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Customer Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone Number</th>
              <th className="border border-gray-300 px-4 py-2">Total Purchase Amount</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{customer.customerName}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.phoneNumber}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.totalPurchaseAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!isLoading && customers.length === 0 && (
        <p className="text-gray-500">No customers found.</p>
      )}
    </div>
  );
};

export default Customers;
