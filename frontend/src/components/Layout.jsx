import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Logout, reset } from "../features/authSlice";
import defaultProfile from '../assets/profile_default.png';
import sponsorinLogo from "../assets/sponsorin_logo.png";

const Navbar = ({ onToggleSidebar }) => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const handleProfileClick = () => {
    if (user?.username && user?.role !== "Admin") {
      navigate(`/my-profile`);
    }
  };
  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-white px-6 py-2 shadow-md flex items-center justify-between z-50 backdrop-blur-md bg-opacity-100">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <img
          src={user.profile_photo ? `/profile_photo/${user.profile_photo}` : defaultProfile}
          alt="User Avatar"
          onClick={handleProfileClick}
          className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
        />
        <button
          onClick={onToggleSidebar}
          className="focus:outline-none hover:scale-105 transition-transform"
        >
          <MoreVertical size={26} />
        </button>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <img
          src={sponsorinLogo}
          alt="Sponsor.in Logo"
          className="h-8 w-8 object-cover rounded-full"
        />
        <span className="text-l font-bold tracking-wide">sponsor.in</span>
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
        iconColor: "#fbbf24",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        background: "#fff",
        color: "#1f2937",
        buttonsStyling: false,
        customClass: {
          popup: 'rounded-2xl shadow-md px-6 py-4',
          title: 'text-xl font-semibold mb-2',
          htmlContainer: 'text-sm text-gray-700',
          confirmButton: 'bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2',
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
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shadow-sm">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <ul className="flex flex-col gap-2 p-6 text-base font-medium">
          {user && user.role !== "Admin" && (
            <li>
              <Link to="/my-profile" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                My Profile
              </Link>
            </li>
          )}
          {user && user.role === "Sponsoree" && (
            <>
              <li>
                <Link to="/sponsors" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                  List Sponsor
                </Link>
              </li>
              <li>
                <Link to="/sponsoree-submissions" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                  My Submissions
                </Link>
              </li>
            </>
          )}
          {user && user.role === "Admin" && (
            <>
              <li>
                <Link to="/list-users" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                  List Users
                </Link>
              </li>
              <li>
                <Link to="/pending-sponsors" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                  Sponsors Request Lists
                </Link>
              </li>
              <li>
                <Link to="/list-reported-account" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                  Reported Account Lists
                </Link>
              </li>
            </>
          )}
          {user && user.role === "Sponsor" && (
            <li>
              <Link to="/list-approval-proposal" onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
                List Approval Proposal
              </Link>
            </li>
          )}
          <li>
            <Link to={`/account-setting/${user?.username}`} onClick={onClose} className="w-full block py-2 rounded-md hover:bg-gray-100 transition">
              Setting Account
            </Link>
          </li>
        </ul>

        {/* Logout Button at Bottom */}
        <div className="absolute bottom-4 w-full px-6">
          <button
            onClick={handleLogout}
            className="w-full py-2 text-white bg-red-600 hover:bg-red-700 rounded-full font-semibold transition"
          >
            Sign Out
          </button>
        </div>
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

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-100 pt-14">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-24 left-6 flex items-center gap-2 bg-white shadow-lg px-5 py-2 rounded-full text-primary font-semibold text-sm hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 z-10"
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