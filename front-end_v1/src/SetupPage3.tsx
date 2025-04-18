import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SetupStepThree = () => {
  // Retrieve the category names from localStorage
const categoryNames: string[] = JSON.parse(localStorage.getItem('categoryNames') || '[]');

// Separate state for budget and expense values
const [budgetValues, setBudgetValues] = useState<string[]>(new Array(categoryNames.length).fill(''));
const [expenseValues, setExpenseValues] = useState<string[]>(new Array(categoryNames.length).fill(''));
const [errors, setErrors] = useState<string[]>(new Array(categoryNames.length).fill(''));

const navigate = useNavigate();

// Handle budget value change
const handleBudgetChange = (index: number, value: string) => {
  const updated = [...budgetValues];
  updated[index] = value;
  setBudgetValues(updated);

  const updatedErrors = [...errors];
  updatedErrors[index] = value.trim() === '' ? 'Budget is required.' : '';
  setErrors(updatedErrors);
};

// Handle expense value change
const handleExpenseChange = (index: number, value: string) => {
  const updated = [...expenseValues];
  updated[index] = value;
  setExpenseValues(updated);

  const updatedErrors = [...errors];
  updatedErrors[index] = value.trim() === '' ? 'Expense is required.' : '';
  setErrors(updatedErrors);
};


  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // // Validate category values
    // const hasErrors = categoryValues.some((value) => value.trim() === '');
    // if (hasErrors) {
    //   const updatedErrors = categoryValues.map((value) => (value.trim() === '' ? 'Category value is required.' : ''));
    //   setErrors(updatedErrors);
    //   return;
    // }

    // Save category values in localStorage (or send to backend)
    localStorage.setItem('budgetValues', JSON.stringify(budgetValues));
    localStorage.setItem('expenseValues', JSON.stringify(expenseValues));

    // Navigate to the next page or dashboard
    navigate('/budget');
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
    <div className="max-w-2xl w-full bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-md">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 text-center">
        Step 3: Enter Your Budget Category Values
      </h2>
      <p className="text-lg text-gray-700 text-center mb-6">
        Let’s decide your monthly budget and your expenses so far this month:
      </p>

      {/* Header Row */}
      <div className="grid grid-cols-[auto_2fr_1fr_1fr] items-center gap-4 mb-2">
        <span></span>
        <span></span>
        <span className="text-lg text-center font-semibold text-gray-700">Budget</span>
        <span className="text-lg text-center font-semibold text-gray-700">Expenses so Far</span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {categoryNames.map((name, index) => (
          <div key={index}>
            <div className="grid grid-cols-[auto_2fr_1fr_1fr] items-center gap-4">
              {/* Number */}
              <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
              {/* Category Name */}
              <span className="text-lg text-gray-700">{name}:</span>
              {/* Budget Input */}
              <input
                type="number"
                value={budgetValues[index]}
                onChange={(e) => handleBudgetChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                placeholder={`Budget`}
                required
              />
              {/* Expense Input */}
              <input
                type="number"
                value={expenseValues[index]}
                onChange={(e) => handleExpenseChange(index, e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                placeholder={`Spending`}
                required
              />
            </div>
            {/* Error Message (optional) */}
            {errors[index] && (
              <div className="col-span-4 text-red-500 text-sm mt-1 ml-6">
                {errors[index]}
              </div>
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full mt-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
        >
          Take me to my dashboard!
        </button>
      </form>
    </div>
  </div>
);
}

export default SetupStepThree;
