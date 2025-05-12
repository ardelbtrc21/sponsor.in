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
        console.log("Response: ", response.data);
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
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl text-primary font-bold flex justify-center tracking-wider pt-10 mb-4">
            TRACK YOUR PROPOSAL STATUS!
          </h1>

          <div className="custom-menu">
            {statuses.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setSelectedStatus(value)}
                className={`custom-box p-1 rounded-lg font-medium ${selectedStatus === value
                    ? "btn-primary text-white"
                    : "btn-secondary-without-border hover:bg-gray-300"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="">
            {proposals.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-16 h-16 mb-4 text-gray-400"
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
                <h2 className="text-lg text-primary font-bold">
                  You haven't received any proposals yet
                </h2>
                <h4 className="text-sm text-gray-400 mt-1">
                  Keep an eye out – they'll show up here once submitted.
                </h4>
              </div>
            ) : (
              <div>
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-screen-xl mx-auto">
                  {proposals.map((proposal) => (
                    <div
                      key={proposal.proposal_status_id}
                      className="w-full border-b border-gray-300 px-4 md:px-8 py-4 bg-white"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">

                        <div className="flex flex-col text-base space-y-1">
                          <h2 className="font-bold text-gray-900 break-words">
                            {proposal.status_proposals?.proposal_name || "Proposal Name Unavailable"}
                          </h2>
                          <p className="text-gray-700 break-words">
                            {proposal.status_proposals?.event_name || "Event Name Unavailable"}
                          </p>
                          <p className="text-gray-500">
                            {proposal.status_proposals?.event_date
                              ? new Date(proposal.status_proposals?.event_date).toUTCString().substring(0, 16)
                              : "Unknown Date"}
                          </p>
                        </div>


                        {/* Button Group */}
                        <div className="flex gap-3 flex-wrap">
                          <button
                            onClick={() =>
                              navigate(`/proposal/detail/${proposal.proposal_id}`)
                            }
                            className="btn-primary text-white px-4 py-2 rounded-md"
                          >
                            View Proposal Detail
                          </button>
                          <button
                            onClick={() => handleTrackClick(proposal.proposal_id)}
                            className="btn-secondary px-4 py-2 rounded-md"
                          >
                            Track
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
