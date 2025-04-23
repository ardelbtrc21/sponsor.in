import React from "react";
import axios from "axios";

const ApproveButton = () => {
  const handleStatusChange = async () => {
    try {
      const response = await axios.put(
        "http://localhost:5000/api/status/550e8400-e29b-41d4-a716-446655440000/approve"
      );
      alert("Status updated!");
    } catch (error) {
      console.error("Erreresresror: ", error);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
        onClick={handleStatusChange}
      >
        Approve
      </button>
    </div>
  );
};

export default ApproveButton;
