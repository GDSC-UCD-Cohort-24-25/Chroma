import React, { useState, useEffect } from 'react';
import { PieChart, Trash2, Plus} from 'lucide-react';
import { updateBudget, getBudgets, createBudget, deleteBudget, getTotalBudget, refreshPage} from '../services/apiService';
import {useAuth} from '../layouts/AuthContext'
import MiniPieChart from '../MiniPieChart';
import {colors, iconMap} from '../customizations'
import IconDropdown from '../IconDropdown'

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
  icon: string;
  recommendations: string[];
  color: string
}
const defaultBuckets: BucketType[] = [
  {
    _id: '',
    name: 'Rent',
    amount: 1000,
    percentage: 20,
    expense: 0,
    icon: 'Home',
    recommendations: [
      'Fixed rent',
    ],
    color: '#8FB6B0' //blue
  },
  {
    _id: '',
    name: 'Fun & Vibes',
    amount: 0,
    percentage: 20,
    expense: 0,
    icon: 'Gamepad2',
    recommendations: [
      'empty for now',
        '',
    ],
    color: '#EEAB8C' // orange
  },
  {
    _id: '',
    name: 'Shopping Sprees',
    amount: 0,
    percentage: 15,
    expense: 0,
    icon: 'ShoppingBag',
    recommendations: [
      'empty for now',
        '',
    ],
    color: '#C18BC1' //purple
  },
  {
    _id: '',
    name: 'Getting Around',
    amount: 0,
    percentage: 15,
    expense: 0,
    icon: 'Car',
    recommendations: [
      'empty for now',
        '',
    ],
    color: '#F3DFA1' // yellow
  },
  {
    _id: '',
    name: 'Coffee & Sips',
    amount: 0,
    percentage: 10,
    expense: 0,
    icon: 'Coffee',
    recommendations: [
      'empty for now',
        '',
    ],
    color: '#FFC9DE' //  pink
  }
];


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
      amount: 0,
      percentage: 0,
      expense: 0,
      icon: '',
      recommendations: [],
      color: ''
    });
    const [userId, setUserId] = useState<string>('');
    const [spendingAmount, setSpendingAmount] = useState<number | null>(null);
    const [selectedBucket, setSelectedBucket] = useState<BucketType>({
      _id: '',
      name: '',
      amount: 0,
      percentage: 0,
      expense: 0,
      icon: '',
      recommendations: [],
      color: ''
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const { getName, getTotal, isAuthenticated, refreshUserInfo} = useAuth();

/* Fetch budgets on component mount */   
    useEffect(() => {
      const loadBudgets = async () => {
        try {
          // get data and userId from getBudgets
          await refreshUserInfo();
          const res = await getBudgets();
          setUserId(res.userId);
          const budgetArray = res.data; 
          const total = getTotal();
          const name = getName();
      
            let categories: BucketType[] = [];
          
            if (Array.isArray(budgetArray) && budgetArray.length > 0) {
            categories = budgetArray.map((category: any) => ({
              _id: category._id,
              name: category.name,
              amount: category.amount,
              percentage: category.percentage,
              expense: category.expense ,
              icon: category.icon,
              recommendations: category.recommendations,
              color: category.color, 
              }));
            }
            else{
              categories = defaultBuckets.map((bucket) => ({
                ...bucket,
                amount: (bucket.percentage / 100) * total,
              }));
            }
      
          setBudget({
            name: name,
            total: total,
            buckets: categories,
          });


        } catch (error: any) {
          console.error('Error fetching user budget:', error);
        }
      };
      if (isAuthenticated && !budget.name) {
        loadBudgets();}
    }, [isAuthenticated]);
   

    /* Add new bucket function */  
    const addNewBucket = async () => {
      if (newBucket.name && newBucket.amount>0) {
        if (!newBucket.name.trim()) {
          alert('Bucket name cannot be empty.');
          return;
        }
        if (newBucket.amount <= 0 || newBucket.amount > budget.total ) {
          alert('Amount allocated must be between 1 and 100.');
          return;
        }
        const newPercentage= (newBucket.amount / budget.total) * 100;
        const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0) + newPercentage;
        if (totalPercentage > 100) {
          alert('Total percentage of all categories cannot exceed 100%.');
          return;
        }

        try {
          const usedColors = budget.buckets.map(bucket => bucket.color);
          const availableColors = colors.filter(color => !usedColors.includes(color));
  
          const created = await createBudget({
            userId: userId,
            name: newBucket.name,
            amount: newBucket.amount,
            percentage: (newBucket.amount / budget.total) * 100 || 0,
            expense: newBucket.expense || 0,
            icon: newBucket.icon || Object.keys(iconMap).find(key => newBucket.name.toLowerCase().includes(key.toLowerCase())) || 'Home',
            recommendations: newBucket.recommendations || [],
            color: newBucket.color || availableColors[Math.floor(Math.random() * availableColors.length)],
          });
          console.log('New bucket created:', created.data._id);
          console.log('New bucket created:', created.data.icon);
          console.log('New bucket created:', created.data.color);
          const newBucketWithId: BucketType = {
            ...newBucket,
            _id: created.data._id,
            percentage: (created.data.amount / budget.total) * 100 || 0,
            icon: created.data.icon,
            color: created.data.color
          };
  
          const updatedBudget: Budget = {
            ...budget,
            buckets: [...budget.buckets, newBucketWithId],
          };
          setBudget(updatedBudget);
          setNewBucket({name: '', percentage: 0, amount: 0, expense: 0, icon: '', recommendations: [], color: '', _id: ''});
          setShowNewBucketForm(false);
        } catch (err: any) {
            alert(err.message || 'Failed to save the bucket.');
        }
      }
      else{
        alert('Could not save category');
      }
    };
  
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
    
    const handleEditCategory = async () => {
      if (!selectedBucket || !selectedBucket._id) {
        alert('Bucket ID is required.');
        return;
      }
    
      const bucketId = selectedBucket._id;
    
      // Find the original bucket
      const originalBucket = budget.buckets.find(b => b._id === bucketId);
      if (!originalBucket) {
        alert('Bucket not found.');
        return;
      }
      
      const isValidNumber = (val: any) => typeof val === 'number' && !isNaN(val) && val >= 0;
      const updatedBucket = {
        ...originalBucket,
        name: selectedBucket.name.trim() !== "" ? selectedBucket.name : originalBucket.name,
        icon: selectedBucket.icon.trim() !== "" ? selectedBucket.icon : originalBucket.icon,
        amount: isValidNumber(selectedBucket.amount) ? selectedBucket.amount : originalBucket.amount,
        expense: isValidNumber(selectedBucket.expense) ? selectedBucket.expense : originalBucket.expense,
        percentage: isValidNumber(selectedBucket.amount) && selectedBucket.amount !== originalBucket.amount
            ? (selectedBucket.amount / budget.total) * 100
            : originalBucket.percentage,
        
      };
      const updatedBuckets = budget.buckets.map(b =>
        b._id === bucketId ? updatedBucket : b
      )
    
      if (!updatedBuckets) {
        alert('Bucket not found.');
        return;
      }
      
      setBudget({ ...budget, buckets: updatedBuckets });
      setSelectedBucket({name: '', percentage: 0, amount: 0, expense: 0, icon: '', recommendations: [], color: '', _id: ''});
      setShowEditForm(false);
      try {
        await updateBudget({
          Id: updatedBucket._id,
          name: updatedBucket.name,
          amount: updatedBucket.amount,
          percentage: updatedBucket.percentage,
          expense: updatedBucket.expense,
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
  
          <div className="bg-[#B3D5C2] rounded-xl shadow-lg p-7 mb-8 flex items-center justify-between">
            <div className="flex items-center mb-2">
              <PieChart className="w-6 h-6 text-[#10492A] mr-2 " />
              <h2 className="text-xl font-semibold text-gray-700">Budget: ${budget.total}</h2>
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
                {/* Top Bar */}
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
                      className="absolute bottom-5 right-5 text-[#10492A] hover:text-pink-600"
                    >
                      <Plus className="w-5 h-5" />
                    </button>

                  </div>
                </div>
              
                {/* Budget Info */}
                <div>
                  <div className="mr-20">
                    <h4 className="text-sm font-medium text-gray-700 mb-1">Budget:</h4>
                    <p className="text-md font-semibold text-[#10492A]">${bucket.amount.toFixed(2)}</p>
                    <h4 className="text-sm font-medium text-gray-700 mt-1">Spent:</h4>
                    <p className="text-md font-semibold text-blue-700">${bucket.expense.toFixed(2)}</p>
                  </div>
                
                  {/* Pie Chart */}
                    <div className=" absolute bottom-6 right-12 w-[120px] h-[120px] ">
                      <MiniPieChart percentage={bucket.percentage} color={bucket.color} size={120} />
                      <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-semibold text-white">
                        {bucket.percentage.toFixed(0)}%
                      </span>
                    </div>
                </div>
                  
              </div>
              
              ))}
  
            {/* Edit specific category */}
            </div>
            {showEditForm && selectedBucket && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-[#F4F4EA] rounded-2xl shadow-xl p-6 w-[90%] max-w-md border ">
                <h3 className="text-xl font-bold text-[#10492A] mb-4">Edit "{selectedBucket.name}"</h3>

                <div className="space-y-3">
                  <input
                  type="text"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                  placeholder="Category Name"
                  value={selectedBucket.name}
                  onChange={(e) => setSelectedBucket(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <input
                  type="number"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                  placeholder="Budget"
                  value={isNaN(selectedBucket.amount) ? '' : selectedBucket.amount}
                  onChange={(e) => setSelectedBucket(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                  />
                  <input
                  type="number"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                  placeholder="Spent"
                  value={isNaN(selectedBucket.expense) ? '' : selectedBucket.expense}
                  onChange={(e) => setSelectedBucket(prev => ({ ...prev, expense: parseFloat(e.target.value) }))}
                  />
                  <IconDropdown
                  value={selectedBucket.icon}
                  onChange={(icon) => setSelectedBucket(prev => ({ ...prev, icon }))}
                  iconMap={iconMap}
                  />
                </div>

                <div className="flex justify-between mt-6">
                  
                  <button
                    className="px-5 py-2 bg-gray-200 text-gray-700 rounded-xl"
                    onClick={() => {
                      setSelectedBucket({name: '', percentage: 0, amount: 0, expense: 0, icon: '', recommendations: [], color: '', _id: ''});
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
            
                    <input
                      type="number"
                      value={ newBucket.amount}
                      onChange={(e) => setNewBucket(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                      className="w-full px-4 py-2 rounded-xl border border-gray-300"
                      placeholder="Budget Amount"
                    />
            
                    <IconDropdown
                      value={newBucket.icon}
                      onChange={(icon) => setNewBucket(prev => ({ ...prev, icon }))}
                      iconMap={iconMap}
                    />
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