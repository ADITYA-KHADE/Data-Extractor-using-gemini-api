const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "backend/uploads/" });

const {
  getInvoices,
  getProducts,
  getCustomers,
  uploadfile,
} = require("../controllers/dataController");

const {
  updateInvoices,
  updateProducts,
  updateCustomers,
} = require("../controllers/updateController");

const {
  deleteInvoices,
  deleteProducts,
  deleteCustomers,
} = require("../controllers/deleteController");

const router = express.Router();

router
  .get("/invoices", getInvoices)
  .put("/invoices/:id", updateInvoices)
  .delete("/invoices/:id", deleteInvoices);

router
  .get("/products", getProducts)
  .put("/products/:id", updateProducts)
  .delete("/products/:id", deleteProducts);

router
  .get("/customers", getCustomers)
  .put("/customers/:id", updateCustomers)
  .delete("/customers/:id", deleteCustomers);

router.post("/uploadfile", upload.single("file"), uploadfile);

module.exports = router;
