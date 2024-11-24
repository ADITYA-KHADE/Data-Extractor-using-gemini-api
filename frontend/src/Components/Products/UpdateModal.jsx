import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchAllData } from "../../Store/Slice";

const UpdateModal = ({ data, setUpdateModal }) => {
  const dispatch = useDispatch();
  const [updatedProducts, setUpdatedProducts] = useState([]);
  const [invoiceUpdates, setInvoiceUpdates] = useState({});
  const [customerUpdates, setCustomerUpdates] = useState({});

  useEffect(() => {
    if (data) {
      setUpdatedProducts(data.products || []);
      setInvoiceUpdates(data.invoices|| {});
      setCustomerUpdates(data.customers || {});
    }
  }, [data]);

  const handleProductChange = (index, field, value) => {
    const updated = [...updatedProducts];
    updated[index] = { ...updated[index], [field]: value };
    setUpdatedProducts(updated);

    // Update invoice and customer fields dynamically
    const productNames = updated.map((p) => p.productname);
    const totalQuantity = updated.reduce((acc, p) => acc + (p.quantity || 0), 0);
    const totalTax = updated.reduce((acc, p) => acc + (p.tax || 0), 0);
    const totalAmount = updated.reduce(
      (acc, p) => acc + (p.priceWithTax || 0),
      0
    );

    setInvoiceUpdates((prev) => ({
      ...prev,
      productNames,
      totalquantity: totalQuantity,
      totaltax: totalTax,
      totalAmount,
    }));

    setCustomerUpdates((prev) => ({
      ...prev,
      totalAmount,
    }));
  };

  const handleUpdate = () => {
    const payload = {
      products: updatedProducts,
      invoices: [invoiceUpdates],
      customers: [customerUpdates],
    };

    fetch(`/api/data/updatedata/${data._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update data.");
        }
        return res.json();
      })
      .then((response) => {
        toast.success(response.message || "Data updated successfully!");
        dispatch(fetchAllData()); // Refresh Redux state
        setUpdateModal(false); // Close modal
      })
      .catch((err) => {
        toast.error("Error updating data.");
        console.error(err);
      });
  };

  return (
    <Dialog open={true} onClose={() => setUpdateModal(false)} fullWidth maxWidth="md">
      <DialogTitle>Update Products</DialogTitle>
      <DialogContent>
        {updatedProducts.map((product, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            <h3 className="text-lg font-semibold mb-2">
              Product {index + 1}: {product.productname || "Unnamed Product"}
            </h3>
            <TextField
              label="Product Name"
              name="productname"
              value={product.productname || ""}
              onChange={(e) => handleProductChange(index, "productname", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Quantity"
              name="quantity"
              value={product.quantity || ""}
              onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Unit Price"
              name="unitPrice"
              value={product.unitPrice || ""}
              onChange={(e) => handleProductChange(index, "unitPrice", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tax"
              name="tax"
              value={product.tax || ""}
              onChange={(e) => handleProductChange(index, "tax", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Price with Tax"
              name="priceWithTax"
              value={product.priceWithTax || ""}
              onChange={(e) => handleProductChange(index, "priceWithTax", e.target.value)}
              fullWidth
              margin="normal"
            />
          </div>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setUpdateModal(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="primary">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateModal;
