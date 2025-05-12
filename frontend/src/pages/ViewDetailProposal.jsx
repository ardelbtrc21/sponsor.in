import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ListMilestone from "../components/ListMilestone";
import ModernLayout from "../components/Layout";
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import defaultProfile from '../assets/profile_default.png';
import CreateMilestoneModal from "../components/CreateMilestoneModal"; // Assuming you have this component

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ViewDetailProposal = () => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [proposals, setProposals] = useState({});
  const [latestStatus, setLatestStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);
  const { id } = useParams();

  const getDetailProposal = async () => {
    try {
      const response = await axios.get(`/api/proposal/${id}`);
      setProposals(response.data)
      getLatestStatus(id);
    } catch (error) {
      console.log(error);
    }
  }

  const changeToUnderReview = async () => {
    try {
      await axios.patch("/api/proposal/change-status", {
        proposal_id: id,
        status: "Under Review"
      });
     
    } catch (error) {
      console.log(error);
    }
  };

  const getLatestStatus = async (proposal_id) => {
    try {
      const response = await axios.get(`/api/proposal/${proposal_id}/status/latest`);
      setLatestStatus(response.data);
      console.log("latest data: ", response.data);
    } catch (error) {
      console.error("Error fetching latest status", error);
    }
  };

  useEffect(() => {
    getDetailProposal();
    changeToUnderReview()
  }, [id]);

  const handleApproveProposal = async () => {
    try {
      await axios.put(`/api/proposals/${latestStatus.proposal_status_id}/approve`);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Successfully updated status."
      });
      getDetailProposal();
    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message
      });
    }
  };

  const handleRejectProposal = async () => {
    try {
      await axios.put(`/api/proposals/${latestStatus.proposal_status_id}/reject`);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Successfully reject proposals."
      });
      getDetailProposal();
    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message
      });
    }
  };

  const handleOpenModal = (proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  useEffect(() => {
    if (proposals.file_proposal) {
      fetchAndPreviewPDF();
    }
  }, [proposals]);

  const fetchAndPreviewPDF = async () => {
    try {
      const res = await axios({
        url: `/api/proposals/preview/${proposals.file_proposal}`,
        method: "GET",
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      setPdfBlobUrl(blobUrl);
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

  return (
    <ModernLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-6">
          {/* Title */}
          <div className="space-y-1">
            <div className="flex flex-row items-center">
              <img
                src={proposals.user?.profile_photo ? `/profile_photo/${proposals.user.profile_photo}` : defaultProfile}
                alt="User Avatar"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="pl-2">
                <p className="text-gray-900 font-semibold text-base">{proposals.user?.name}</p>
                <p className="text-gray-500 text-sm">{proposals.user?.username}</p>
              </div>
            </div>
            <div className="flex flex-col items-center pt-5">
              <h2 className="text-xl font-semibold text-gray-900 break-words max-w-2xl text-center">
                {proposals.proposal_name}
              </h2>
              <p className="text-gray-500 text-sm">{proposals.event_name}</p>
            </div>
          </div>

          {/* Meta Info Grid */}
          <div className="bg-white rounded-xl shadow p-4">
            <div className="flex justify-between text-sm text-gray-700 pt-4">
              <Meta label="Event Date" value={dayjs(proposals.event_date).format("MMMM D, YYYY")} icon={CalendarDaysIcon} />
              <Meta label="Location" value={proposals.event_location} icon={MapPinIcon} />
              <Meta label="Target Age" value={proposals.target_age_min} icon={UserGroupIcon} />
              <Meta label="Target Gender" value={proposals.target_gender} icon={UserGroupIcon} />
            </div>

            {/* Tags */}
            <div className="py-5">
              <Section title="Tags Related">
                <div className="flex flex-wrap gap-2">
                  {proposals.tags_proposals?.map((tag, i) => (
                    <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      {tag.tag_name}
                    </span>
                  ))}
                </div>
              </Section>
            </div>

            {/* Target Participants */}
            <Section title="Target Participants">
              <div className="flex flex-wrap gap-2">
                {proposals.target_proposals?.map((target, i) => (
                  <span key={i} className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                    {target.target_participant_category}
                  </span>
                ))}

              </div>
            </Section>
          </div>

          {/* PDF Preview */}
          <Section title="Proposal File Preview">
            <div className="border border-gray-300 rounded-md overflow-hidden w-full h-screen">
              {pdfBlobUrl ? (
                <iframe
                  src={pdfBlobUrl}
                  title="Proposal Preview"
                  className="w-full h-full"
                  frameBorder="0"
                />
              ) : (
                <p>Loading preview...</p>
              )}
            </div>
          </Section>

          {/* Conditional Action Buttons */}
          <div className="text-center text-s pt-2 space-y-2">
            {latestStatus?.status_name === "Submitted" && (
              <div>
                <button
                  className="bg-red-600 hover:opacity-80 tracking-wider text-white font-semibold py-2 px-6 rounded-lg shadow-md mx-2"
                  onClick={handleRejectProposal}
                >
                  REJECT PROPOSAL
                </button>
                <button
                  className="bg-primary hover:bg-gray-700 tracking-wider text-white font-semibold py-2 px-6 rounded-lg shadow-md mx-2"
                  onClick={handleApproveProposal}
                >
                  APPROVE PROPOSAL
                </button>

              </div>
            )}
            {/* Milestone List */}
            <ListMilestone proposal_id={id} />
            {(latestStatus?.status_name === "Approved" || latestStatus?.status_name === "Processing Agreement") && (
              <button
                className="bg-primary hover:bg-gray-700 text-white font-semibold tracking-wider py-2 px-6 rounded-lg shadow-md mt-0"
                onClick={() => handleOpenModal(proposals)}
              >
                CREATE MILESTONE
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Create Milestone Modal */}
      {isModalOpen && (
        <CreateMilestoneModal submission={selectedProposal} onClose={handleCloseModal} />
      )}
    </ModernLayout>
  );
};

const Meta = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2">
    <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="space-y-1">
    <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
    <div>{children}</div>
  </div>
);

export default ViewDetailProposal;
