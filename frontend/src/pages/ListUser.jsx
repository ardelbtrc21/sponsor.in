// CreateProposalForm.jsx
import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux"; // untuk ambil dari auth state
import axios from "axios";
import { DatePicker, Select, Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ModernLayout from "../components/Layout";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";


const ListUser = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("Sponsor");

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

    const reasonOption = [
        { value: "Your Reason", label: "Your Reason" },
        { value: "Fraud", label: "Fraud" },
        { value: "Inappropriate Content", label: "Inappropriate Content" },
        { value: "Scam", label: "Scam" },
        { value: "Harassment", label: "Harassment" },
        { value: "Other", label: "Other" },
    ];

    const handleViewAccount = async (username) => {
        try {
            const response = await axios.get(`/api/user/${username}`)
            if (response.data.user_sponsors) {
                navigate(`/sponsors/${username}`)
            }
            if (response.data.user_sponsorees) {
                navigate(`/sponsorees/${username}`)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getUsers = async () => {
        try {
            const response = await axios.get(`/api/users?sortBy=${sortBy}&order=${order}&keyword=${keyword}&role_req=${activeTab}`);
            setUsers(response.data.result);
            setPages(response.data.totalPage);
            setRows(response.data.totalRows);
        } catch (error) {
            navigate("/home");
            Swal.fire({
                title: "<strong>Oops...</strong>",
                html: `<p>${error.response.data.msg}</p>`,
                icon: "error",
                iconColor: "#dc2626", // red-600
                showCancelButton: false,
                confirmButtonText: "OK",
                background: "#fff",
                color: "#1f2937",
                buttonsStyling: false,
                customClass: {
                    popup: 'rounded-2xl shadow-md px-6 py-4',
                    title: 'text-xl font-semibold mb-2',
                    htmlContainer: 'text-sm text-gray-700',
                    confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5',
                },
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

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            getUsers();
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [sortBy, order, keyword, activeTab]);

    return (
        <ModernLayout>
            <div className="p-6 bg-white min-h-screen w-full mx-auto">
                <h2 className="text-xl font-bold text-center text-gray-800 mb-8 pt-2 uppercase">List Users</h2>
                <div className="flex justify-between items-center mb-4">
                    <div className="relative w-1/4">
                        <MagnifyingGlassIcon className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by username or name..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="pl-10 pr-3 py-1.5 border rounded-md w-full text-sm focus:outline-none"
                        />
                    </div>
                </div>
                <div className="mb-6 w-full">
                    <Tabs
                        activeKey={activeTab}
                        onChange={(key) => setActiveTab(key)}
                        className="w-full"
                        items={[
                            "Sponsor",
                            "Sponsoree"
                        ].map((status) => ({
                            label: status,
                            key: status,
                        }))}
                    />
                </div>
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                        <tr className="font-semibold text-xs text-primary uppercase">
                            <th className="px-4 py-2 text-center">Username</th>
                            <th className="px-4 py-2 text-center">Name</th>
                            <th className="px-4 py-2 text-center">Email</th>
                            <th className="px-4 py-2 text-center">Role</th>
                            {[
                                { label: "Last Login", key: "last_login" },
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
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-gray-800 text-center">
                                    <span
                                        onClick={() => handleViewAccount(item.username)}
                                        className="text-gray-600 font-medium hover:underline cursor-pointer"
                                    >
                                        {item.username}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {item.name}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {item.email}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {item.role}
                                </td>
                                <td className="px-4 py-2 text-gray-600 text-center">
                                    {new Date(item.last_login).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ModernLayout>
    );
};

export default ListUser;