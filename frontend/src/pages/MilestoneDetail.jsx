import React, { useEffect, useState } from "react";
import { useParams, useNavigate, redirect } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { Input, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MilestoneDetailPage = () => {
  const { milestone_id } = useParams();
  const { TextArea } = Input;
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [milestone, setMilestone] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [replyMilestone, setReplyMilestone] = useState("");
  const [milestoneReplyAttachment, setMilestoneReplyAttachment] = useState(null);

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
        confirmButtonColor: "#6366F1",
      }).then(() => {
        navigate(-1); 
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleReplyMilestone = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("milestone_reply", replyMilestone);
      formData.append("milestone_id", milestone_id);
      if (milestoneReplyAttachment?.originFileObj || milestoneReplyAttachment !== null) {
        console.log(milestoneReplyAttachment)
        formData.append("milestone_reply_attachment", milestoneReplyAttachment?.originFileObj);
      }
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }


      await axios.patch("/api/milestones/reply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Reply milestone success!",
        confirmButtonColor: "#6366F1",
      }).then(() => navigate("/milestones"));
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Reply milestone failed.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const renderStatusBadge = (status) => {
    let bgColor = "bg-gray-400";
    if (status === "Completed") bgColor = "bg-green-500";
    else if (status === "Revision Required") bgColor = "bg-yellow-500";

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <ModernLayout>
      <div className="flex flex-row min-h-screen">
        <div className="flex-1 py-10 px-6 max-w-screen-md mx-auto">
          {!milestone ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-primary mb-6 text-center tracking-wider">
                MILESTONE DETAIL
              </h1>

              <div className="bg-white border rounded-xl p-6 shadow">
                <p className="text-xl text-primary font-semibold">
                  {milestone.milestone_name}
                </p>
                <p className="text-secondary mb-2">{milestone.milestone_description}</p>

                <p className="text-sm text-gray-500 mb-1">
                  Created: {dayjs(milestone.createdAt).format("DD MMMM YYYY, HH:mm")}
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
                  Current Status: {renderStatusBadge(status)}
                </p>

                {user.role === "Sponsor" && status !== "Completed" && (
                  <>
                    <div className="mb-6">
                      <label
                        htmlFor="statusSelect"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Update Status
                      </label>
                      <select
                        id="statusSelect"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Completed">Completed</option>
                        <option value="Revision Required">Revision Required</option>
                      </select>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleSubmit}
                        disabled={!selectedStatus}
                        className={`px-6 py-2 rounded-md text-white btn-primary ${selectedStatus ? "hover:opacity-90" : "bg-gray-300 cursor-not-allowed"
                          }`}
                      >
                        Submit
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </ModernLayout>
  );
};

export default MilestoneDetailPage;
