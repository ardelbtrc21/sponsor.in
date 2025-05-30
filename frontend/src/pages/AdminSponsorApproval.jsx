import React, { useEffect, useState } from "react";
import axios from "axios";
import { Inbox, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import ModernLayout from "../components/Layout";
import dayjs from "dayjs";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const AdminPendingSponsorsPage = () => {
  const [pendingSponsors, setPendingSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/pending-sponsors")
      .then((response) => setPendingSponsors(response.data))
      .catch((err) => {
        console.error("Error fetching pending sponsors:", err);
        if (err.response?.status === 403) {
          Swal.fire({
            icon: "error",
            iconColor: "#ef4444", // merah terang (tailwind: red-500)
            title: "<strong>Access Denied</strong>",
            html: `<p>You do not have permission to view this page.</p>`,
            background: "#fff",
            color: "#1f2937",
            buttonsStyling: false,
            showConfirmButton: true,
            confirmButtonText: "OK",
            customClass: {
              popup: 'rounded-2xl shadow-md px-6 py-4',
              title: 'text-xl font-semibold mb-2 text-red-600',
              htmlContainer: 'text-sm text-gray-700',
              confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
            }
          }).then(() => navigate("/"));
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const fetchAndPreviewPDF = async (document) => {
    try {
      const res = await axios({
        url: `/api/sponsors/preview/${document}`,
        method: "GET",
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
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
        iconColor: "#dc2626",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2 text-red-700',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5'
        }
      });
      console.error(error);
    }
  };

const handleApprove = (username) => {
  Swal.fire({
    title: 'Are you sure?',
    html: `<p class="text-gray-700">This sponsor will be <strong class="text-green-600">approved</strong>.</p>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Approve',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    iconColor: '#22c55e',
    background: '#fff',
    color: '#1f2937',
    customClass: {
      popup: 'rounded-2xl shadow-md px-6 py-4',
      title: 'text-lg font-semibold mb-2 text-green-700',
      htmlContainer: 'text-sm',
      confirmButton: 'bg-green-600 text-white hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5',
      cancelButton: 'bg-gray-400 text-white hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 ml-2'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      setApproving(username);
      axios
        .put(`/api/approve-sponsor/${username}`)
        .then(() => {
          Swal.fire({
            icon: "success",
            iconColor: "#22c55e",
            title: "<strong>Success</strong>",
            html: `<p>Sponsor approved successfully</p>`,
            background: "#fff",
            color: "#1f2937",
            showConfirmButton: false,
            timer: 3000,
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-2xl shadow-md px-6 py-4',
              title: 'text-xl font-semibold mb-2 text-green-600',
              htmlContainer: 'text-sm text-gray-700',
            }
          });
          setPendingSponsors((prev) =>
            prev.filter((s) => s.user_sponsors.username !== username)
          );
        })
        .catch((err) => {
          console.error("Error approving sponsor:", err);
          Swal.fire({
            icon: "error",
            iconColor: "#ef4444",
            title: "<strong>Oops...</strong>",
            html: `<p>Failed to approve sponsor</p>`,
            background: "#fff",
            color: "#1f2937",
            showConfirmButton: true,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-2xl shadow-md px-6 py-4',
              title: 'text-xl font-semibold mb-2 text-red-600',
              htmlContainer: 'text-sm text-gray-700',
              confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5'
            }
          });
        })
        .finally(() => setApproving(null));
    }
  });
};


const handleReject = (username) => {
  Swal.fire({
    title: 'Are you sure?',
    html: `<p class="text-gray-700">This sponsor will be <strong class="text-red-600">rejected</strong>.</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Reject',
    cancelButtonText: 'Cancel',
    buttonsStyling: false,
    iconColor: '#dc2626',
    background: '#fff',
    color: '#1f2937',
    customClass: {
      popup: 'rounded-2xl shadow-md px-6 py-4',
      title: 'text-lg font-semibold mb-2 text-red-700',
      htmlContainer: 'text-sm',
      confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
      cancelButton: 'bg-gray-400 text-white hover:bg-gray-500 font-medium rounded-lg text-sm px-5 py-2.5 ml-2'
    }
  }).then((result) => {
    if (result.isConfirmed) {
      setApproving(username);
      axios
        .put(`/api/reject-sponsor/${username}`)
        .then(() => {
          Swal.fire({
            icon: "success",
            iconColor: "#22c55e",
            title: "<strong>Success</strong>",
            html: `<p>Sponsor rejected successfully</p>`,
            background: "#fff",
            color: "#1f2937",
            showConfirmButton: false,
            timer: 3000,
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-2xl shadow-md px-6 py-4',
              title: 'text-xl font-semibold mb-2 text-green-600',
              htmlContainer: 'text-sm text-gray-700'
            }
          });
          setPendingSponsors((prev) =>
            prev.filter((s) => s.user_sponsors.username !== username)
          );
        })
        .catch((err) => {
          console.error("Error rejecting sponsor:", err);
          Swal.fire({
            icon: "error",
            iconColor: "#dc2626",
            title: "<strong>Oops...</strong>",
            html: `<p>Failed to reject sponsor</p>`,
            background: "#fff",
            color: "#1f2937",
            showConfirmButton: true,
            confirmButtonText: "OK",
            buttonsStyling: false,
            customClass: {
              popup: 'rounded-2xl shadow-md px-6 py-4',
              title: 'text-xl font-semibold mb-2 text-red-600',
              htmlContainer: 'text-sm text-gray-700',
              confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5'
            }
          });
        })
        .finally(() => setApproving(null));
    }
  });
};



  return (
    <ModernLayout>
      <div className="p-6 bg-white min-h-screen w-full mx-auto">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-8 pt-2 uppercase">
          Sponsor Approval Request
        </h2>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : pendingSponsors.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
            <Inbox className="w-16 h-16 mb-4 text-primary" />
            <p className="text-lg font-medium">No pending sponsors</p>
            <p className="text-sm text-gray-400">You're all caught up 🎉</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead>
              <tr className="font-semibold text-xs text-primary uppercase">
                <th className="px-4 py-2 text-center">Name</th>
                <th className="px-4 py-2 text-center">Email</th>
                <th className="px-4 py-2 text-center">Requested At</th>
                <th className="px-4 py-2 text-center">NIB</th>
                <th className="px-4 py-2 text-center">Document</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {pendingSponsors.map((sponsor) => (
                <tr key={sponsor.sponsor_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-800 text-center">
                    {sponsor.user_sponsors.name}
                  </td>
                  <td className="px-4 py-2 text-gray-600 text-center">
                    {sponsor.user_sponsors.email}
                  </td>
                  <td className="px-4 py-2 text-gray-600 text-center">
                    <span className="font-medium">
                      {dayjs(sponsor.createdAt).format("DD MMMM YYYY, HH:mm")}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-600 text-center">
                    <span className="font-medium">{sponsor.nib}</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {sponsor.document ? (
                      <button
                        onClick={() => fetchAndPreviewPDF(sponsor.document)}
                        className="text-sm text-blue-600 underline hover:text-blue-800"
                      >
                        View Document
                      </button>
                    ) : (
                      <span className="text-sm text-gray-400">No document</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center items-center gap-2">
                      <button
                        onClick={() => handleApprove(sponsor.user_sponsors.username)}
                        disabled={approving === sponsor.user_sponsors.username}
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-semibold ${approving === sponsor.user_sponsors.username
                          ? "bg-primary cursor-not-allowed"
                          : "bg-primary hover:opacity-80"
                          }`}
                      >
                        {approving === sponsor.user_sponsors.username
                          ? "APPROVING..."
                          : "APPROVE"}
                      </button>
                      <button
                        onClick={() => handleReject(sponsor.user_sponsors.username)}
                        disabled={approving === sponsor.user_sponsors.username}
                        className={`text-xs px-3 py-1.5 rounded-lg text-white font-semibold ${approving === sponsor.user_sponsors.username
                          ? "bg-red-600 cursor-not-allowed"
                          : "bg-red-600 hover:opacity-80"
                          }`}
                      >
                        {approving === sponsor.user_sponsors.username
                          ? "REJECTING..."
                          : "REJECT"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PDF Preview Modal */}
      {pdfBlobUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-xl w-[90%] h-[90%] relative overflow-auto">
            <button
              className="absolute top-4 right-4 text-gray-700 hover:text-red-500"
              onClick={() => {
                setSelectedDocument(null);
                setPdfBlobUrl(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-full w-full overflow-y-auto flex justify-center">
              <Document
                file={pdfBlobUrl}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading={<p className="text-center text-gray-500">Loading PDF...</p>}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
                ))}
              </Document>
            </div>
          </div>
        </div>
      )}
    </ModernLayout>
  );
};

export default AdminPendingSponsorsPage;
