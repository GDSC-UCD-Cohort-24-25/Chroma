import React from 'react';
import { FaWallet } from 'react-icons/fa';  // or any other icon

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4 animate-pulse">
        <FaWallet className="text-green-600 text-5xl" />
        <p className="text-gray-600 text-lg">Loading your budget...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
