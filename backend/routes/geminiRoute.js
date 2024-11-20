const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); 
const { getInvoices, getProducts, getCustomers, uploadfile } = require("../controllers/dataController");

const router = express.Router();

router.get("/invoices", getInvoices);
router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.post("/uploadfile", upload.single("file"), uploadfile);

module.exports = router;
