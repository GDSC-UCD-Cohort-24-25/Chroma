import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveBudget } from '../services/apiService'; // Adjust the import path as necessary

const Setup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [numCategories, setNumCategories] = useState('');
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [budgetValues, setBudgetValues] = useState<string[]>([]);
  const [expenseValues, setExpenseValues] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  // Move to next step with validation
  const goToStepTwo = () => {
    if (!monthlyBudget || !numCategories || parseInt(numCategories) <= 0) return;
    setCategoryNames(new Array(parseInt(numCategories)).fill(''));
    setErrors(new Array(parseInt(numCategories)).fill(''));
    setStep(2);
  };


  const goToStepThree = () => {
    const hasEmpty = categoryNames.some(name => name.trim() === '');
    if (hasEmpty) {
      setErrors(categoryNames.map(name => name.trim() === '' ? 'Category name is required.' : ''));
      return;
    }
    setBudgetValues(new Array(categoryNames.length).fill(''));
    setExpenseValues(new Array(categoryNames.length).fill(''));
    setErrors(new Array(categoryNames.length).fill(''));
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('monthlyBudget', monthlyBudget);
    localStorage.setItem('numCategories', numCategories);
    localStorage.setItem('categoryNames', JSON.stringify(categoryNames));
    localStorage.setItem('budgetValues', JSON.stringify(budgetValues));
    localStorage.setItem('expenseValues', JSON.stringify(expenseValues));
    navigate('/budget');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F4EA] p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-3xl shadow-xl backdrop-blur-md">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[#92BAA4] text-center mb-4">
              Welcome to CowCulator!
            </h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              Your budgeting assistant through your busy life as an Aggie.
            </p>
            <form className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  What's your total monthly budget?
                  <br />
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
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  How many budget categories do you want to start with?
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
              <button
                type="button"
                onClick={goToStepTwo}
                className="w-full px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[#92BAA4] mb-6 text-center">
              Step 2: Name Your Budget Categories
            </h2>
            <form className="space-y-4">
              {categoryNames.map((name, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      const updated = [...categoryNames];
                      updated[index] = e.target.value;
                      setCategoryNames(updated);
                    }}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                    placeholder={`Enter name for Category ${index + 1}`}
                    required
                  />
                  {errors[index] && (
                    <span className="text-red-500 text-sm">{errors[index]}</span>
                  )}
                </div>
              ))}
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-300 rounded-xl hover:opacity-90"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goToStepThree}
                  className="px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90"
                >
                  Continue
                </button>
              </div>
            </form>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-[#92BAA4] mb-6 text-center">
              Step 3: Set Budgets and Expenses
            </h2>
            <form className="space-y-4" onSubmit={handleFinalSubmit}>
              <div className="grid grid-cols-[auto_.5fr_1fr_1fr] items-center gap-4 mb-2">
                <span></span>
                <span></span>
                <span className="text-lg text-center font-semibold text-gray-700">Budget</span>
                <span className="text-lg text-center font-semibold text-gray-700">Expenses</span>
              </div>
              {categoryNames.map((name, index) => (
                <div key={index}>
                  <div className="grid grid-cols-[auto_.5fr_1fr_1fr] items-center gap-4">
                    <span className="text-lg font-semibold text-gray-700">{index + 1}.</span>
                    <span className="text-lg text-gray-700">{name}:</span>
                    <input
                      type="number"
                      value={budgetValues[index] || ''}
                      onChange={(e) => {
                        const updated = [...budgetValues];
                        updated[index] = e.target.value;
                        setBudgetValues(updated);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                      placeholder="Budget"
                      required
                    />
                    <input
                      type="number"
                      value={expenseValues[index] || ''}
                      onChange={(e) => {
                        const updated = [...expenseValues];
                        updated[index] = e.target.value;
                        setExpenseValues(updated);
                      }}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                      placeholder="Spending"
                      required
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 bg-gray-300 rounded-xl hover:opacity-90"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90"
                >
                  Take me to my dashboard!
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Setup;