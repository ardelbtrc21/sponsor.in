import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "./Header";
import Footer from "./Footer";
import { Spin } from "antd";

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
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold text-center text-primary">
          {isMyProfile ? `My History Sponsorship` : `Agreement History`}
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
          <div className="flex flex-col w-full">
            {agreements.map((agreement, index) => (
              <div
                key={index}
                className="w-full flex flex-col md:flex-row justify-between items-start md:items-center px-4 py-4 border-b border-gray-300"
              >
                <div className="flex-1 space-y-1">
                  <h2 className="text-lg font-bold text-gray-800">
                    {agreement.event_name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(agreement.event_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sponsor: {agreement.sponsor_username}
                  </p>
                  <p className="text-sm text-gray-600">
                    Sponsoree: {agreement.sponsoree_username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryAgreement;
