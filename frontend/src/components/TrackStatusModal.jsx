import React from "react";
import "../Style/styles.css";

const TrackStatusModal = ({ isOpen, onClose, statusList }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="custom-title text-xl font-bold mb-4">Track Status</h2>

        <div className="space-y-3">
          {statusList && statusList.length > 0 ? (
            statusList.map((status, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">{status.status_name}</span>
                <span className="text-sm text-gray-500">
                    {status.updatedAt
                        ? (() => {
                            const date = new Date(status.updatedAt);
                            const day = date.getDate().toString().padStart(2, "0"); 
                            const shortMonth = date.toLocaleString("en-GB", { month: "short" }); 
                            const year = date.getFullYear(); 
                            const hours = date.getHours().toString().padStart(2, "0"); 
                            const minutes = date.getMinutes().toString().padStart(2, "0"); 
                            return `${shortMonth} ${day}, ${year} ${hours}:${minutes}`;
                        })()
                        : "On Process"}
                    </span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No status history available.</p>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TrackStatusModal;