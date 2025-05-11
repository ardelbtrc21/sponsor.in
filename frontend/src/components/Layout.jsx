import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Logout, reset } from "../features/authSlice";
import defaultProfile from '../assets/profile_default.png';


const Navbar = ({ onToggleSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-white px-6 py-2 shadow-md flex items-center justify-between z-50 backdrop-blur-md bg-opacity-100">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <img
          src={user.profile_photo ? `/profile_photo/${user.profile_photo}` : defaultProfile}
          alt="User Avatar"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <button
          onClick={onToggleSidebar}
          className="focus:outline-none hover:scale-105 transition-transform"
        >
          <MoreVertical size={26} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-white rounded-full" />
        <span className="text-xl font-bold tracking-wide">sponsor.in</span>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    try {
      Swal.fire({
        title: "<strong>End Session?</strong>",
        html: `<p>Are you sure you want to logout?</p>`,
        icon: "warning",
        iconColor: "#fbbf24", // Tailwind yellow-400
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        background: "#fff",
        color: "#1f2937", // Tailwind gray-800
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2',
          cancelButton: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5'
        }
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
  const NAVBAR_HEIGHT = "56px";
  return (
    <>
      {/* Sidebar */}
      <div
        style={{ top: NAVBAR_HEIGHT, height: `calc(100% - ${NAVBAR_HEIGHT})` }}
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 p-6 text-base font-medium">
          <li>
            <Link
              to="/"
              onClick={onClose}
              className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
            >
              Home
            </Link>
          </li>
          {user && user.role === "Sponsoree" && (
            <li>
              <Link
                to="/sponsors"
                onClick={onClose}
                className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
              >
                List Sponsor
              </Link>
              <Link
                to="/sponsoree-submissions"
                onClick={onClose}
                className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
              >
                My Submissions
              </Link>
            </li>
          )}
          {user && user.role === "Admin" && (
            <li>
              <Link
                to="/list-reported-account"
                onClick={onClose}
                className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
              >
                List Reported Accounts
              </Link>
            </li>

          )}
          {user && user.role === "Sponsor" && (
            <li>
              <Link
                to="/list-approval-proposal"
                onClick={onClose}
                className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
              >
                List Approval Proposal
              </Link>
            </li>

          )}
          <li>
            <Link
              to={`/account-setting/${(user && user.username)}`}
              onClick={onClose}
              className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
            >
              Setting Account
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              onClick={onClose}
              className="w-full block py-2 rounded-md hover:bg-gray-100 transition"
            >
              About
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left block py-2 rounded-md hover:bg-gray-100 transition"
            >
              Logout
            </button>
          </li>
        </ul>

      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  );
};

const ModernLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100 pt-14">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-24 flex items-center gap-2 bg-white shadow-lg px-5 py-2 rounded-full text-primary font-semibold text-sm hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 z-40 ${isSidebarOpen ? "left-72" : "left-6"
          }`}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default ModernLayout;