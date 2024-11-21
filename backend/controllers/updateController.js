const Receipt = require("../models/data.model");

const updateInvoices = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "invoices._id": id },
      { $set: { "invoices.$": updateData } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Invoice not found" });

    if (updateData.productName) {
      await updateRelatedProducts(receipt, updateData.productName);
    }

    if (updateData.customerName) {
      await updateRelatedCustomers(receipt, updateData.customerName);
    }

    res.status(200).json({
      message: "Invoice updated successfully with related updates.",
      updatedInvoice: receipt.invoices.find((invoice) => invoice._id.toString() === id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateProducts = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "products._id": id },
      { $set: { "products.$": updateData } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Product not found" });

    await updateRelatedInvoicesForProducts(receipt, id, updateData);

    res.status(200).json({
      message: "Product updated successfully with related updates.",
      updatedProduct: receipt.products.find((product) => product._id.toString() === id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCustomers = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const receipt = await Receipt.findOneAndUpdate(
      { "customers._id": id },
      { $set: { "customers.$": updateData } },
      { new: true }
    );
    if (!receipt) return res.status(404).json({ message: "Customer not found" });

    await updateRelatedInvoicesForCustomers(receipt, id, updateData);

    res.status(200).json({
      message: "Customer updated successfully with related updates.",
      updatedCustomer: receipt.customers.find((customer) => customer._id.toString() === id),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateRelatedInvoicesForProducts = async (receipt, productId, updatedProduct) => {
  const product = receipt.products.find((product) => product._id.toString() === productId);
  if (!product) return;

  const updatedProductName = updatedProduct.name || product.name;
  await Receipt.updateMany(
    { "invoices.productName": { $regex: product.name, $options: "i" } },
    { $set: { "invoices.$[elem].productName": updatedProductName } },
    { arrayFilters: [{ "elem.productName": { $regex: product.name, $options: "i" } }] }
  );
};

const updateRelatedInvoicesForCustomers = async (receipt, customerId, updatedCustomer) => {
  const customer = receipt.customers.find((customer) => customer._id.toString() === customerId);
  if (!customer) return;

  const updatedCustomerName = updatedCustomer.customerName || customer.customerName;
  await Receipt.updateMany(
    { "invoices.customerName": { $regex: customer.customerName, $options: "i" } },
    { $set: { "invoices.$[elem].customerName": updatedCustomerName } },
    { arrayFilters: [{ "elem.customerName": { $regex: customer.customerName, $options: "i" } }] }
  );
};

module.exports = {
  updateInvoices,
  updateProducts,
  updateCustomers,
};
