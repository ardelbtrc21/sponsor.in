import React from "react";
import "../Style/styles.css";

const Header = () => {
  return (
    <header className="hdr shadow-md py-1 px-6 flex items-center">
      <img src="/logo.png" alt="Logo" className="h-8 w-8 mr-3" />
      <h1 className="text-xl font-bold">Sponsor.in</h1>
    </header>
  );
};

export default Header;