import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [numCategories, setNumCategories] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Monthly Budget:', monthlyBudget);
    console.log('Number of Categories:', numCategories);
    navigate('/budget');
    setMonthlyBudget('');
    setNumCategories('');

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 text-center">
          Welcome to CowCulator
        </h2>
        <p className="text-lg text-gray-700 text-center mb-6">
          Your budgeting assistant through your busy life as an Aggie.
        </p>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Monthly Budget Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              What's your total monthly budget? <br />
              <span className="text-sm text-gray-500">Don’t worry, you can always adjust this later.</span>
            </label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
              placeholder="Enter amount"
              required
            />
          </div>

          {/* Budget Categories Input */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Let's set up your budget categories. <br />
              How many would you like to start with?
            </label>
            <input
              type="number"
              value={numCategories}
              onChange={(e) => setNumCategories(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
              placeholder="Enter number"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;
