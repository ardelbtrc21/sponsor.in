import React from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Tag } from "antd";
import dayjs from "dayjs";

const ViewDetailProposal = () => {
  const proposal = {
    title: "InnovateX: Empowering Young Entrepreneurs",
    eventName: "Youth Business Summit 2025",
    eventDate: "2025-06-15",
    location: "Jakarta Convention Center, Jakarta",
    targetAge: "18-30",
    targetGender: "All Genders",
    tags: ["Entrepreneurship", "Innovation", "Youth"],
    targetParticipants: ["Students", "Startups", "Investors"],
    proposalFileUrl: "../../../backend/data/nib/sadsadad_CHAR6015001_2502041363_ARDELIA BEATRICE.pdf",
  };

  const handleStatusChange = async () => {
    try {
      await axios.put(
        "/api/proposals/550e8400-e29b-41d4-a716-446655442222/approve"
      );
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Successfully update status."
      });
    } catch (error) {
      console.error("Error: ", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error
      });
    }
  };

  return (
    <ModernLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{proposal.title}</h1>

          <div className="space-y-3">
            <DetailRow icon={CalendarDaysIcon} label="Event Name" value={proposal.eventName} />
            <DetailRow icon={CalendarDaysIcon} label="Event Date" value={proposal.eventDate} />
            <DetailRow icon={MapPinIcon} label="Location" value={proposal.location} />
            <DetailRow icon={UserGroupIcon} label="Target Age" value={proposal.targetAge} />
            <DetailRow icon={UserGroupIcon} label="Target Gender" value={proposal.targetGender} />

            <div>
              <p className="font-semibold text-gray-700">Tags Related:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {proposal.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700">Target Participants:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {proposal.targetParticipants.map((p, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-semibold text-gray-700 mb-2">Proposal File Preview:</p>
              <div className="border border-gray-300 rounded-md overflow-hidden h-[500px]">
                <iframe
                  src={proposal.fileUrl}
                  title="Proposal Preview"
                  className="w-full h-full"
                  frameBorder="0"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-primary hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
              onClick={handleStatusChange}
            >
              Approve
            </button>
          </div>
        </div>
      </div>
    </ModernLayout>
  );
};

const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center space-x-2 text-gray-800">
    <Icon className="w-5 h-5 text-gray-500" />
    <span className="font-medium">{label}:</span>
    <span>{value}</span>
  </div>
);

export default ViewDetailProposal;
