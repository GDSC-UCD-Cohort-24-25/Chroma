import React, { useState, useEffect } from 'react';
import { PieChart, Trash2, Plus} from 'lucide-react';
import { updateBudget, getBudgets, createBudget, deleteBudget, getRecommendations} from '../services/apiService';
import {useAuth} from '../layouts/AuthContext'
import MiniPieChart from '../MiniPieChart';
import {colors, iconMap} from '../customizations'
import IconDropdown from '../IconDropdown'
import LoadingScreen from '../loadingScreen'

/* INTERFACES AND DEFAULTS */
interface Budget {
  name: string | null;
  total: number;
  buckets: BucketType[];
}
interface BucketType {
  _id: string;
  name: string;
  amount: number;
  percentage: number;
  expense: number;
  left: number;
  icon: string;
  recommendations: string[];
  color: string
}



function BudgetPage() {
  /*State variables */
  const [budget, setBudget] = useState<Budget>({
    name: '',
    total: 0,
    buckets: [],
  });
  const [showNewBucketForm, setShowNewBucketForm] = useState(false);
  const [newBucket, setNewBucket] = useState({
    _id: '',
    name: '',
    amount: NaN,
    percentage: NaN,
    expense: NaN,
    left: NaN,
    icon: '',
    recommendations: [],
    color: ''
  });
  const [userId, setUserId] = useState<string>('');
  const [errorName, setErrorName] = useState('');
  const [errorAmount, setErrorAmount] = useState('');
  const [errorIcon, setErrorIcon] = useState('');
  const [errorExpense, setErrorExpense] = useState('');
  const [spendingAmount, setSpendingAmount] = useState<number | null>(null);
  const [selectedBucket, setSelectedBucket] = useState<BucketType>({
    _id: '',
    name: '',
    amount: NaN,
    percentage: NaN,
    expense: NaN,
    left: NaN,
    icon: '',
    recommendations: [],
    color: ''
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const { getName, getTotal } = useAuth();
  const [loading, setLoading] = useState(false);

/* Fetch budgets on component mount */   
    useEffect(() => {
      const loadBudgets = async () => {
        setLoading(true);
        try {
          // get data and userId from getBudgets
          const res = await getBudgets();
          setUserId(res.userId);
          const budgetArray = res.data; 
          const total = getTotal();
          const name = getName();
      
            let categories: BucketType[] = [];
          
            if (Array.isArray(budgetArray) && budgetArray.length > 0) {
            categories = await Promise.all(
              budgetArray.map(async (category: any) => {
                const bucket: BucketType = {
                  _id: category._id,
                  name: category.name,
                  amount: category.amount,
                  percentage: category.percentage,
                  expense: category.expense,
                  left: category.amount-category.expense,
                  icon: category.icon,
                  recommendations: category.recommendations,
                  color: category.color,
                };
                if (bucket.recommendations.length === 0) {
                  try {
                    const recs = await getRecommendations({
                      name: bucket.name,
                      amount: bucket.amount,
                      percentage: bucket.percentage,
                      expense: bucket.expense,
                    });
                    bucket.recommendations = recs.data;
                  } catch (err:any) {
                    console.warn(`Failed to generate recommendations for ${bucket.name}`, err);
                  }
                  await updateBudget({
                    Id: bucket._id,
                    name: bucket.name,
                    amount: bucket.amount,
                    percentage: bucket.percentage,
                    expense: bucket.expense,
                    //left: bucket.amount - bucket.expense,
                    icon: bucket.icon,
                    recommendations: bucket.recommendations,
                    color: bucket.color,
                  });
                }
                
              return bucket;
            })
          );
          }
      
          setBudget({
            name: name,
            total: total,
            buckets: categories,
          });

          await new Promise((res) => setTimeout(res, 200)); // delay for loadingscreen
        } catch (error: any) {
          console.error('Error fetching user budget:', error);
        }
        finally{
          setLoading(false);
        }
      };
      loadBudgets();
  }, []);
   
    if (loading) return <LoadingScreen />;
    const totalLeft = budget.buckets.reduce((sum, b) => sum + (b.amount - b.expense), 0);
  
    /* Add new bucket function */  
    const addNewBucket = async () => {
        if (!newBucket.name.trim()) {
          setErrorName('Category name cannot be empty.');
          return;
        } else if (newBucket.name.length > 18) {
          setErrorName('Category name must be shorter.');
          return;
        } else {
          setErrorName('');
        }
        if (newBucket.icon.trim() === "") {
          setErrorIcon("Icon cannot be empty.");
          return;
        } else {
          setErrorName('');
        }

        if (newBucket.amount <= 0 ) {
          setErrorAmount('Amount allocated must be greater than 0.');
          return;
        } else if(newBucket.amount > budget.total){
          setErrorAmount('Amount must be less than or equal to the total budget.');
          return;
        } 
        else {
          setErrorAmount('');
        }

        if (newBucket.expense < 0 || newBucket.expense > newBucket.amount) {
          setErrorExpense('Expense must be between 0 and the budget amount.');
          return;
        } else {
          setErrorExpense('');
        }

        const newPercentage = (newBucket.amount / budget.total) * 100;
        const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0) + newPercentage;
        if (totalPercentage > 100) {
          alert('Total percentage of all categories cannot exceed 100%.');
          return;
        }

      try {
          const usedColors = budget.buckets.map(bucket => bucket.color);
          const availableColors = colors.filter(color => !usedColors.includes(color));

          const recommendations = await getRecommendations({
            name: newBucket.name,
            amount: newBucket.amount,
            percentage: (newBucket.amount / budget.total) * 100,
            expense: newBucket.expense || 0,
          });
  
          const created = await createBudget({
            userId: userId,
            name: newBucket.name,
            amount: newBucket.amount,
            percentage: (newBucket.amount / budget.total) * 100 || 0,
            expense: newBucket.expense || 0,
            // left: newBucket.amount - newBucket.expense,
            icon: newBucket.icon || Object.keys(iconMap).find(key => newBucket.name.toLowerCase().includes(key.toLowerCase())) || 'Home',
            recommendations: recommendations || [],
            color: newBucket.color || availableColors[Math.floor(Math.random() * availableColors.length)],
          });
          console.log('New bucket created:', created.data._id);
          console.log('New bucket created:', created.data.icon);
          console.log('New bucket created:', created.data.color);
          const newBucketWithId: BucketType = {
            ...newBucket,
            _id: created.data._id,
            percentage: (created.data.amount / budget.total) * 100 || 0,
            left: created.data.amount - created.data.expense,
            icon: created.data.icon,
            recommendations: created.recommendations,
            color: created.data.color
          };
  
          const updatedBudget: Budget = {
            ...budget,
            buckets: [...budget.buckets, newBucketWithId],
          };
          setBudget(updatedBudget);
          setNewBucket({name: '', percentage: 0, amount: 0, expense: 0, left: 0, icon: '', recommendations: [], color: '', _id: ''});
          setShowNewBucketForm(false);
        } catch (err: any) {
            alert(err.message || 'Failed to save the bucket.');
        }
      
    };
      /* Delete bucket function */  
    const deleteBucket = async (idToDelete: string) => {
      if (budget.buckets.length <= 1) {
        alert('You cannot delete the last bucket. Please create a new bucket before deleting this one.');
        return;
      }
    
      if (!window.confirm('Are you sure you want to delete this bucket?')) return;
      try {
        await deleteBudget(idToDelete);
        const updatedBuckets = budget.buckets.filter(bucket => bucket._id !== idToDelete);
        const updatedBudget: Budget = {
          ...budget,
          buckets: updatedBuckets,
        };
        setBudget(updatedBudget);
      } catch (err: any) {
        alert(err.message || 'Failed to delete the bucket.');
      }
    };
        /* Edit bucket function */  
  const handleEditCategory = async () => {
      if (!selectedBucket || !selectedBucket._id) {
        alert('Category not found.');
        return;
      }
      
    
      const bucketId = selectedBucket._id;
      // Find the original bucket
      const originalBucket = budget.buckets.find(b => b._id === bucketId);
      if (!originalBucket) {
        alert('Original category not found.');
        return;
      }
      
      const isValidNumber = (val: any) => typeof val === 'number' && !isNaN(val) && val >= 0;
      
      let updatedBucket = { ...originalBucket };

      if (selectedBucket.name.trim() === "") {
        setErrorName("Category name cannot be empty.");
        return;
        
      }else if(selectedBucket.name.length > 18) {
        setErrorName('Category name must be shorter.');
        return;
      }
      else {
        setErrorName('');
        updatedBucket.name = selectedBucket.name;
      }

      if (selectedBucket.icon.trim() === "") {
        setErrorIcon("Icon cannot be empty.");
        return;
      } else {
        setErrorIcon('');
        updatedBucket.icon = selectedBucket.icon;
      }

      if (!isValidNumber(selectedBucket.amount) && selectedBucket.amount!=0) {
        setErrorAmount("Amount must be greater than zero.");
        return;
      } else {
        setErrorAmount('');
        updatedBucket.amount = selectedBucket.amount;
      }

      if (!isValidNumber(selectedBucket.expense)) {
        setErrorExpense("Expense must be greater than or equal to zero.");
        return;
      } else {
        setErrorExpense('');
        updatedBucket.expense = selectedBucket.expense;
      }

      if (selectedBucket.amount !== originalBucket.amount) {
        updatedBucket.percentage = (selectedBucket.amount / budget.total) * 100;
      } else {
        updatedBucket.percentage = originalBucket.percentage;
      }
      
      if (selectedBucket.left !== originalBucket.left){
        updatedBucket.left = selectedBucket.amount - selectedBucket.expense;
      }else {
        updatedBucket.left = originalBucket.left;
      }


      const updatedBuckets = budget.buckets.map(b =>
        b._id === bucketId ? updatedBucket : b
      )
    
      if (!updatedBuckets) {
        alert('Bucket not found.');
        return;
      }
      
      setBudget({ ...budget, buckets: updatedBuckets });
      setSelectedBucket({name: '', percentage: 0, amount: 0, expense: 0, left: 0, icon: '', recommendations: [], color: '', _id: ''});
      setShowEditForm(false);
      try {
        await updateBudget({
          Id: updatedBucket._id,
          name: updatedBucket.name,
          amount: updatedBucket.amount,
          percentage: updatedBucket.percentage,
          expense: updatedBucket.expense,
          //left: updatedBucket.amount - updatedBucket.expense,
          icon: updatedBucket.icon,
          recommendations: updatedBucket.recommendations || [],
          color: updatedBucket.color,
        });
        
        console.log('Category updated successfully!');
      } catch (err: any) {
        alert(err.message || 'Failed to update category.');
      }
    };
    
    
  
    return (
      <div className="min-h-screen bg-[#F4F4EA] p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-2 p-6 font-semibold text-[#10492A]">Welcome, {budget.name}!</h2>
          <div>
          {/* Top Bar Budget Amount*/}
            <div className="bg-[#B3D5C2] rounded-xl shadow-lg p-7 mb-8 flex items-center justify-between relative">
              <div className="flex items-between mb-2">
                <PieChart className="w-8 h-8 text-[#10492A] mr-3" />
                <div className="flex flex-wrap items-center justify-between space-x-20">
                  <h1 className="text-2xl font-semibold text-gray-700">Total Budget: ${budget.total.toFixed(2)}</h1>
                  <h2 className="text-2xl font-semibold text-gray-700">Remaining Budget: ${totalLeft.toFixed(2)}</h2>
                </div>
              </div>
              <button
                onClick={() => setShowNewBucketForm(true)}
                className="px-4 py-2 bg-[#10492A] text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-semibold"
                >
                Add New Category
              </button>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {budget.buckets.map(bucket => (
              <div key={bucket._id} className="relative bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border text-[#10492A] transition-all duration-300">
                {/* Top Bar of category card*/}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    {iconMap[bucket.icon]}
                    <h3 className="text-lg font-semibold text-gray-700 ml-2">{bucket.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => deleteBucket(bucket._id)}
                      className="text-[#10492A] hover:text-pink-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedBucket(bucket);
                        setShowEditForm(true);
                      }}
                      className="absolute bottom-2 right-2 text-[#10492A] hover:text-pink-600"
                    >
                      <Plus className="w-6 h-6" />
                    </button>

                  </div>
                </div>
              
                {/* Categories Info */}
                <div className="flex justify-between">
                  {/* Left: Budget, Spent, and Tips */}
                                
                  <div className="w-2/3 pr-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Budget:</h4>
                    <p className="text-md font-semibold text-[#10492A]">${bucket.amount.toFixed(2)}</p>
                    <h4 className="text-sm font-medium text-gray-700 mt-1">Spent:</h4>
                    <p className="text-md font-semibold text-blue-700">${bucket.expense.toFixed(2)}</p>
                    <h4 className="text-sm font-medium">Left:</h4>
                    <p className="text-md font-semibold text-green-700">${bucket.left.toFixed(2)}</p>
                    
                  </div>

                  {/* Right: Pie Chart */}
                  <div className="w-[120px] h-[120px] relative">
                    <MiniPieChart percentage={bucket.percentage} color={bucket.color} size={120} />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-white">
                      {bucket.percentage.toFixed(0)}%
                    </span>
                  </div>
                  
                </div>
                {/* Recommendations */}
                    {bucket.recommendations && bucket.recommendations.length > 0 && (
                      <div className="mt-4 p-3 bg-white/80 border border-gray-200 rounded-xl text-sm text-gray-700 shadow-inner space-y-1 max-h-30 overflow-hidden">
                        <h4 className="font-medium text-[#10492A] mb-1">Tips to stay on budget:</h4>
                        {bucket.recommendations.map((tip, idx) => (
                          <p key={idx} className="leading-snug">• {tip}</p>
                        ))}
                      </div>
                    )}
                  
              </div>
              
              ))}
  
            {/* Plus function to edit specific category */}
            </div>
            {showEditForm && selectedBucket && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-[#F4F4EA] rounded-2xl shadow-xl p-6 w-[90%] max-w-md border ">
                <h3 className="text-xl font-bold text-[#10492A] mb-4">Edit "{selectedBucket.name}"</h3>

                <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label className="w-24 text-sm font-medium text-gray-700">Name</label>
                      
                      <input
                      type="text"
                      className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
                      placeholder="Category Name"
                      value={selectedBucket.name}
                      onChange={(e) => setSelectedBucket(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>{errorName && <p className="text-sm text-red-500">{errorName}</p>}
                    <div className="flex items-center space-x-4">
                      <label className="w-24 text-sm font-medium text-gray-700">Budget</label>
                        <input
                        type="number"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
                        placeholder="Budget Amount"
                        value={selectedBucket.amount}
                        onChange={(e) => setSelectedBucket(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                        />
                    </div>{errorAmount && <p className="text-sm text-red-500">{errorAmount}</p>}
                    <div className="flex items-center space-x-4">
                      <label className="w-24 text-sm font-medium text-gray-700">Spent</label>
                        <input
                        type="number"
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
                        placeholder="Spent"
                        value={selectedBucket.expense}
                        onChange={(e) => setSelectedBucket(prev => ({ ...prev, expense: parseFloat(e.target.value) }))}
                        />
                    </div>{errorExpense && <p className="text-sm text-red-500">{errorExpense}</p>}
                    <div className="flex items-start space-x-4">
                      <label className="w-24 text-sm font-medium text-gray-700 pt-2">Icon</label>
                      <div className="flex-1">
                        <IconDropdown
                        value={selectedBucket.icon}
                        onChange={(icon) => setSelectedBucket(prev => ({ ...prev, icon }))}
                        iconMap={iconMap}
                        />
                      </div>
                    </div>
                </div>

                <div className="flex justify-between mt-6">
                  
                  <button
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl"
                    onClick={() => {
                      setSelectedBucket({name: '', percentage: 0, amount: 0, expense: 0, left: 0, icon: '', recommendations: [], color: '', _id: ''});
                      setShowEditForm(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-5 py-2 bg-[#92BAA4] text-white rounded-xl"
                    onClick={async () => {
                      await handleEditCategory();
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

  
      
            {/*adds new category*/}
            {showNewBucketForm && (
             <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-[#F4F4EA] rounded-2xl shadow-xl p-6 w-[90%] max-w-md border">
                  <h3 className="text-xl font-bold text-[#10492A] mb-4">Add New Category</h3>
            
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newBucket.name || ''}
                      onChange={(e) => setNewBucket(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300"
                      placeholder="Category Name"
                    />
                    
                    {errorName && <p className="text-red-500 text-center">{errorName}</p>}
                    
                    <input
                      type="number"
                      value={ newBucket.amount}
                      onChange={(e) => setNewBucket(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300"
                      placeholder="Budget Amount"
                    />
                    {errorAmount && <p className="text-red-500 text-center">{errorAmount}</p>}
                    
                    <input
                      type="number"
                      value={ newBucket.expense}
                      onChange={(e) => setNewBucket(prev => ({ ...prev, expense: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300"
                      placeholder="Spent Amount"
                    />
                    {errorExpense && <p className="text-red-500 text-center">{errorExpense}</p>}
                    
                    <IconDropdown
                      value={newBucket.icon}
                      onChange={(icon) => setNewBucket(prev => ({ ...prev, icon }))}
                      iconMap={iconMap}
                    />{errorIcon && <p className="text-red-500 text-center">{errorIcon}</p>}
                  </div>
            
                  <div className="flex justify-between mt-6">
                    
                    <button
                      onClick={() => setShowNewBucketForm(false)}
                      className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={addNewBucket}
                      className="px-5 py-2 bg-[#92BAA4] text-white rounded-xl"
                    >
                      Add
                    </button>
                    </div>
                </div>
            </div>
            )}
  
            <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border ">
              <h2 className="text-xl font-semibold text-[#10492A] mb-4">Spending Distribution</h2>
              <div className="h-4 bg-[#A6AAAE] rounded-full overflow-hidden">
                  {budget.buckets.map(bucket => (
                      <div
                          key={bucket._id}
                          style={{
                              width: `${bucket.percentage}%`,
                              height: '100%',
                              float: 'left',
                              backgroundColor: bucket.color
                          }}
                          className="transition-all duration-300"
                      />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default BudgetPage;