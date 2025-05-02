import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TrackStatusModal from "../components/TrackStatusModal";
import Footer from "../components/Footer";
import Header from "../components/Header";
import "../Style/styles.css";

const statuses = [
  "SUBMITTED",
  "UNDER REVIEW",
  "ACCEPTED",
  "PROCESSING AGREEMENT",
  "COMPLETED",
  "REJECTED",
];

const ViewProposalStatus = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("SUBMITTED");
  const [proposals, setProposals] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatusList, setSelectedStatusList] = useState([]);

  const { user } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        console.log("Sponsoree id: ", user.username);
        const response = await axios.get(
          `http://localhost:5000/api/proposals/status/${user.username}/${selectedStatus}`
        );
        console.log("Response: ", response.data);
        setProposals(response.data);
      } catch (error) {
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
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="flex-1 space-y-6">
        <h1 className="text-4xl text-primary font-bold flex justify-center tracking-wider pt-10 mb-4">
          TRACK YOUR PROPOSAL STATUS!
        </h1>

        <div className="custom-menu">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`custom-box p-1 rounded-lg font-medium ${
                selectedStatus === status
                  ? "btn-primary text-white"
                  : "btn-secondary-without-border hover:bg-gray-300"
              }`}
            >
              {status}
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
              <h2 className="text-lg text-blue-800 font-bold">
                You haven't received any proposals yet
              </h2>
              <h4 className="text-sm text-gray-400 mt-1">
                Keep an eye out – they'll show up here once submitted.
              </h4>
            </div>
          ) : (
            <div>
              {proposals.map((proposal) => (
                <div
                  key={proposal.proposal_status_id}
                  className="flex items-center p-4 rounded-xl shadow-sm bg-white"
                >
                  <div className="event-group flex-1 flex flex-row gap-1">
                    <h2 className="event-name text-lg font-bold">
                      {proposal.status_proposals?.event_name || "Event Name Unavailable"}
                    </h2>
                    <p className="event-desc text-gray-700">
                      {proposal.status_proposals?.proposal_name || "Proposal Name Unavailable"}
                    </p>
                    <p className="event-date text-gray-700">
                      {proposal.status_proposals?.event_date
                        ? new Date(proposal.status_proposals?.event_date).toUTCString().substring(0, 16)
                        : "Unknown Date"}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/view-proposal-detail/${proposal.proposal_id}`)
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
          )}
        </div>
      </div>

      <Footer />

      <TrackStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedStatusList={selectedStatusList}
      />
    </div>
  );
};

export default ViewProposalStatus;
