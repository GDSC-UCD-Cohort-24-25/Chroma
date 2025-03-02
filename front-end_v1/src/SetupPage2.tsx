import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupStep2 = () => {
  const numCategories = parseInt(localStorage.getItem('numCategories') || '0'); // Get number of categories from localStorage
  const [categoryNames, setCategoryNames] = useState<string[]>(new Array(numCategories).fill(''));
  const [errors, setErrors] = useState<string[]>(new Array(numCategories).fill(''));
  const navigate = useNavigate();

  // Handle category name change
  const handleCategoryChange = (index: number, value: string) => {
    const updatedCategories = [...categoryNames];
    updatedCategories[index] = value;
    setCategoryNames(updatedCategories);

    // Update error state
    const updatedErrors = [...errors];
    updatedErrors[index] = value.trim() === '' ? 'Category name is required.' : '';
    setErrors(updatedErrors);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate category names
    const hasErrors = categoryNames.some((name) => name.trim() === '');
    if (hasErrors) {
      const updatedErrors = categoryNames.map((name) => (name.trim() === '' ? 'Category name is required.' : ''));
      setErrors(updatedErrors);
      return;
    }

    // Save category names in localStorage
    localStorage.setItem('categoryNames', JSON.stringify(categoryNames));

    // Navigate to the next page or dashboard
    navigate('/setupthree');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 text-center">
          Step 2: Name Your Budget Categories
        </h2>
        <p className="text-lg text-gray-700 text-center mb-6">
          Please provide names for your budget categories. You can always edit them later.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {categoryNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* Numbered Label to the left of the input */}
              <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
              
              {/* Input Field */}
              <input
                type="text"
                value={name}
                onChange={(e) => handleCategoryChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                placeholder={`Enter name for Category ${index + 1}`}
                required
              />
              
              {/* Error Message */}
              {errors[index] && (
                <span className="text-red-500 text-sm">{errors[index]}</span>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
          >
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupStep2;
