import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { toast } from "react-hot-toast";

const DeleteModal = ({ data, setDeleteModal, setReload }) => {
  const handleDelete = () => {
    fetch(`/api/data/delete/${data._id}`, { // Use 'data' instead of 'Data'
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete data.");
        }
        return res.json();
      })
      .then(() => {
        toast.success("Data deleted successfully!");
        setReload((prev) => !prev); // Trigger re-fetch if needed
        setDeleteModal(false); // Close the modal after successful deletion
      })
      .catch((err) => {
        toast.error("Error deleting data.");
        console.error("Error deleting data:", err);
      });
  };

  return (
    <Dialog open={true} onClose={() => setDeleteModal(false)} fullWidth maxWidth="xs">
      <DialogTitle>Delete Product</DialogTitle> {/* Change title if needed */}
      <DialogContent>
        Are you sure you want to delete this product? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteModal(false)} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteModal;
