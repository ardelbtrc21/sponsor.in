import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../components/Header";
import Footer from "../components/Footer";

const MilestoneDetailPage = () => {
  const { milestone_id } = useParams();
  const navigate = useNavigate();
  const [milestone, setMilestone] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/milestones/${milestone_id}`);
        setMilestone(response.data.milestone);
        setStatus(response.data.status?.status_name || "Not Set");
      } catch (err) {
        console.error("Failed to fetch milestone detail:", err);
      }
    };

    fetchDetail();
  }, [milestone_id]);

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/milestones/${milestone_id}/status`, {
        status_name: selectedStatus,
      });
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Milestone status updated!",
        confirmButtonColor: "#6366F1"
      }).then(() => navigate("/milestones"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status.",
        confirmButtonColor: "#EF4444"
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w">
      <Header />
      <div className="flex-1 py-10 px-6 max-w-screen-md mx-auto">
        {!milestone ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <h1 className="text-4xl font-bold text-primary mb-6 text-center tracking-wider">
              MILESTONE DETAIL
            </h1>
            <div className="bg-white border rounded-xl p-6 shadow">
              <p className="text-xl text-primary font-semibold">{milestone.milestone_name}</p>
              <p className="text-secondary mb-2">{milestone.milestone_description}</p>
              <p className="text-sm text-gray-500 mb-1">
                Created: {new Date(milestone.createdAt).toLocaleString()}
              </p>
  
              <p className="text-sm text-gray-500 mb-1">
                Attachment:
                {milestone.milestone_attachment ? (
                  <a
                    href={milestone.milestone_attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline ml-2"
                  >
                    View Attachment
                  </a>
                ) : (
                  <span className="italic text-gray-400 ml-2">No attachment uploaded</span>
                )}
              </p>
  
              <p className="text-sm text-gray-500 mb-4">
                Current Status:
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${
                    status === "completed"
                      ? "bg-green-500"
                      : status === "need revision"
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                >
                  {status}
                </span>
              </p>
  
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">-- Select Status --</option>
                  <option value="completed">Completed</option>
                  <option value="need revision">Need Revision</option>
                </select>
              </div>
  
              <div className="flex justify-end">
                <button
                  onClick={handleSubmit}
                  className="btn-primary text-white px-6 py-2 rounded-md"
                >
                  Submit
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
  
};

export default MilestoneDetailPage;
