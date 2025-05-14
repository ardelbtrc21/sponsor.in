import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Spin } from "antd";
import { CalendarDays, UserCircle2 } from "lucide-react";

const HistoryAgreement = ({ username, role, isMyProfile }) => {
  const { user } = useSelector((state) => state.auth);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  const viewingUsername = username || user?.username;
  const viewingRole = role || user?.role;

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get("/api/agreements/history", {
          params: {
            username: viewingUsername,
            role: viewingRole,
          },
        });
        setAgreements(response.data);
      } catch (error) {
        console.error("Error fetching agreements:", error);
      } finally {
        setLoading(false);
      }
    };

    if (viewingUsername && viewingRole) {
      fetchAgreements();
    } else {
      setLoading(false);
    }
  }, [viewingUsername, viewingRole]);

  return (
    <div className="mt-6 px-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold text-center text-[#031930] mb-8">
        {isMyProfile ? "My Sponsorship History" : "Agreement History"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Spin size="large" tip="Loading Agreements..." />
        </div>
      ) : agreements.length === 0 ? (
        <div className="text-center text-gray-500">
          <p className="text-lg">No completed agreements found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {agreements.map((agreement, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition duration-300"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2 tracking-wide">
                {agreement.event_name}
              </h3>
              <div className="text-sm text-gray-600 flex items-center mb-1">
                <CalendarDays className="w-4 h-4 mr-2 text-primary" />
                Date:{" "}
                <span className="ml-1 font-medium text-gray-800">
                  {new Date(agreement.event_date).toLocaleDateString()}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center mb-1">
                <UserCircle2 className="w-4 h-4 mr-2 text-blue-500" />
                Sponsor:{" "}
                <span className="ml-1 font-medium text-gray-800">
                  {agreement.sponsor_username}
                </span>
              </div>
              <div className="text-sm text-gray-600 flex items-center">
                <UserCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Sponsoree:{" "}
                <span className="ml-1 font-medium text-gray-800">
                  {agreement.sponsoree_username}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryAgreement;