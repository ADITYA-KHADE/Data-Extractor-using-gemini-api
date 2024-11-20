const Receipt = require("../models/data.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const fs = require("fs");
const path = require("path");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const fileManager = new GoogleAIFileManager(process.env.API_KEY);

const getInvoices = async (req, res) => {
  // Logic for fetching invoices goes here
};

const getProducts = async (req, res) => {
  // Logic for fetching products goes here
};

const getCustomers = async (req, res) => {
  // Logic for fetching customers goes here
};

const uploadfile = async (req, res) => {
  try {
    // Check if a file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const displayName = req.file.originalname;

    // Upload the file to Google AI FileManager
    const uploadResponse = await fileManager.uploadFile(filePath, {
      mimeType,
      displayName,
    });

    console.log(
      `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`
    );

    // Determine the type of processing based on the file type
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await retryAsync(
      async () =>
        await model.generateContent([
          {
            fileData: {
              fileUri: uploadResponse.file.uri,
              mimeType: uploadResponse.file.mimeType,
            },
          },
          {
            text: `
            Extract the data from the document and structure it into three sections: 
            
            1. **Invoices**: 
               - For each invoice, extract the following fields:
                 - Serial Number
                 - Customer Name
                 - Product Name
                 - Quantity
                 - Tax
                 - Total Amount
                 - Date
               - If extra information is available, include it as well.
      
            2. **Products**: 
               - For each product, extract the following fields:
                 - Name
                 - Quantity
                 - Unit Price
                 - Tax
                 - Price with Tax
               - Optionally include the Discount field if available.
      
            3. **Customers**: 
               - For each customer, extract the following fields:
                 - Customer Name
                 - Phone Number
                 - Total Purchase Amount
               - Optionally include any additional details such as email, address, etc.
      
            Ensure the data is well-structured and formatted as JSON with the appropriate fields for each table.
      
            Example structure:
            {
              "invoices": [
                {
                  "serialNumber": "12345",
                  "customerName": "John Doe",
                  "productName": "Product 1, Product 2, ...",
                  "quantity": 2(totalquantity),
                  "tax": 5.00,
                  "totalAmount": 50.00,
                  "date": "2024-11-20"
                },
              ],
              "products": [
                {
                  "name": "Product 1",
                  "quantity": 10,
                  "unitPrice": 20.00,
                  "tax": 2.00,
                  "priceWithTax": 22.00
                },
                ...
              ],
              "customers": [
                {
                  "customerName": "John Doe",
                  "phoneNumber": "123-456-7890",
                  "totalPurchaseAmount": 100.00
                },
                ...
              ]
            }`,
          },
        ]),
      3, // Retry up to 3 times
      2000 // Wait 2 seconds between retries
    );

    // Extract and log the response
    const extractedText = result.response.candidates[0].content.parts[0].text;
    console.log("Extracted Text:", extractedText);

    // Parse the extracted JSON data
    const jsonData = JSON.parse(extractedText.replace(/```json|```/g, ""));
    console.log("Extracted JSON Data:", jsonData);

    // Prepare the data for the Mongoose model
    const receipt = new Receipt({
      invoices: Array.isArray(jsonData.invoices)
        ? jsonData.invoices.map((invoice) => ({
            serialNumber: invoice.serialNumber || "N/A",
            customerName: invoice.customerName || "N/A",
            productName: invoice.productName || "N/A",
            quantity: invoice.quantity || 0,
            tax: invoice.tax || 0,
            totalAmount: invoice.totalAmount || 0,
            date: invoice.date ? new Date(invoice.date) : new Date(),
          }))
        : [],
      products: Array.isArray(jsonData.products)
        ? jsonData.products.map((product) => ({
            name: product.name || "N/A",
            quantity: product.quantity || 0,
            unitPrice: product.unitPrice || 0,
            tax: product.tax || 0,
            priceWithTax: product.priceWithTax || 0,
          }))
        : [],
      customers: Array.isArray(jsonData.customers)
        ? jsonData.customers.map((customer) => ({
            customerName: customer.customerName || "N/A",
            phoneNumber: customer.phoneNumber || "N/A",
            totalPurchaseAmount: customer.totalPurchaseAmount || 0,
          }))
        : [],
    });

    // Save the data to MongoDB
    await receipt.save();

    res.status(200).json({
      message: "File processed and data saved successfully.",
      receiptId: receipt._id,
    });

    // Clean up the temporary file
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error("Error processing file:", error.message);
    res.status(500).json({ error: error.message });
  }
};



/**
 * Retry logic with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in milliseconds
 */
async function retryAsync(fn, retries, delay) {
  let attempts = 0;

  while (attempts < retries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= retries || error.response?.status !== 503) {
        throw error; // Rethrow error if not retryable or max retries reached
      }
      console.warn(
        `Retry attempt ${attempts} failed. Retrying in ${delay}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
}

module.exports = {
  getInvoices,
  getProducts,
  getCustomers,
  uploadfile,
};
