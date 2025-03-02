import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupStepThree = () => {
  // Retrieve the category names from localStorage
  const categoryNames: string[] = JSON.parse(localStorage.getItem('categoryNames') || '[]');
  
  const [categoryValues, setCategoryValues] = useState<string[]>(new Array(categoryNames.length).fill(''));
  const [errors, setErrors] = useState<string[]>(new Array(categoryNames.length).fill(''));
  const navigate = useNavigate();

  // Handle category value change
  const handleCategoryValueChange = (index: number, value: string) => {
    const updatedValues = [...categoryValues];
    updatedValues[index] = value;
    setCategoryValues(updatedValues);

    // Update error state
    const updatedErrors = [...errors];
    updatedErrors[index] = value.trim() === '' ? 'Category value is required.' : '';
    setErrors(updatedErrors);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate category values
    const hasErrors = categoryValues.some((value) => value.trim() === '');
    if (hasErrors) {
      const updatedErrors = categoryValues.map((value) => (value.trim() === '' ? 'Category value is required.' : ''));
      setErrors(updatedErrors);
      return;
    }

    // Save category values in localStorage (or send to backend)
    localStorage.setItem('categoryValues', JSON.stringify(categoryValues));

    // Navigate to the next page or dashboard
    navigate('/budget');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
      <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-md">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 text-center">
          Step 3: Enter Your Budget Category Values
        </h2>
        <p className="text-lg text-gray-700 text-center mb-6">
          Please enter the values for each of your budget categories.
        </p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {categoryNames.map((name, index) => (
            <div key={index} className="flex items-center space-x-4">
              {/* Numbered Label to the left of the input */}
              <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
              
              {/* Category Name */}
              <span className="w-2/5 text-lg text-gray-700">{name}:</span>
              
              {/* Input Field for Category Value */}
              <input
                type="number"
                value={categoryValues[index]}
                onChange={(e) => handleCategoryValueChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                placeholder={`Enter value for ${name}`}
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

export default SetupStepThree;
