// src/components/Sidebar.js
import React from 'react';
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { Logout, reset, getMe } from "../features/authSlice";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
     const { user } = useSelector((state) => state.auth);
    const handleLogout = () => {
        try {
            Swal.fire({
                title: "Are you sure to end this session ?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Logout!"
            }).then((result) => {
                if (result.isConfirmed) {
                    dispatch(Logout());
                    dispatch(reset());
                    navigate("/");
                }
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error.response.data.msg,
            });
        }
    };

    return (
        <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
                <h1 className="text-xl font-bold">Sponsor.in</h1>
            </div>
            <nav className="flex-1 p-4">
                <ul>
                    <li className="mb-2">
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">Dummy</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">Dummy</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">Dummy</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">Dummy</a>
                    </li>
                    <li className="mb-2">
                        <a href="#" className="block p-2 rounded hover:bg-gray-700">Dummy</a>
                    </li>
                </ul>
            </nav>
            <div className="p-4">
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;