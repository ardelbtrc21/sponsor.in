// CreateProposalForm.jsx
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { DatePicker, Modal, Select, Space } from "antd";
import { useParams } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { Dialog, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";


const ListApprovalProposal = () => {
  const navigate = useNavigate();
  const { id: sponsorId } = useParams();
  const { RangePicker } = DatePicker;
  const [proposals, setProposals] = useState([]);
  const [proposalName, setProposalName] = useState("");
  const [file_proposal, setFileProposal] = useState(null);
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState([]);
  const [eventLocation, setEventLocation] = useState("");
  const [targetAgeMin, setTargetAgeMin] = useState("");
  const [targetAgeMax, setTargetAgeMax] = useState("");
  const [targetGender, setTargetGender] = useState("");
  const [message, setMessage] = useState("");
  const [sponsoree_id, setSponsoreeId] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [tagRelated, setTagRelated] = useState([]);
  const [targetParticipant, setTargetParticipant] = useState([]);
  const [status, setStatus] = useState([]);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [tagsDB, SetTagsDB] = useState([]);
  const filteredTags = tagsDB.filter(o => !tagRelated.includes(o));
  //pagination
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);

  //filter tanggal dan kategori
  // const [openFilterModal, setOpenFilterModal] = useState(false);
  // const [confirmLoading, setConfirmLoading] = useState(false);
  // const [filterEventDate, setFilterEventDate] = useState("");
  // const [filterEventLocation, setFilterEventLocation] = useState([]);
  // const [filterTargetAgeMin, setFilterTargetAgeMin] = useState([]);
  // const [filterTargetAgeMax, setFilterTargetAgeMax] = useState([]);
  // const [filterTargetGender, setFilterTargetGender] = useState([]);
  // const [filterTagRelated, setFilterTagRelated] = useState([]);
  // const [filterTargetParticipant, setFilterTargetParticipant] = useState("");
  // const [filterStatus, setFilterStatus] = useState("");

  //urutan tabel
  const [sortBy, setSortBy] = useState("");
  const [flagOrder, setFlagOrder] = useState(1);
  const [order, setOrder] = useState("DESC");

  //searching
  const [keyword, setKeyword] = useState("");

  const { user } = useSelector((state) => state.auth);
  let username;
  if (user && user.username) {
    username = user.username
  }

  const applyFilter = () => {
    setIsFilterOpen(false);
    getProposals()
  };

  
  const getTags = async () => {
    try {
      const response = await axios.get("/api/tags");
      const tagNames = response.data.map(item => item.tag_name);
      SetTagsDB(tagNames);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterOpen = () =>{
    getTags()
    setIsFilterOpen(true)
  }

  const getProposals = async () => {
    try {
      // const response = await axios.get(`/api/changes?sortBy=${sortBy}&order=${order}&keyword=${keyword}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&filter=${filterCategory}`);
      const response = await axios.post("/api/proposals", {
        sortBy: sortBy,
        order: order,
        keyword: keyword,
        page: page,
        limit: limit,
        filter: {
          startDate: eventDate[0],
          endDate: eventDate[1],
          eventLocation: eventLocation,
          targetAgeMin: targetAgeMin,
          targetAgeMax: targetAgeMax,
          targetGender: targetGender,
          tagRelated: tagRelated,
          targetParticipant: targetParticipant,
          status: status
        }

      });
      setProposals(response.data.result);
      setPages(response.data.totalPage);
      setRows(response.data.totalRows);
    } catch (error) {
      navigate("/dashboard");
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.msg,
      });
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      // toggle order
      setOrder(order === "ASC" ? "DESC" : "ASC");
    } else {
      setSortBy(field);
      setOrder("ASC"); // default saat ganti kolom sort
    }
  };

  const proposalPage = ({ selected }) => {
    setPage(selected);
  };

  //pagination limit
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOkFilterModal = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenFilterModal(false);
      setConfirmLoading(false);
    }, 0);
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      getProposals();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [keyword, sortBy, order]);

  // useEffect(() => {
  //   const delayDebounce = setTimeout(() => {
  //     getTags();
  //   }, 1000);
  //   return () => clearTimeout(delayDebounce);
  // })

  const handleCancelModal = () => {
    setOpenFilterModal(false);
  };

  return (
    <ModernLayout>
      <div className="p-6 bg-white min-h-screen w-full mx-auto">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-8 pt-2">SPONSORSHIP REQUESTS</h2>

        <div className="flex justify-between items-center mb-4">
          <div className="relative w-1/4">
            <MagnifyingGlassIcon className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by proposal or event name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="pl-10 pr-3 py-1.5 border rounded-md w-full text-sm focus:outline-none"
            />
          </div>
          <button
            onClick={() => handleFilterOpen()}
            className="bg-primary text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Filter
          </button>
        </div>

        <Transition appear show={isFilterOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={() => setIsFilterOpen(false)}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title as="h3" className="flex justify-center text-base font-medium text-gray-900 mb-4">
                      FILTER PROPOSAL
                    </Dialog.Title>

                    {/* Dropdown Tag */}
                    <div className="mb-4 w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Tags Related Event
                      </label>
                      <div className="w-full">
                        <Select
                          mode="multiple"
                          name="tags"
                          placeholder="Search here"
                          value={tagRelated}
                          onChange={(e) => setTagRelated(e)}
                          options={filteredTags.map(item => ({ value: item, label: item }))}
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    {/* Date Range Filter */}
                    <div className="mb-4 w-full">
                      <label className="block mb-2 text-sm font-medium text-gray-900">
                        Event Date Range
                      </label>
                      <RangePicker
                        style={{ width: '100%' }}
                        value={
                          eventDate && eventDate.length === 2
                            ? [dayjs(eventDate[0]), dayjs(eventDate[1])]
                            : null
                        }
                        onChange={(dates, dateStrings) => {
                          if (dates) {
                            setEventDate(dateStrings);
                          } else {
                            setEventDate([]);
                          }
                        }}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                        onClick={() => setIsFilterOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="bg-primary text-white px-4 py-2 text-sm rounded hover:bg-gray-700"
                        onClick={applyFilter}
                      >
                        Apply Filter
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="font-semibold text-xs text-primary uppercase">
              {[
                { label: "Proposal Title", key: "proposal_name" },
                { label: "Event Name", key: "event_name" },
              ].map(({ label, key }) => {
                const isActive = sortBy === key;
                const isAsc = order === "ASC";

                return (
                  <th
                    key={key}
                    className="px-4 py-2 text-center cursor-pointer"
                    onClick={() => handleSort(key)}
                  >
                    <div className="flex items-center justify-center gap-1">
                      {label}
                      <span className="flex flex-col">
                        <ChevronUpIcon
                          className={`w-3 h-3 ${isActive && isAsc ? "text-gray-800" : "text-gray-400"}`}
                        />
                        <ChevronDownIcon
                          className={`w-3 h-3 ${isActive && !isAsc ? "text-gray-800" : "text-gray-400"}`}
                        />
                      </span>
                    </div>
                  </th>
                );
              })}
              <th className="px-4 py-2 text-center">Event Date</th>
              <th className="px-4 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {proposals.map((proposal, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-800 text-left max-w-xs break-words">
                  <div className="mb-2 break-words">
                    {proposal.proposal_name}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {proposal.tags_proposals?.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag.tag_name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2 text-gray-600 text-center">
                  {proposal.event_name}
                </td>
                <td className="px-4 py-2 text-gray-600 text-center">
                  {new Date(proposal.event_date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-2 text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      className="bg-primary text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700"
                      onClick={() => navigate(`/proposal/detail/${proposal.proposal_id}`)}
                    >
                      VIEW PROPOSAL DETAIL
                    </button>
                    <button className="text-gray-700 hover:text-gray-900">
                      <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModernLayout>
  );
};

export default ListApprovalProposal;