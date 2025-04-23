import React from "react";
import "../Style/styles.css";

const Footer = () => {
  return (
    <footer className="ftr bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
            <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
            </div>
        <div className="space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
            <a href="#" className="text-gray-400 hover:text-white">About Us</a>
        </div>
        </div>
    </footer>
  );
};

export default Footer;