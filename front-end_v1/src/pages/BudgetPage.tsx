import React, { useState, useEffect } from 'react';
import { PieChart, Trash2, Plus} from 'lucide-react';
import { updateBudget, getBudgets, createBudget, deleteBudget, getTotalBudget} from '../services/apiService';
//import { useAuth } from './AuthContext';
import MiniPieChart from '../MiniPieChart';
import {colors, iconMap} from '../customizations'

/* INTERFACES AND DEFAULTS */
interface Budget {
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
    //const { isAuthenticated } = useAuth();
    
/* Fetch budgets on component mount */
    
    useEffect(() => {
      const loadBudgets = async () => {
        try {
          // get data and userId from getBudgets
          const res = await getBudgets();
          setUserId(res.userId);
          const budgetArray = res.data; 
          const total = await getTotalBudget() || 0;
      
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
                amount: (bucket.percentage / 100) * total
              }));
            }
      
          setBudget({
            total: total,
            buckets: categories,
          });


        } catch (error: any) {
          console.error('Error fetching user budget:', error);
        }
      };
      

      loadBudgets();

    }, []);
    
/* Update bucket amounts when total budget changes */
    const updateBucketAmounts = () => {
      const updatedBuckets = budget.buckets.map(bucket => ({
        ...bucket,
        amount: (bucket.percentage / 100) * budget.total
      }));
      setBudget(prev => ({ ...prev, buckets: updatedBuckets }));
    };

    /* Handle budget change input */  
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setBudget(prev => ({ ...prev, total: value }));
      updateBucketAmounts();
    };

    /* Handle percentage change input */  
    const handlePercentageChange = (id: string, newPercentage: number) => {
      const updatedBuckets = budget.buckets.map(bucket =>
        bucket._id === id ? { ...bucket, percentage: newPercentage } : bucket
      );
      setBudget(prev => ({ ...prev, buckets: updatedBuckets }));
      updateBucketAmounts();
    };

    /* Add new bucket function */  
    const addNewBucket = async () => {
      if (newBucket.name && newBucket.percentage) {
          if (!newBucket.name.trim()) {
            alert('Bucket name cannot be empty.');
            return;
          }
          if (newBucket.percentage <= 0 || newBucket.percentage > 100) {
            alert('Percentage must be between 1 and 100.');
            return;
          }
          
          const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0) + newBucket.percentage;
          if (totalPercentage > 100) {
            alert('Total percentage cannot exceed 100%.');
            return;
          }
      }
      try {
        const created = await createBudget({
          userId: userId,
          name: newBucket.name,
          amount: (newBucket.percentage/100) * budget.total,
          percentage: newBucket.percentage,
          expense: newBucket.expense,
          icon:  iconMap[newBucket.icon] ? newBucket.icon : 'Home', 
          recommendations: newBucket.recommendations || [],
          color: colors[Math.floor(Math.random() * colors.length)]

        });
        console.log('New bucket created:', created.data._id);
        const newBucketWithId: BucketType = {
          ...newBucket,
          _id: created.data._id,
          amount: (newBucket.percentage / 100) * budget.total,
          icon: created.data.icon,
          color: created.data.color
        };
        const updatedBuckets = [...budget.buckets, newBucketWithId];
        const updatedBudget: Budget = {
          ...budget,
          buckets: updatedBuckets,
        };
        setBudget(updatedBudget);
        setNewBucket({name: '', percentage: 0, amount: 0, expense: 0, icon: '', recommendations: [], color: '', _id: ''});
        setShowNewBucketForm(false);

        console.log('New bucket added:', newBucketWithId);
      } catch (err: any) {
          alert(err.message || 'Failed to save the bucket.');
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
  
    const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0);
  
    return (
      <div className="min-h-screen bg-[#F4F4EA] p-6">
        <div 
          className="max-w-6xl mx-auto">
          <div>
  
            <div className="bg-[#B3D5C2] rounded-2xl shadow-lg p-6 mb-8 ">
              <div className="flex items-center mb-2">
                <PieChart className="w-6 h-6 text-[#10492A] mr-2 " />
                <h2 className="text-xl font-semibold text-gray-700">Budget: ${budget.total}</h2>
              </div>
             
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {budget.buckets.map(bucket => (
                <div key={bucket._id} className="relative bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border text-[#10492A] transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {iconMap[bucket.icon]}
                      <h3 className="text-lg font-semibold text-gray-700 ml-2">{bucket.name}</h3>
                    </div>
                    {(
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => deleteBucket(bucket._id)}
                          className="text-[#10492A] hover:text-pink-600">
                          <Trash2 className="w-5 h-5" />
                        </button>

                        <button
                        //NEED TO MAKE THIS ADD SPENDING
                        onClick={() => setShowNewBucketForm(true)}
                        className="absolute bottom-5 right-5 text-[#10492A] hover:text-pink-600">
                        <Plus className="w-5 h-5" />
                        </button>
                      
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-6 right-12">
                      <MiniPieChart percentage={bucket.percentage} color={bucket.color} size={75} />
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
                        
                      </span>
                  </div>

                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Recommended Places:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bucket.recommendations.map((rec) => (
                        <li key={rec} className="list-none ml-4 before:content-['»'] before:mr-2">{rec}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              ))}
  
  
            </div>

            {/*adds spending*/}
          {showNewBucketForm && (
              <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-4 mb-8 border w-full md:w-1/2 lg:w-1/3">
                  <h3 className="text-md font-semibold text-[#10492A] mb-2">Add Spending:</h3>
                  <div className="space-y-2">
                      
                      <input
                          type="number"
                          className="w-full px-2 py-1 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                          placeholder="Amount"
                      />
                      <div className="flex space-x-2">
                          <button
                              className="px-3 py-1 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity text-sm"
                          >
                              Add
                          </button>
                          <button
                              onClick={() => setShowNewBucketForm(false)}
                              className="px-3 py-1 bg-gray-100 text-[#10492A] rounded-xl hover:bg-gray-200 text-sm"
                          >
                              Cancel
                          </button>
                      </div>
                  </div>
              </div>
          )}
  
      
            {/*adds new bucket*/}
            {       // Add icon selection dropdown
                    // add color selection dropdown
                    // add recommendations input
            }
             <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-4 mb-8 border w-full md:w-1/2 lg:w-1/3">
                <h3 className="text-md font-semibold text-[#10492A] mb-2">Add New Category:</h3>
                <div className="space-y-2">
                    <input
                        type="text"
                        value={newBucket.name}
                        onChange={(e) => setNewBucket(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-2 py-1 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                        placeholder="Category Name"
                    />
                    <input
                        type="number"
                        value={newBucket.percentage || ''}
                        onChange={(e) => setNewBucket(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                        className="w-full px-2 py-1 rounded-xl border focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                        placeholder="Percentage (%)"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={addNewBucket}
                            className="px-3 py-1 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity text-sm"
                        >
                            Add
                        </button>
                        <button
                            onClick={() => setShowNewBucketForm(false)}
                            className="px-3 py-1 bg-gray-100 text-[#10492A] rounded-xl hover:bg-gray-200 text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
  
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