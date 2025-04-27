import React, { useState, useEffect } from 'react';
import { Wallet, PieChart, Coffee, ShoppingBag, Car, Home, Gamepad2, Utensils, Plus, Trash2, Sparkles } from 'lucide-react';
import { fetchUserBudget } from '../services/apiService'; // Adjust the import path as necessary
import { saveBudget } from '../services/apiService'; // Adjust the import path as necessary
import { useAuth } from './AuthContext';
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
      name: 'Food & Treats',
      amount: 0,
      percentage: 30,
      icon: 'Utensils',
      recommendations: [
        'Sweetgreen - Fresh & Instagram-worthy salads',
        'Local Cafes - Aesthetic brunch spots',
        'Whole Foods - Organic & trendy snacks'
      ],
      color: '#FF9ECD' // Soft pink
    },
    {
      id: '2',
      name: 'Fun & Vibes',
      amount: 0,
      percentage: 20,
      icon: 'Gamepad2',
      recommendations: [
        'Local Art Classes - Express your creativity',
        'Rooftop Yoga - Wellness with a view',
        'Pop-up Events - Exclusive experiences'
      ],
      color: '#B5B7FF' // Soft purple
    },
    {
      id: '3',
      name: 'Shopping Sprees',
      amount: 0,
      percentage: 15,
      icon: 'ShoppingBag',
      recommendations: [
        'Reformation - Sustainable fashion finds',
        'Sephora - Beauty must-haves',
        'Urban Outfitters - Room decor goals'
      ],
      color: '#FFB5E8' // Light pink
    },
    {
      id: '4',
      name: 'Getting Around',
      amount: 0,
      percentage: 15,
      icon: 'Car',
      recommendations: [
        'Uber - Safe rides for night outs',
        'City Bike Share - Eco-friendly transport',
        'Monthly Transit Pass - Budget-friendly commuting'
      ],
      color: '#AFF8DB' // Mint
    },
    {
      id: '5',
      name: 'Coffee & Sips',
      amount: 0,
      percentage: 10,
      icon: 'Coffee',
      recommendations: [
        'Aesthetic Cafes - Perfect for content creation',
        'Boba Tea Spots - Sweet treat yourself moments',
        'Pressed Juice Bars - Healthy glow up'
      ],
      color: '#FFC9DE' // Dusty pink
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
    const { isAuthenticated } = useAuth();
    useEffect(() => {
      const loadBudgets = async () => {
        try {
          if (isAuthenticated) {
            // Fetch user budget and categories
            const data = await fetchUserBudget();
            setBudget({
              total: data.totalBudget || 0,
              buckets: data.Categories || [],
            });
          } else {
            console.log("User is not authenticated.");
            window.location.href = '/';
          }
        } catch (error) {
          console.error('Error fetching user budget:', error);
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
          recommendations: ['Customize your recommendations'],
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
        await saveBudget({
          totalBudget: updatedBudget.total,
          Categories: updatedBudget.buckets
        });
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
        await saveBudget({
          totalBudget: updatedBudget.total,
          Categories: updatedBudget.buckets
        });
        alert('Bucket deleted successfully!');
      } catch (err: any) {
          alert(err.message || 'Failed to delete the bucket.');
      }
    };
  
    const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0);
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
        <div 
          className="max-w-6xl mx-auto"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1557683311-eac922347aa1?auto=format&fit=crop&w=2080&q=80')",
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            backgroundPosition: 'center'
          }}
        >
          <div className="backdrop-blur-md bg-white/80 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-center mb-8">
              <Sparkles className="w-8 h-8 text-pink-500 mr-2" />
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                Budget Bestie
              </h1>
              <Sparkles className="w-8 h-8 text-pink-500 ml-2" />
            </div>
  
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-8 border border-pink-200">
              <div className="flex items-center mb-6">
                <PieChart className="w-6 h-6 text-pink-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-700">Total Budget</h2>
              </div>
              <input
                type="number"
                value={budget.total || ''}
                onChange={handleBudgetChange}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent placeholder-pink-300"
                placeholder="✨ Enter your total budget ✨"
              />
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {budget.buckets.map(bucket => (
                <div key={bucket.id} className="bg-white/90 rounded-2xl shadow-lg p-6 border border-pink-200 hover:border-pink-400 transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {iconMap[bucket.icon]}
                      <h3 className="text-lg font-semibold text-gray-700 ml-2">{bucket.name}</h3>
                    </div>
                    {bucket.id !== '1' && (
                      <button
                        onClick={() => deleteBucket(bucket.id)}
                        className="text-pink-400 hover:text-pink-600"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={bucket.percentage}
                      onChange={(e) => handlePercentageChange(bucket.id, parseInt(e.target.value))}
                      className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: bucket.color,
                        backgroundSize: `${bucket.percentage}% 100%`,
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span className="text-pink-500 font-medium">{bucket.percentage}%</span>
                      <span className="text-purple-500 font-medium">${bucket.amount.toFixed(2)}</span>
                    </div>
                  </div>
  
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">✨ Recommended Places:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {bucket.recommendations.map((rec, index) => (
                        <li key={index} className="list-none ml-4 before:content-['💖'] before:mr-2">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
  
              {!showNewBucketForm && (
                <button
                  onClick={() => setShowNewBucketForm(true)}
                  className="bg-white/90 rounded-2xl shadow-lg p-6 border-2 border-dashed border-pink-300 flex items-center justify-center hover:border-pink-500 transition-colors"
                >
                  <Plus className="w-6 h-6 text-pink-400" />
                  <span className="ml-2 text-pink-500">Add New Category</span>
                </button>
              )}
            </div>
  
            {showNewBucketForm && (
              <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-8 border border-pink-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">✨ Add New Category</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newBucket.name}
                    onChange={(e) => setNewBucket(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    placeholder="Category Name"
                  />
                  <input
                    type="number"
                    value={newBucket.percentage || ''}
                    onChange={(e) => setNewBucket(prev => ({ ...prev, percentage: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-4 py-2 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                    placeholder="Percentage (%)"
                  />
                  <div className="flex space-x-4">
                    <button
                      onClick={addNewBucket}
                      className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Add Category ✨
                    </button>
                    <button
                      onClick={() => setShowNewBucketForm(false)}
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
  
            <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-pink-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-700">Budget Distribution</h2>
                <span className={`text-sm font-medium ${totalPercentage > 100 ? 'text-red-500' : 'text-pink-500'}`}>
                  Total: {totalPercentage}% ✨
                </span>
              </div>
              <div className="h-4 bg-pink-100 rounded-full overflow-hidden">
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
              <div className="mt-4 flex flex-wrap gap-4">
                {budget.buckets.map(bucket => (
                  <div key={bucket.id} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: bucket.color
                      }}
                    />
                    <span className="text-sm text-gray-600">{bucket.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default BudgetPage;