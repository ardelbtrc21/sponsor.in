import React from "react";
import { useNavigate } from "react-router-dom";
import ImageCarousel from "../components/ImageCarousel";
import { CheckCircle, FileText, Flag, Search, User } from "lucide-react";

const LandingScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-custom-gradient text-white flex flex-col">
      <div className="flex justify-between items-center w-full py-4 px-6 fixed top-0 left-0 z-10">
        <div className="text-lg font-bold text-primary ml-5">
          Sponsor.in
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate("/signIn")}
            className="bg-primary border-4 border-primary hover:bg-opacity-70 text-white tracking-widest font-semibold px-6 py-2 rounded-xl transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/signUp")}
            className="bg-none border-4 border-primary hover:bg-primary hover:text-white text-primary tracking-widest font-semibold px-6 py-2 rounded-xl transition duration-300"
          >
            Sign Up
          </button>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 mt-24 mb-12">
        <div className="text-center max-w-3xl">
          <h1 className="text-primary tracking-widest md:text-4xl font-bold mt-20">
            CONNECTING SPONSORS & SPONSOR SEEKERS EFFORTLESSLY!
          </h1>
          <p className="text-primary text-lg md:text-xl mt-8 mb-8 px-24">
            "Find the right sponsor for your events or discover promising opportunities to support—all in one platform."
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/")}
              className="bg-primary border-4 border-primary hover:bg-opacity-70 text-white tracking-widest font-semibold px-10 py-3 rounded-xl transition duration-300"
            >
              FIND A SPONSOR
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-none border-4 border-primary hover:bg-primary hover:text-white text-primary tracking-widest font-semibold px-10 py-3 rounded-xl transition duration-300"
            >
              BECOME A SPONSOR
            </button>
          </div>
        </div>
      </div>

      <div className="w-full mb-16">
        <ImageCarousel />
      </div>

      <div className="flex flex-1 items-center justify-center px-6 mt-8 mb-8">
        <h1 className="text-white tracking-widest text-4xl md:text-2xl font-bold mb-4">
            HOW IT WORKS?
        </h1>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mt-8 mb-10 px-6">
        <div className="text-center">
          <User size={60} className="mx-auto text-white mb-4" />
          <h3 className="text-lg text-white font-semibold">Create Profile</h3>
        </div>
        <div className="text-center">
          <Search size={60} className="mx-auto text-7xl text-white mb-4" />
          <h3 className="text-lg text-white font-semibold">Explore</h3>
        </div>
        <div className="text-center">
          <FileText size={60} className="mx-auto text-7xl text-white mb-4" />
          <h3 className="text-lg text-white font-semibold">Submit Document</h3>
        </div>
        <div className="text-center">
          <CheckCircle size={60} className="mx-auto text-7xl text-white mb-4" />
          <h3 className="text-lg text-white font-semibold">Review</h3>
        </div>
        <div className="text-center">
          <Flag size={60} className="mx-auto text-7xl text-white mb-4" />
          <h3 className="text-lg text-white font-semibold">Finish</h3>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 mt-12 mb-12">
        <button
          onClick={() => navigate("/")}
          className="bg-white border-4 border-primary hover:opacity-70 text-primary tracking-widest font-semibold px-24 py-3 rounded-xl transition duration-300">
            GET STARTED NOW
        </button>
      </div>
    </div>
  );
};

export default LandingScreen;
