// src/components/DataDisplay.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchData } from '../Store/Slice1';

const DataDisplay = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.data);

  console.log(data)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchData());
    }
  }, [status, dispatch]);

  if (status === 'loading') return <p>Loading...</p>;
  if (status === 'failed') return <p>Error: {error}</p>;

  return (
    <div>
      {data.map((entry) => (
        <div key={entry._id} className="p-4 border mb-4">
          <h3 className="font-bold">Customer: {entry.customers[0]?.customerName}</h3>
          <p>Invoices:</p>
          <ul>
            {entry.invoices.map((invoice, idx) => (
              <li key={idx}>
                <strong>Serial:</strong> {invoice.serialNumber}, <strong>Amount:</strong> {invoice.totalAmount}
              </li>
            ))}
          </ul>
          <p>Products:</p>
          <ul>
            {entry.products.map((product, idx) => (
              <li key={idx}>
                <strong>Name:</strong> {product.productname}, <strong>Quantity:</strong> {product.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DataDisplay;
