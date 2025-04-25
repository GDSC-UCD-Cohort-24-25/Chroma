import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, Coffee, ShoppingBag, Car, Home, Gamepad2, Utensils, Plus, Trash2, Sparkles } from 'lucide-react';
import { fetchUserBudget } from '../services/apiService'; // Adjust the import path as necessary
import { saveBudget } from '../services/apiService'; // Adjust the import path as necessary
import MiniPieChart from '../src/MiniPieChart'; // Adjust the path if your MiniPieChart.tsx is in a different folder

interface Budget {
    total: number;
    buckets: BucketType[];
  }
  
  interface BucketType {
    id: string;
    name: string;
    amount: number;
    percentage: number;
    icon: string;
    recommendations: string[];
    color: string;
  }
  
  const defaultBuckets: BucketType[] = [
    {
      id: '1',
      name: 'Rent',
      amount: 1000,
      percentage: 20,
      icon: 'Home',
      recommendations: [
        'Fixed rent',
      ],
      color: '#8FB6B0' //blue
    },
    {
      id: '2',
      name: 'Fun & Vibes',
      amount: 0,
      percentage: 20,
      icon: 'Gamepad2',
      recommendations: [
        'empty for now',
         '',
      ],
      color: '#EEAB8C' // orange
    },
    {
      id: '3',
      name: 'Shopping Sprees',
      amount: 0,
      percentage: 15,
      icon: 'ShoppingBag',
      recommendations: [
        'empty for now',
         '',
      ],
      color: '#C18BC1' //purple
    },
    {
      id: '4',
      name: 'Getting Around',
      amount: 0,
      percentage: 15,
      icon: 'Car',
      recommendations: [
        'empty for now',
         '',
      ],
      color: '#F3DFA1' // yellow
    },
    {
      id: '5',
      name: 'Coffee & Sips',
      amount: 0,
      percentage: 10,
      icon: 'Coffee',
      recommendations: [
        'empty for now',
         '',
      ],
      color: '#FFC9DE' //  pink
    }
  ];
  
  const iconMap: { [key: string]: React.ReactNode } = {
    Utensils: <Utensils className="w-6 h-6" />,
    Gamepad2: <Gamepad2 className="w-6 h-6" />,
    ShoppingBag: <ShoppingBag className="w-6 h-6" />,
    Car: <Car className="w-6 h-6" />,
    Coffee: <Coffee className="w-6 h-6" />,
    Home: <Home className="w-6 h-6" />
  };
  
  function BudgetPage() {
    const [budget, setBudget] = useState<Budget>({
      total: 0,
      buckets: defaultBuckets
    });
    const [showNewBucketForm, setShowNewBucketForm] = useState(false);
    const [newBucket, setNewBucket] = useState({
      name: '',
      percentage: 0
    });
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      // Fetch budget data from the backend when the component mounts
      const loadBudgets = async () => {
        try {
          const data = await fetchUserBudget(); // Fetch budgets from the backend
          if (data && data.buckets) {
              setBudget({
                  total: data.total || 0, buckets: data.buckets || []
              });
          }
        } catch (error: any) {
            setError(error.message || 'An error occurred while fetching budgets.');
        } 
      };
      loadBudgets();
    }, []);
  
    const updateBucketAmounts = () => {
      const updatedBuckets = budget.buckets.map(bucket => ({
        ...bucket,
        amount: (bucket.percentage / 100) * budget.total
      }));
      setBudget(prev => ({ ...prev, buckets: updatedBuckets }));
    };
  
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setBudget(prev => ({ ...prev, total: value }));
      updateBucketAmounts();
    };
  
    const handlePercentageChange = (id: string, newPercentage: number) => {
      const updatedBuckets = budget.buckets.map(bucket =>
        bucket.id === id ? { ...bucket, percentage: newPercentage } : bucket
      );
      setBudget(prev => ({ ...prev, buckets: updatedBuckets }));
      updateBucketAmounts();
    };
  
    const addNewBucket = async () => {
      if (newBucket.name && newBucket.percentage) {
        // Checks for empty name and percentage range
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

        const newId = (budget.buckets.length + 1).toString();
        const newBucketItem: BucketType = {
          id: newId,
          name: newBucket.name,
          amount: (newBucket.percentage / 100) * budget.total,
          percentage: newBucket.percentage,
          icon: 'Home',
          recommendations: ['Customize!'],
          color: '#FFD1DC' // Default new bucket color
        };
        const updatedBudget = {
          ...budget,
          buckets: [...budget.buckets, newBucketItem],
      };

      setBudget(updatedBudget);
      setNewBucket({ name: '', percentage: 0 });
      setShowNewBucketForm(false);

      try {
        await saveBudget(updatedBudget);
        alert('Bucket added successfully!');
      } catch (err: any) {
          alert(err.message || 'Failed to save the bucket.');
      }
  }
    };
  
    const deleteBucket = async (id: string) => {
      if (id === '1') {
          alert('You cannot delete the default bucket.');
          return;
      }
      if (!window.confirm('Are you sure you want to delete this bucket?')) {
        return;
      }

      const updatedBudget = {
        ...budget,
        buckets: budget.buckets.filter((bucket) => bucket.id !== id),
      };

      setBudget(updatedBudget);

      try {
        await saveBudget(updatedBudget);
        alert('Bucket deleted successfully!');
      } catch (err: any) {
          alert(err.message || 'Failed to delete the bucket.');
      }
    };
  
    const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0);
  
    return (
      <div className="min-h-screen bg-[#F4F4EA] p-6">
        <div 
          className="max-w-6xl mx-auto"
        >
          <div >
  
            <div className="bg-[#B3D5C2] rounded-2xl shadow-lg p-6 mb-8 ">
              <div className="flex items-center mb-2">
                <PieChart className="w-6 h-6 text-[#10492A] mr-2 " />
                <h2 className="text-xl font-semibold text-gray-700">Budget: ${budget.total}</h2>
              </div>
             
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {budget.buckets.map(bucket => (
                <div key={bucket.id} className="relative bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border text-[#10492A] transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {iconMap[bucket.icon]}
                      <h3 className="text-lg font-semibold text-gray-700 ml-2">{bucket.name}</h3>
                    </div>
                    {bucket.id !== '1' && (
  <div className="flex items-center space-x-2">
    <button
      onClick={() => deleteBucket(bucket.id)}
      className="text-[#10492A] hover:text-pink-600"
    >
      <Trash2 className="w-5 h-5" />
    </button>

    <button
    //NEED TO MAKE THIS ADD SPENDING
    onClick={() => setShowNewBucketForm(true)}
    className="absolute bottom-5 right-5 text-[#10492A] hover:text-pink-600"
>
    <Plus className="w-5 h-5" />
</button>
    

  </div>
)}
                  </div>
                  
               
                  <div className="absolute bottom-6 right-12">
        <MiniPieChart percentage={bucket.percentage} color={bucket.color} size={75} strokeWidth={8} />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">
           
        </span>
    </div>
  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Recommended Places:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bucket.recommendations.map((rec, index) => (
                        <li key={index} className="list-none ml-4 before:content-['»'] before:mr-2">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  

                  

                  
                </div>
              ))}
  
  
            </div>

                        {/*adds spending*/}
            {showNewBucketForm && (
    <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-4 mb-8 border border-pink-200 w-full md:w-1/2 lg:w-1/3">
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
             <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-4 mb-8 border border-pink-200 w-full md:w-1/2 lg:w-1/3">
                    <h3 className="text-md font-semibold text-[#10492A] mb-2">Add New Category:</h3>
                    <div className="space-y-2">
                        <input
                            type="text"
                            value={newBucket.name}
                            onChange={(e) => setNewBucket(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-2 py-1 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                            placeholder="Category Name"
                        />
                        <input
                            type="number"
                            value={newBucket.percentage || ''}
                            onChange={(e) => setNewBucket(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-2 py-1 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
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
  
  <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border border-pink-200">
    <h2 className="text-xl font-semibold text-[#10492A] mb-4">Spending Distribution</h2>
    <div className="h-4 bg-[#A6AAAE] rounded-full overflow-hidden">
        {budget.buckets.map(bucket => (
            <div
                key={bucket.id}
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