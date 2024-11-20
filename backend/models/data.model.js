const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true },
    customerName: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    tax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  { _id: false } 
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    tax: { type: Number, required: true },
    priceWithTax: { type: Number, required: true },
    discount: { type: Number },
  },
  { _id: false } 
);

const customerSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    totalPurchaseAmount: { type: Number, required: true },
    email: { type: String },
    address: { type: String },
  },
  { _id: false }
);

const receiptSchema = new mongoose.Schema(
  {
    invoices: [itemSchema], 
    products: [productSchema], 
    customers: [customerSchema], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Receipt", receiptSchema);
