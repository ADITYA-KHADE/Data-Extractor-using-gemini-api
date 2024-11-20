import React, { useState } from "react";

const FileUpload = () => {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    setIsLoading(true);

    try {
      // Convert file to Base64
      const fileBase64 = await toBase64(file);

      // Prepare the API request payload
      const payload = {
        document: {
          rawDocument: {
            mimeType: file.type,
            content: fileBase64,
          },
        },
        options: {
          // Customize based on your document processing requirements
          extractText: true,
        },
      };

      // Make the API request
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:analyzeDocument?key=${import.meta.env.VITE_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();

      // Process the API response
      const textExtraction =
        data.document?.text || "No text was extracted from the document.";
      setResult(textExtraction);
      console.log("Document Text Extraction:", textExtraction);
    } catch (error) {
      console.error("Error processing the document:", error);
      setResult("An error occurred while processing the document.");
    } finally {
      setIsLoading(false);
    }
  };

  // Utility to convert file to Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extract Base64 content
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file); // Read file as Base64
    });

  return (
    <div className="border-dashed border-2 border-gray-300 p-6 rounded-lg text-center">
      <p className="mb-4 text-gray-600">
        Drag and drop a file here or click the button below to upload.
      </p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFileUpload}
        accept=".pdf,.txt"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Upload File
      </label>

      {isLoading && <p className="mt-4 text-gray-500">Processing...</p>}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h4 className="font-bold text-gray-700">Extracted Text:</h4>
          <p className="text-gray-600">{result}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
