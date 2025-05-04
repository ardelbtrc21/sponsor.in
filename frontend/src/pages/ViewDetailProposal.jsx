import React, { Fragment, useEffect, useRef, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { CalendarDaysIcon, MapPinIcon, UserGroupIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Tag } from "antd";
import dayjs from "dayjs";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const ViewDetailProposal = () => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [proposals, setProposals] = useState([]);
  const { id } = useParams();

  const getDetailProposal = async () => {
    try {
      const response = await axios.get(`/api/proposal/${id}`);
      setProposals(response.data)
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getDetailProposal()
  }, []);

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
      setPdfBlobUrl(blobUrl); // simpan URL blob ke state
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
            <h2 className="text-2xl font-semibold text-gray-900">{proposals.proposal_name}</h2>
            <p className="text-gray-500 text-sm">{proposals.event_name}</p>
          </div>

          {/* Meta Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <Meta label="Event Date" value={proposals.event_date} icon={CalendarDaysIcon} />
            <Meta label="Location" value={proposals.event_location} icon={MapPinIcon} />
            <Meta label="Target Age" value={proposals.target_age_min} icon={UserGroupIcon} />
            <Meta label="Target Gender" value={proposals.target_gender} icon={UserGroupIcon} />
          </div>

          {/* Tags */}
          <Section title="Tags Related">
            <div className="flex flex-wrap gap-2">
              {proposals.tags_proposals?.map((tag, i) => (
                <span key={i} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                  {tag.tag_name}
                </span>
              ))}
            </div>
          </Section>

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

          {/* Action Button */}
          <div className="text-center pt-4">
            <button
              className="bg-primary hover:bg-gray-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
              onClick={handleStatusChange}
            >
              Approve Proposal
            </button>
          </div>
        </div>
      </div>
      {/* <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{proposals.proposal_name}</h1>

          <div className="space-y-3">
            <DetailRow icon={CalendarDaysIcon} label="Event Name" value={proposals.event_name} />
            <DetailRow icon={CalendarDaysIcon} label="Event Date" value={proposals.event_date} />
            <DetailRow icon={MapPinIcon} label="Location" value={proposals.event_location} />
            <DetailRow icon={UserGroupIcon} label="Target Age" value={proposals.target_age_min} />
            <DetailRow icon={UserGroupIcon} label="Target Gender" value={proposals.target_gender} />

            <div>
              <p className="font-semibold text-gray-700">Tags Related:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {proposals.tags_proposals?.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {tag.tag_name}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold text-gray-700">Target Participants:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {proposals.target_proposals?.map((target, index) => (
                  <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {target.target_participant_category}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <p className="font-semibold text-gray-700 mb-2">Proposal File Preview:</p>
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
      </div> */}
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

// const DetailRow = ({ icon: Icon, label, value }) => (
//   <div className="flex items-center space-x-2 text-gray-800">
//     <Icon className="w-5 h-5 text-gray-500" />
//     <span className="font-medium">{label}:</span>
//     <span>{value}</span>
//   </div>
// );

export default ViewDetailProposal;
