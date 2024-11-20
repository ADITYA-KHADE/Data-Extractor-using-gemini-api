import React, { useState } from "react";
import FileUpload from "../Components/FileUpload/FileUpload";
import Invoices from "../Components/Invoices/Invoices";
import Products from "../Components/Products/Products";
import Customers from "../Components/Customers/Customers";

const Home = () => {
  const [activeTab, setActiveTab] = useState("UploadReceipt");

  const tabs = [
    { id: "UploadReceipt", label: "Upload Receipt" },
    { id: "Invoices", label: "Invoices" },
    { id: "Products", label: "Products" },
    { id: "Customers", label: "Customers" },
  ];

  const getButtonClasses = (tab) =>
    `px-4 py-2 rounded ${
      activeTab === tab
        ? "bg-indigo-500 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="p-6">
      <div className="flex flex-wrap gap-4 border-b pb-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={getButtonClasses(tab.id)}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4 bg-gray-50 rounded shadow">
        {activeTab === "UploadReceipt" && <FileUpload />}
        {activeTab === "Invoices" && <Invoices />}
        {activeTab === "Products" && <Products />}
        {activeTab === "Customers" && <Customers />}
        {!tabs.some((tab) => tab.id === activeTab) && (
          <div className="text-gray-500">Please select a valid tab.</div>
        )}
      </div>
    </div>
  );
};

export default Home;
