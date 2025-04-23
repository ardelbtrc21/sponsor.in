import React, { useState } from "react";
import { MoreVertical, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blusponsorin text-white fixed top-0 left-0 w-full px-4 py-3 z-50 shadow-md flex items-center justify-between">
        {/* Kiri: Avatar + Dot menu */}
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/300"
            alt="User"
            className="w-8 h-8 rounded-full border-2 border-white"
          />
          <button onClick={toggleSidebar} className="focus:outline-none z-50">
            <MoreVertical size={24} />
          </button>
        </div>

        {/* Kanan: Logo + App Name */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-full" />
          <span className="text-lg font-semibold tracking-wide">sponsor.in</span>
        </div>
      </nav>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white text-black shadow-lg z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b shadow-sm">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button onClick={toggleSidebar}>
            <X size={24} />
          </button>
        </div>

        <ul className="p-4 space-y-3">
          <li>
            <Link to="/" onClick={() => setIsSidebarOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/sponsors" onClick={() => setIsSidebarOpen(false)}>Sponsors</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsSidebarOpen(false)}>About</Link>
          </li>
          <li>
            <button onClick={() => alert("Logging out...")}>Logout</button>
          </li>
        </ul>
      </div>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Navbar;