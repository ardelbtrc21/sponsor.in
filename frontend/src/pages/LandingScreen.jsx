import React from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import { CheckCircle, FileText, Flag, Search, User } from "lucide-react";

const LandingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-custom-gradient text-white flex flex-col text-sm">
      {/* Navbar */}
      <div className="flex justify-between items-center w-full py-3 px-4 fixed top-0 left-0 z-10 bg-gradient">
        <div className="text-base font-bold text-primary ml-2">Sponsor.in</div>
        <div className="space-x-2">
          <button
            onClick={() => navigate("/signIn")}
            className="bg-primary border-2 border-primary hover:bg-opacity-70 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signUp")}
            className="bg-none border-2 border-primary hover:bg-primary hover:text-white text-primary text-sm font-semibold px-4 py-1.5 rounded-lg transition"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-1 items-center justify-center px-4 mt-24 mb-6">
        <div className="text-center max-w-xl">
          <h1 className="text-primary text-xl md:text-2xl font-bold tracking-wide pt-4">
            CONNECTING SPONSORS & SPONSOR SEEKERS
          </h1>
          <p className="text-primary text-sm md:text-base mt-2 mb-4 px-2">
            "Find the right sponsor for your events or discover promising opportunities to support—all in one platform."
          </p>
          <div className="space-x-2 mt-2">
            <button
               onClick={() => navigate("/signIn")}
              className="bg-primary border-2 border-primary hover:bg-opacity-70 text-white font-medium text-sm px-6 py-2 rounded-lg transition"
            >
              FIND A SPONSOR
            </button>
            <button
               onClick={() => navigate("/signIn")}
              className="bg-none border-2 border-primary hover:bg-primary hover:text-white text-primary font-medium text-sm px-6 py-2 rounded-lg transition"
            >
              BECOME A SPONSOR
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full mt-6 mb-8 px-4">
        <ImageCarousel />
      </div>

      {/* How it Works Title */}
      <div className="flex justify-center px-4 mb-2">
        <h1 className="text-white text-lg md:text-xl font-bold tracking-wide">HOW IT WORKS?</h1>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 px-4 mb-4">
        <div className="text-center">
          <User size={28} className="mx-auto text-white mb-1" />
          <h3 className="text-white text-xs font-medium">Create Profile</h3>
        </div>
        <div className="text-center">
          <Search size={28} className="mx-auto text-white mb-1" />
          <h3 className="text-white text-xs font-medium">Explore</h3>
        </div>
        <div className="text-center">
          <FileText size={28} className="mx-auto text-white mb-1" />
          <h3 className="text-white text-xs font-medium">Submit Document</h3>
        </div>
        <div className="text-center">
          <CheckCircle size={28} className="mx-auto text-white mb-1" />
          <h3 className="text-white text-xs font-medium">Review</h3>
        </div>
        <div className="text-center">
          <Flag size={28} className="mx-auto text-white mb-1" />
          <h3 className="text-white text-xs font-medium">Finish</h3>
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;