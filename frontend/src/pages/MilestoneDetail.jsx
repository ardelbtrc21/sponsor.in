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
  const isDisabled = user.role !== "Sponsoree";

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/milestones/${milestone_id}`);
        setMilestone(response.data.milestone);
        setReplyMilestone(response.data.milestone.milestone_reply ? response.data.milestone.milestone_reply : "")
        setStatus(response.data.status?.status_name || "Not Set");
      } catch (err) {
        console.error("Failed to fetch milestone detail:", err);
      }
    };

    fetchDetail();
  }, [milestone_id]);

  const fetchAndPreviewFile = async () => {
    try {
      const res = await axios({
        url: `/api/milestones/preview/${milestone.milestone_attachment}`,
        method: "GET",
        responseType: "blob",
      });

      const extension = milestone.milestone_attachment.split('.').pop().toLowerCase();
      const blob = new Blob([res.data], { type: res.headers["content-type"] });
      const blobUrl = URL.createObjectURL(blob);

      if (extension === "csv" || extension === "xlsx") {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = milestone.milestone_attachment;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (extension === "pdf") {
        window.open(blobUrl, "_blank");
      } else if (extension === "jpg" || extension === "jpeg" || extension === "png" || extension === "gif") {
        const imgWindow = window.open("", "_blank");
        const img = document.createElement("img");
        img.src = blobUrl;
        img.style.width = "50%";
        img.style.height = "auto";
        imgWindow.document.body.appendChild(img);
        imgWindow.document.body.style.textAlign = "center";
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = milestone.milestone_attachment;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text:
          error.response?.status === 403
            ? "Access Forbidden"
            : error.response?.status === 404
              ? "File Not Found"
              : "Failed to preview file",
      });
      console.error(error);
    }
  };

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
      }).then(() => navigate(-1));
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
                    <button
                      onClick={fetchAndPreviewFile}
                      className="text-blue-600 underline ml-2"
                    > View Attachment
                    </button>
                  ) : (
                    <span className="italic text-gray-400 ml-2">No attachment uploaded</span>
                  )}
                </p>

                <p className="text-sm text-gray-500 mb-4">
                  Current Status: {renderStatusBadge(status)}
                </p>

                <h2 className="text-lg pt-3 font-semibold text-gray-800">
                  {isDisabled ? "Sponsoree Reply" : "Fill the Milestone"}
                </h2>
                <div className="bg-white p-6 my-6 rounded-xl shadow-sm border max-w-2xl mx-auto">

                  <div className="mb-4">
                    {!isDisabled && (
                      <label className="block mb-1 font-medium text-gray-700">Reply the Sponsor</label>
                    )}
                    {isDisabled ? (
                      <p className="text-gray-800 whitespace-pre-line">{replyMilestone || "-"}</p>
                    ) : (
                      <TextArea
                        rows={4}
                        placeholder="Type your response here..."
                        onChange={(e) => setReplyMilestone(e.target.value)}
                        value={replyMilestone}
                      />
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700">Attachment</label>
                    {isDisabled ? (
                      milestoneReplyAttachment ? (
                        <Button
                          icon={<UploadOutlined />}
                          onClick={() => window.open(URL.createObjectURL(milestoneReplyAttachment.originFileObj), "_blank")}
                        >
                          Preview Attachment
                        </Button>
                      ) : (
                        <p className="text-gray-400 text-sm">No attachment provided.</p>
                      )
                    ) : (
                      <>
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          onChange={({ fileList }) => {
                            if (fileList.length > 0) {
                              setMilestoneReplyAttachment(fileList[0]);
                            } else {
                              setMilestoneReplyAttachment(null);
                            }
                          }}
                        >
                          <Button icon={<UploadOutlined />}>Upload Attachment</Button>
                        </Upload>
                        <p className="text-xs text-gray-400 mt-1">Optional. PDF, DOCX, JPG, or PNG formats supported.</p>
                      </>
                    )}
                  </div>

                  {!isDisabled && (
                    <Button
                      type="primary"
                      className="bg-primary hover:bg-gray-700"
                      onClick={handleReplyMilestone}
                    >
                      Submit
                    </Button>
                  )}
                </div>

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
