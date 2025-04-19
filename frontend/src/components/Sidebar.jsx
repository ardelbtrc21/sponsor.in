// src/components/Sidebar.js
import React from 'react';

const Sidebar = () => {
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logged out");
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-800 text-white">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">Sponsor.in</h1>
      </div>
      <nav className="flex-1 p-4">
        <ul>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Dashboard</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Profile</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Settings</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Messages</a>
          </li>
          <li className="mb-2">
            <a href="#" className="block p-2 rounded hover:bg-gray-700">Help</a>
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