import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSelector } from "react-redux";

const MilestoneListPage = () => {
    const { user } = useSelector((state) => state.auth); 
    const [milestones, setMilestones] = useState([]);
    const navigate = useNavigate();
  
    useEffect(() => {
        if (user && user.username) {
          axios
            .get(`/api/milestones/pending/${user.username}`)
            .then((res) => setMilestones(res.data))
            .catch((err) => console.error(err));
        }
      }, [user]);

  return (
    <div className="flex flex-col min-h-screen max-w">
      <Header />
      <div className="flex-1 py-10 px-6 max-w-screen-xl mx-auto">
        <h1 className="text-4xl text-primary font-bold flex justify-center tracking-wider mb-8">
          YOUR MILESTONES
        </h1>

        {milestones.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center text-gray-500 mt-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v12a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-lg font-bold text-primary">No milestones found</h2>
            <p className="text-sm text-gray-400 mt-1">They'll appear here once created.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone) => (
              <div
                key={milestone.milestone_id}
                onClick={() => navigate(`/milestones/${milestone.milestone_id}`)}
                className="bg-white border rounded-xl px-6 py-4 hover:shadow-lg transition cursor-pointer"
              >
                <h2 className="text-xl font-semibold text-primary">{milestone.milestone_name}</h2>
                <p className="text-secondary my-2">{milestone.milestone_description}</p>
                <p className="text-sm text-gray-500">Created at: {new Date(milestone.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MilestoneListPage;
