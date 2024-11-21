import React, { useState } from "react";
import { toast } from "react-hot-toast";

const FileUpload = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      toast.error("No file selected");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/data/uploadfile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error || "Upload failed");
      }

      const data = await response.json();
      console.log(data.receiptJson);
      toast.success(data.message || "File uploaded successfully!");
    } catch (error) {
      console.error("Error processing the document:", error);
      toast.error(error.message || "An error occurred during file upload.");
    } finally {
      setIsLoading(false);
    }
  };

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
        accept=".pdf,.txt,.xlsx,.docx,.jpeg,.png"
      />
      <label
        htmlFor="file-upload"
        className={`cursor-pointer bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isLoading ? "Uploading..." : "Upload File"}
      </label>
    </div>
  );
};

export default FileUpload;
