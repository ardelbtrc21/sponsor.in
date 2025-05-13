import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrackStatusModal from "../components/TrackStatusModal";
import "../Style/styles.css";
import ModernLayout from "../components/Layout";

const statuses = [
  { label: "SUBMITTED", value: "Submitted" },
  { label: "UNDER REVIEW", value: "Under Review" },
  { label: "ACCEPTED", value: "Accepted" },
  { label: "PROCESSING AGREEMENT", value: "Processing Agreement" },
  { label: "COMPLETED", value: "Completed" },
  { label: "REJECTED", value: "Rejected" },
];

const ViewMySubmissions = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("Submitted");
  const [proposals, setProposals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatusList, setSelectedStatusList] = useState([]);

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(
          `/api/proposals/status/${user.username}/${selectedStatus}`
        );
        setProposals(response.data);
      } catch (error) {
        setProposals([]);
        console.error("Error fetching proposals by status:", error);
      }
    };
    fetchProposals();
  }, [selectedStatus, user.id]);

  const handleTrackClick = async (proposal_id) => {
    try {
      const response = await axios.get(`/api/proposals/${proposal_id}/status`);
      if (response.data && response.data.length > 0) {
        setSelectedStatusList(response.data);
        setIsModalOpen(true);
      } else {
        setSelectedStatusList([]);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error("Error fetching proposal status history:", error);
    }
  };

  return (
    <ModernLayout>
      <div className="flex flex-col min-h-screen max-w">
        <h1 className="text-2xl text-primary font-bold flex justify-center tracking-wider pt-10 mb-4">
          TRACK YOUR PROPOSAL STATUS!
        </h1>

        <div className="overflow-x-auto px-4">
          <table className="min-w-full border text-sm bg-white shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left text-gray-700">
                {statuses.map(({ label, value }) => (
                  <th key={value} className="p-3 border">
                    <button
                      onClick={() => setSelectedStatus(value)}
                      className={`w-full text-center font-semibold ${selectedStatus === value
                        ? "text-primary underline"
                        : "hover:text-blue-600"
                        }`}
                    >
                      {label}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {proposals.length === 0 ? (
                <tr>
                  <td colSpan={statuses.length} className="text-center text-gray-500 py-8">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-12 h-12 mb-2 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h2 className="text-lg font-bold text-primary">No proposals found</h2>
                      <p className="text-sm text-gray-400 mt-1">
                        They will appear here once submitted.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                proposals.map((proposal) => (
                  <tr key={proposal.proposal_status_id} className="border-t hover:bg-gray-50">
                    <td colSpan={statuses.length} className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h3 className="font-bold text-gray-900">
                            {proposal.status_proposals?.proposal_name || "Proposal Name Unavailable"}
                          </h3>
                          <p className="text-gray-700">
                            {proposal.status_proposals?.event_name || "Event Name Unavailable"}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {proposal.status_proposals?.event_date
                              ? new Date(proposal.status_proposals.event_date).toUTCString().substring(0, 16)
                              : "Unknown Date"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              navigate(`/proposal/detail/${proposal.proposal_id}`)
                            }
                            className="btn-primary text-white px-4 py-2 rounded-md"
                          >
                            View Detail
                          </button>
                          <button
                            onClick={() => handleTrackClick(proposal.proposal_id)}
                            className="btn-secondary px-4 py-2 rounded-md"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TrackStatusModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedStatusList={selectedStatusList}
        />
      </div>
    </ModernLayout>
  );
};

export default ViewMySubmissions;
