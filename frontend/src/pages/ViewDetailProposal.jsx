import React from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ApproveButton = () => {
  const handleStatusChange = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/proposals/550e8400-e29b-41d4-a716-446655442222/approve"
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Successfully update status."
      });
    } catch (error) {
      console.error("Erreresresror: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error
      });
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
