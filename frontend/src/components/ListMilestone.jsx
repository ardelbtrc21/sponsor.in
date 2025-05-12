import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const ListMilestone = ({ milestones }) => {
  const navigate = useNavigate();

  const renderStatusBadge = (status) => {
    let bgColor = "bg-gray-400";
    if (status === "Completed") bgColor = "bg-green-500";
    else if (status === "Revision Required") bgColor = "bg-yellow-500";

    return (
      <span className={`ml-2 px-2 py-1 rounded-full text-white text-xs ${bgColor}`}>
        {status || "Not Set"}
      </span>
    );
  };

  return (
    <div className="relative max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-primary text-center tracking-wide">
        LIST OF MILESTONES
      </h2>

      {milestones.length > 0 ? (
        <table className="table-fixed w-full border-collapse">
          <thead>
            <tr className="border-b text-center">
              <th className="w-[20%]">Milestone Name</th>
              <th className="px-4 py-2 w-[30%]">Description</th>
              <th className="px-4 py-2 w-[20%]">Created At</th>
              <th className="px-4 py-2 w-[15%]">Status</th>
              <th className="px-4 py-2 w-[15%]">Action</th>
            </tr>
          </thead>
          <tbody>
            {milestones.map((milestone) => {
              const status =
                milestone.status_milestones?.[0]?.status_name || "Not Set";

              return (
                <tr
                  key={milestone.milestone_id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-2 font-medium text-primary truncate whitespace-nowrap" title={milestone.milestone_name}>
                    {milestone.milestone_name}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600 truncate whitespace-nowrap" title={milestone.milestone_description}>
                    {milestone.milestone_description}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-500 truncate whitespace-nowrap" title={dayjs(milestone.createdAt).format("DD MMM YYYY, HH:mm")}>
                    {dayjs(milestone.createdAt).format("DD MMM YYYY, HH:mm")}
                  </td>
                  <td className="px-4 py-2">{renderStatusBadge(status)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() =>
                        navigate(`/milestones/${milestone.milestone_id}`)
                      }
                      className="text-blue-500 hover:underline"
                    >
                      View Detail
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          No milestones found.
        </p>
      )}
    </div>
  );
};

export default ListMilestone;

