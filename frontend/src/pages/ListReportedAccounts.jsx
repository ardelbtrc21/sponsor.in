// CreateProposalForm.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { DatePicker, Select } from "antd";
import { useParams } from "react-router-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { Dialog, Transition } from '@headlessui/react';
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";


const ListReportedAccount = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const [reports, setReports] = useState([]);
    const [eventDate, setEventDate] = useState([]);
    const [tagRelated, setTagRelated] = useState([]);
    const [openFilterModal, setOpenFilterModal] = useState(false);
    const [reason, setReason] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tagsDB, SetTagsDB] = useState([]);
    const filteredTags = tagsDB.filter(o => !tagRelated.includes(o));
    const [expandedRows, setExpandedRows] = useState({});

    //pagination
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);

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
        getReports()
    };

    const handleFilterOpen = () => {
        setIsFilterOpen(true)
    }

    const toggleReadMore = (index) => {
        setExpandedRows((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handleBanAccount = async (username) => {
        try {
            await axios.patch("/api/banAccount", {
                username: username
            })
            Swal.fire({
                title: "Ban Account Successful!",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
                text: "Your request has been successfully added"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.msg,
            });
        }
    }

    const handleViewAccount = async (username) => {
        try {
            const response = await axios.get(`/api/user/${username}`)
            console.log(response.data)
            if (response.data.user_sponsors) {
                navigate(`/sponsors/${username}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getReports = async () => {
        try {
            // const response = await axios.get(`/api/changes?sortBy=${sortBy}&order=${order}&keyword=${keyword}&page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}&filter=${filterCategory}`);
            const response = await axios.post("/api/list-reports", {
                sortBy: sortBy,
                order: order,
                page: page,
                limit: limit,
                filter: {
                    reason: reason
                }
            });
            setReports(response.data.result);
            setPages(response.data.totalPage);
            setRows(response.data.totalRows);
        } catch (error) {
            navigate("/home");
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

    const reportsPage = ({ selected }) => {
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
            getReports();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [sortBy, order]);

    const handleCancelModal = () => {
        setOpenFilterModal(false);
    };

    return (
        <ModernLayout>
            <div className="p-6 bg-white min-h-screen w-full mx-auto">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-8 pt-2 uppercase">List Reported Accounts</h2>

                <div className="flex justify-end items-center mb-4">
                    <button
                        onClick={handleFilterOpen}
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
                                            {/* <div className="w-full">
                        <Select
                          mode="multiple"
                          name="tags"
                          placeholder="Search here"
                          value={tagRelated}
                          onChange={(e) => setTagRelated(e)}
                          options={filteredTags.map(item => ({ value: item, label: item }))}
                          style={{ width: '100%' }}
                        />
                      </div> */}
                                        </div>

                                        {/* Date Range Filter */}
                                        {/* <div className="mb-4 w-full">
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
                    </div> */}

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
                            <th className="px-4 py-2 text-center">Created For</th>
                            <th className="px-4 py-2 text-center">Created By</th>
                            <th className="px-4 py-2 text-center">Reason</th>
                            <th className="px-4 py-2 text-center">Description</th>
                            {[
                                { label: "Created At", key: "createdAt" },
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
                            <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {reports.map((report, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-800 text-center">
                                    {report.created_for}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {report.created_by}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {report.reason}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center max-w-xs break-words">
                                    {report.description.length > 150 ? (
                                        <>
                                            {expandedRows[index]
                                                ? report.description
                                                : `${report.description.slice(0, 150)}... `}
                                            <button
                                                onClick={() => toggleReadMore(index)}
                                                className="text-primary underline text-xs opacity-70"
                                            >
                                                {expandedRows[index] ? "Show less" : "Read more"}
                                            </button>
                                        </>
                                    ) : (
                                        report.description
                                    )}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {new Date(report.createdAt).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <div className="flex justify-center items-center gap-2">
                                        <button
                                            className="border border-primary text-primary font-semibold text-xs px-3 py-1.5 rounded-lg bg-transparent hover:bg-primary hover:text-white transition"
                                            onClick={() => handleViewAccount(report.created_for)}
                                        >
                                            VIEW ACCOUNT
                                        </button>
                                        <button
                                            className="bg-red-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-red-700"
                                            onClick={() => handleBanAccount(report.created_for)}
                                        >
                                            BAN ACCOUNT
                                        </button>
                                        {/* <button className="text-gray-700 hover:text-gray-900">
                                            <ArrowDownTrayIcon className="h-4 w-4" />
                                        </button> */}
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

export default ListReportedAccount;