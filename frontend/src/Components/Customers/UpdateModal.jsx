import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";
import { toast } from "react-hot-toast";

const UpdateModal = ({ data, setUpdateModal }) => {
  // Create a state for updated product data
  const [updatedData, setUpdatedData] = useState(data);

  useEffect(() => {
    // When data changes, update the state with the new data
    setUpdatedData(data);
  }, [data]);

  // Handle change in the form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle updating the product
  const handleUpdate = () => {
    fetch(`/api/products/${updatedData._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update product.");
        }
        return res.json();
      })
      .then(() => {
        toast.success("Product updated successfully!");
        setUpdateModal(false); // Close the modal after update
      })
      .catch((err) => {
        toast.error("Error updating product.");
        console.error("Error updating product:", err);
      });
  };

  return (
    <Dialog open={true} onClose={() => setUpdateModal(false)} fullWidth maxWidth="sm">
      <DialogTitle>Update Product</DialogTitle>
      <DialogContent>
        <TextField
          label="Product Name"
          name="productname"
          value={updatedData.productname || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Quantity"
          name="quantity"
          value={updatedData.quantity || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Unit Price"
          name="unitPrice"
          value={updatedData.unitPrice || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tax"
          name="tax"
          value={updatedData.tax || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Price with Tax"
          name="priceWithTax"
          value={updatedData.priceWithTax || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
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
