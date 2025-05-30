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

  // States
  const [milestone, setMilestone] = useState(null);
  const [status, setStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [replyMilestone, setReplyMilestone] = useState("");
  const [milestoneReplyAttachment, setMilestoneReplyAttachment] = useState(null);
  const [isDisabled, setIsDisabled] = useState(user.role !== "Sponsoree");
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editableDescription, setEditableDescription] = useState("");
  const [sponsorAttachment, setSponsorAttachment] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/milestones/${milestone_id}`);
        const data = response.data;
        setMilestone(data.milestone);
        setReplyMilestone(data.milestone.milestone_reply || "");
        setStatus(data.status?.status_name || "Not Set");
        setEditableDescription(data.milestone.milestone_description);
        if (response.data.status?.status_name !== "Pending" && response.data.status?.status_name !== "Revision Required") {
          setIsDisabled(true)
        }
        if (user.role === "Sponsor" && data.status?.status_name === "Revision Required") {
          setIsEditingDescription(true);
        }
      } catch (err) {
        console.error("Failed to fetch milestone detail:", err);
      }
    };
    fetchDetail();
  }, [milestone_id, user.role]);

  const fetchAndPreviewPDF = async (file) => {
    try {
      const res = await axios({
        url: `/api/milestones/preview/${file}`,
        method: "GET",
        responseType: "blob",
      });

      let mimeType = res.headers["Content-Type"] || "application/octet-stream";

      if (!res.headers["Content-Type"]) {
        if (file.endsWith(".pdf")) mimeType = "application/pdf";
        else if (file.endsWith(".png")) mimeType = "image/png";
        else if (file.endsWith(".jpg") || file.endsWith(".jpeg")) mimeType = "image/jpeg";
      }

      const blob = new Blob([res.data], { type: mimeType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      Swal.fire({
        title: "<strong>Oops...</strong>",
        html: `<p>${error.response?.status === 403
          ? "Access Forbidden"
          : error.response?.status === 404
            ? "File Not Found"
            : "Failed to preview file"
          }</p>`,
        icon: "error",
        iconColor: "#dc2626", // red-600
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      });
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus) return;
    try {
      await axios.put(`/api/milestones/${milestone_id}/status`, {
        status_name: selectedStatus,
      });

      Swal.fire({
        title: "<strong>Success</strong>",
        html: "<p>Milestone status updated!</p>",
        icon: "success",
        iconColor: "#10b981", // green-500 (success tone)
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      }).then(() => {
        if (selectedStatus === "Revision Required") {
          setIsEditingDescription(true);
          setIsDisabled(true);
          setStatus("Revision Required");
        } else {
          navigate(-1);
        }
      });
    } catch (err) {
      Swal.fire({
        title: "<strong>Error</strong>",
        html: "<p>Failed to update status.</p>",
        icon: "error",
        iconColor: "#dc2626", // red-600
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      });
    }
  };

  const handleSendRevision = async () => {
    try {
      const formData = new FormData();
      formData.append("milestone_description", editableDescription);
      formData.append("milestone_id", milestone_id);

      console.log("Will send file:", sponsorAttachment?.originFileObj?.name);
      if (sponsorAttachment && sponsorAttachment.originFileObj) {
        formData.append("milestone_attachment", sponsorAttachment.originFileObj);
      }
      await axios.patch(`/api/milestones/update/${milestone_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      Swal.fire({
        title: "<strong>Success</strong>",
        html: "<p>Revised description sent to sponsoree!</p>",
        icon: "success"
      })
        .then(() => navigate(-1));
    } catch (err) {
      Swal.fire({
        title: "<strong>Error</strong>",
        html: "<p>Failed to send revision</p>",
        icon: "error"
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
        formData.append("milestone_reply_attachment", milestoneReplyAttachment?.originFileObj);
      }
      // for (let [key, value] of formData.entries()) {
      //   console.log(`${key}:`, value);
      // }


      await axios.patch("/api/milestones/reply", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      Swal.fire({
        title: "<strong>Success</strong>",
        html: "<p>Reply milestone success!</p>",
        icon: "success",
        iconColor: "#10b981", // green-500 untuk ikon success
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      }).then(() => navigate(-1));
    } catch (err) {
      Swal.fire({
        title: "<strong>Error</strong>",
        html: "<p>Reply milestone failed.</p>",
        icon: "error",
        iconColor: "#ef4444", // red-500 untuk error
        showCancelButton: false,
        confirmButtonText: "OK",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2 text-red-600',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
        },
      })
    }
  };

  const renderStatusBadge = (status) => {
    let bgColor = "bg-gray-400";
    if (status === "Completed") bgColor = "bg-hijau";
    if (status === "Submitted") bgColor = "bg-blue-500";
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
                {/* Title */}
                <p className="text-xl text-primary font-semibold mb-2">
                  {milestone.milestone_name}
                </p>

                {/* Sponsor Edit Mode */}
                {user.role === 'Sponsor' && isEditingDescription ? (
                  <>
                    <TextArea
                      rows={4}
                      value={editableDescription}
                      onChange={e => setEditableDescription(e.target.value)}
                      className="border mb-4"
                    />
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      onChange={({ fileList }) => setSponsorAttachment(fileList[0] || null)}
                    >
                      <Button icon={<UploadOutlined />}>Upload Attachment</Button>
                    </Upload>
                    <p className="text-xs text-gray-400 mt-1">
                      Optional. PDF, DOCX, JPG, or PNG supported.
                    </p>
                    <div className="mt-4">
                      <Button type="primary" onClick={handleSendRevision} className="bg-primary hover:bg-gray-700 ">
                        Send Revision
                      </Button>
                    </div>
                  </>
                ) : (
                  <p className="text-secondary mb-4">
                    {milestone.milestone_description}
                  </p>
                )}

                {/* Created */}
                <p className="text-sm text-gray-500 mb-1">
                  Created: {dayjs(milestone.created_date || milestone.createdAt).format('DD MMMM YYYY, HH:mm')}
                </p>

                {/* Original Attachment */}
                <p className="text-sm text-gray-500 mb-1">
                  Attachment:{' '}
                  {milestone.milestone_attachment ? (
                    <button
                      onClick={() => fetchAndPreviewPDF(milestone.milestone_attachment)}
                      className="text-blue-600 underline ml-2"
                    >
                      View Attachment
                    </button>
                  ) : (
                    <span className="italic text-gray-400 ml-2">
                      No attachment uploaded
                    </span>
                  )}
                </p>

                {/* Status Badge */}
                <p className="text-sm text-gray-500 mb-4">
                  Current Status: {renderStatusBadge(status)}
                </p>

                {/* Sponsoree Reply Section */}
                <h2 className="text-lg pt-3 font-semibold text-gray-800">
                  {isDisabled ? 'Sponsoree Reply' : 'Fill the Milestone'}
                </h2>
                <div className="bg-white p-6 my-6 rounded-xl shadow-sm border max-w-2xl mx-auto">
                  <div className="mb-4">
                    {!isDisabled && (
                      <label className="block mb-1 font-medium text-gray-700">
                        Reply the Sponsor
                      </label>
                    )}
                    {isDisabled ? (
                      <p className="text-gray-800 whitespace-pre-line">
                        {replyMilestone || '-'}
                      </p>
                    ) : (
                      <TextArea
                        rows={4}
                        placeholder="Type your response here..."
                        onChange={e => setReplyMilestone(e.target.value)}
                        value={replyMilestone}
                      />
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block mb-1 font-medium text-gray-700">
                      Attachment
                    </label>
                    {isDisabled ? (
                      milestone.milestone_reply_attachment ? (
                        <Button
                          icon={<UploadOutlined />}
                          onClick={() => fetchAndPreviewPDF(milestone.milestone_reply_attachment)}
                        >
                          Preview Attachment
                        </Button>
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No attachment provided.
                        </p>
                      )
                    ) : (
                      <>
                        <Upload
                          beforeUpload={() => false}
                          maxCount={1}
                          onChange={({ fileList }) =>
                            fileList.length > 0
                              ? setMilestoneReplyAttachment(fileList[0])
                              : setMilestoneReplyAttachment(null)
                          }
                        >
                          <Button icon={<UploadOutlined />}>Upload Attachment</Button>
                        </Upload>
                        <p className="text-xs text-gray-400 mt-1">
                          Optional. PDF, DOCX, JPG, or PNG formats supported.
                        </p>
                        {milestone.milestone_reply_attachment && (
                          <a
                            href="#"
                            className="text-sm text-blue-500 underline mt-2 inline-block"
                            onClick={e => {
                              e.preventDefault();
                              fetchAndPreviewPDF(milestone.milestone_reply_attachment);
                            }}
                          >
                            View your last attachment
                          </a>
                        )}
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

                {/* Sponsor Status Dropdown */}
                {user.role === 'Sponsor' && status !== 'Completed' && !isEditingDescription && (
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
                        onChange={e => setSelectedStatus(e.target.value)}
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
                        className={`px-6 py-2 rounded-md text-white btn-primary ${selectedStatus ? 'hover:opacity-90' : 'bg-gray-300 cursor-not-allowed'
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
