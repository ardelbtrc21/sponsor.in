import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MoreVertical, X } from "lucide-react";

const Navbar = ({ onToggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-primary text-white px-6 py-4 shadow-md flex items-center justify-between z-50 backdrop-blur-md bg-opacity-100">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <img
          src="https://i.pravatar.cc/300"
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
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-xl transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b shadow-sm">
          <h2 className="text-2xl font-semibold">Menu</h2>
          <button onClick={onClose}>
            <X size={28} />
          </button>
        </div>

        <ul className="flex flex-col gap-5 p-6 text-lg font-medium">
          <li>
            <Link to="/" onClick={onClose}>Home</Link>
          </li>
          <li>
            <Link to="/sponsors" onClick={onClose}>Sponsors</Link>
          </li>
          <li>
            <Link to="/about" onClick={onClose}>About</Link>
          </li>
          <li>
            <button onClick={() => alert("Logging out...")}>Logout</button>
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
    <div className="relative flex flex-col min-h-screen bg-gray-100 pt-20">
      {/* Navbar */}
      <Navbar onToggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className={`fixed top-24 flex items-center gap-2 bg-white shadow-lg px-5 py-2 rounded-full text-primary font-semibold text-sm hover:bg-blue-100 hover:text-blue-600 transition-all duration-300 z-40 ${
          isSidebarOpen ? "left-72" : "left-6"
        }`}
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {/* Page Content */}
      <main className="flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default ModernLayout;