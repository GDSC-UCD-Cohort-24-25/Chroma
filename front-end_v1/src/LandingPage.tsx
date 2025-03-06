import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6 flex items-center justify-center">
      {/* Main container */}
      <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl p-8 shadow-xl backdrop-blur-md flex items-center">
        
        {/* Left Side: Image */}
        <div className="w-1/2 flex justify-center">
          <img
            src="/assets/logo.png" 
            alt="Cow Budget"
            className="max-w-full h-auto rounded-xl"
          />
        </div>

        {/* Right Side: Text & Buttons */}
        <div className="w-1/2 text-center px-6">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6">
            Welcome to CowCulator
          </h1>
          <p className="text-lg text-gray-700 mb-6">
          Make your life easy by saving money big-time! Start making a budget today!</p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

