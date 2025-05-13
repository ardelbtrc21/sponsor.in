import React from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import { CheckCircle, FileText, Flag, Search, User } from "lucide-react";

const LandingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-custom-gradient text-white flex flex-col text-sm">
      {/* Navbar */}
      <div className="flex justify-between items-center w-full py-3 px-4 fixed top-0 left-0 z-10">
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
      <div className="flex flex-1 items-center justify-center px-4 mt-20 mb-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-primary text-2xl md:text-3xl font-bold tracking-wider pt-16">
            CONNECTING SPONSORS & SPONSOR SEEKERS
          </h1>
          <p className="text-primary text-base md:text-lg mt-4 mb-6 px-4">
            "Find the right sponsor for your events or discover promising opportunities to support—all in one platform."
          </p>
          <div className="space-x-2">
            <button
              onClick={() => navigate("/")}
              className="bg-primary border-2 border-primary hover:bg-opacity-70 text-white font-medium text-sm px-6 py-2 rounded-lg transition"
            >
              FIND A SPONSOR
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-none border-2 border-primary hover:bg-primary hover:text-white text-primary font-medium text-sm px-6 py-2 rounded-lg transition"
            >
              BECOME A SPONSOR
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div className="w-full mt-10 mb-10">
        <ImageCarousel />
      </div>

      {/* How it Works Title */}
      <div className="flex justify-center px-4 mt-4 mb-4">
        <h1 className="text-white text-xl md:text-2xl font-bold tracking-wider">HOW IT WORKS?</h1>
      </div>

      {/* Steps */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 px-4 mt-4 mb-6">
        <div className="text-center">
          <User size={36} className="mx-auto text-white mb-2" />
          <h3 className="text-white text-sm font-semibold">Create Profile</h3>
        </div>
        <div className="text-center">
          <Search size={36} className="mx-auto text-white mb-2" />
          <h3 className="text-white text-sm font-semibold">Explore</h3>
        </div>
        <div className="text-center">
          <FileText size={36} className="mx-auto text-white mb-2" />
          <h3 className="text-white text-sm font-semibold">Submit Document</h3>
        </div>
        <div className="text-center">
          <CheckCircle size={36} className="mx-auto text-white mb-2" />
          <h3 className="text-white text-sm font-semibold">Review</h3>
        </div>
        <div className="text-center">
          <Flag size={36} className="mx-auto text-white mb-2" />
          <h3 className="text-white text-sm font-semibold">Finish</h3>
        </div>
      </div>

      {/* CTA Button */}
      <div className="flex justify-center px-4 mt-6 mb-12">
        <button
          onClick={() => navigate("/")}
          className="bg-white border-2 border-primary hover:opacity-80 text-primary font-semibold text-sm px-16 py-2 rounded-lg transition"
        >
          GET STARTED NOW
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;