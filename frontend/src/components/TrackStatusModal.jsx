import React from "react";
import "../Style/styles.css";

const TrackStatusModal = ({ isOpen, onClose, selectedStatusList }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <h2 className="custom-title text-xl font-bold mb-4">Track Status</h2>

        <div className="space-y-3">
          {selectedStatusList && selectedStatusList.length > 0 ? (
            selectedStatusList.map((status, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium">{status.status_name.toUpperCase()}</span>
                <span className="text-sm text-gray-500">
                  {status.endAt
                    ? (() => {
                        const date = new Date(status.endAt);
                        const day = date.getDate().toString().padStart(2, "0"); // 19
                        const shortMonth = date.toLocaleString("en-GB", { month: "short" }); // Apr
                        const year = date.getFullYear(); // 2025
                        const hours = date.getHours().toString().padStart(2, "0"); // 19
                        const minutes = date.getMinutes().toString().padStart(2, "0"); // 09
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
