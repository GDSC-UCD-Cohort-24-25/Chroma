import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBudget } from '../services/apiService'; // Adjust the import path as necessary

const Setup = () => {
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [numCategories, setNumCategories] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    try {
      const budgetData = {
        total: parseFloat(monthlyBudget) || -1, // Total monthly budget
        Categories: Array.from({ length: parseInt(numCategories) || 0 }, (_, index) => ({
          id: new Date().toISOString(),  // Using ISO string as a unique ID for each bucket
          name: `Category ${index + 1}`,
          amount: 0,
          percentage: 0,
          icon: 'default_icon',
          recommendations: [],
          color: '#3498db',  // Default color
        })),
      };

      const res = await saveBudget({ 
        totalBudget: budgetData.total, Categories: budgetData.Categories
      }); // Save budget to the backend
      
      console.log(res); // Log the response for debugging
      console.log('Budget saved successfully');
      navigate('/budget'); // Navigate to the budget page
    
    } catch (error: any) {
      alert(error.message || 'An error occurred while saving the budget.');
    }

    localStorage.setItem('monthlyBudget', monthlyBudget);
    localStorage.setItem('numCategories', numCategories);

    console.log('Monthly Budget:', monthlyBudget);
    console.log('Number of Categories:', numCategories);
    navigate('/setuptwo');

    setMonthlyBudget('');
    setNumCategories('');

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4EA]">

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text p-4 bg-[#92BAA4] text-center">
          Welcome to CowCulator!
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
            className="w-full px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Setup;