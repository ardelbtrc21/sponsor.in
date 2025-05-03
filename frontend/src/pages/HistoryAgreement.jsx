import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Spin } from "antd";

const HistoryAgreement = () => {
  const { user } = useSelector((state) => state.auth);
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgreements = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/agreements/history", {
          params: {
            username: user?.username,
            role: user?.role
          }
        });
        setAgreements(response.data);
      } catch (error) {
        console.error("Error fetching agreements:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.username && user?.role) {
      fetchAgreements();
    } else {
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 py-8">
        <h1 className="text-4xl text-primary font-bold flex justify-center tracking-wider mb-6">
          MY HISTORY SPONSORSHIP
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Spin size="large" tip="Loading Agreements..." />
          </div>
        ) : agreements.length === 0 ? (
          <div className="text-center text-gray-500">
            <p className="text-lg">No completed agreements found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agreements.map((agreement, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <h2 className="text-lg font-semibold text-gray-800">
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
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HistoryAgreement;
