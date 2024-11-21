const Receipt = require("../models/data.model");

const deleteInvoices = async (req, res) => {
  const { id } = req.params;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "invoices._id": id },
      { $pull: { invoices: { _id: id } } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProducts = async (req, res) => {
  const { id } = req.params;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "products._id": id },
      { $pull: { products: { _id: id } } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCustomers = async (req, res) => {
  const { id } = req.params;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "customers._id": id },
      { $pull: { customers: { _id: id } } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  deleteInvoices,
  deleteProducts,
  deleteCustomers,
};
