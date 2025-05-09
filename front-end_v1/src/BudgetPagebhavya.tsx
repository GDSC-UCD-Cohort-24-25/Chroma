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
    budgetedAmount: number; 
    spent: number;          
    percentage: number;
    color: string;
}
  
  const defaultBuckets: BucketType[] = [
    {
      id: '1',
      name: 'Rent',
      budgetedAmount: 2500,
      spent: 2000,
      percentage: 20,
      color: '#8FB6B0' //blue
    },
    {
      id: '2',
      name: 'Fun & Vibes',
      budgetedAmount: 200,
      spent: 50,
      percentage: 30,
      color: '#EEAB8C' // orange
    },
    {
      id: '3',
      name: 'Shopping Sprees',
      budgetedAmount: 200,
      spent: 100,
      percentage: 20,
      color: '#C18BC1' //purple
    },
    {
      id: '4',
      name: 'Getting Around',
      budgetedAmount: 100,
      spent: 25,
      percentage: 15,
      color: '#F3DFA1' // yellow
    },
    
    {
      id: '5',
      name: 'Coffee & Sips',
      budgetedAmount: 50,
      spent: 10,
      percentage: 10,
      color: '#FFC9DE' //  pink
    }
  ];
  
  function BudgetPage() {
    const [budget, setBudget] = useState<Budget>({
      total: 5000,
      buckets: defaultBuckets
    });
    const [showNewBucketForm, setShowNewBucketForm] = useState(false);
    const [newBucket, setNewBucket] = useState({
      name: '',
      budgetedAmount: 0
  });
    
    const [error, setError] = useState<string | null>(null);
    const [spendingAmount, setSpendingAmount] = useState<number | null>(null);
    const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
    const [showAddSpendingForm, setShowAddSpendingForm] = useState(false);

  
    useEffect(() => {
      // Fetch budget data from the backend when the component mounts
      const loadBudgets = async () => {
        try {
          const data = await fetchUserBudget(); // Fetch budgets from the backend
          if (data && data.buckets) {
            setBudget({
              total: data.total || 0,
              buckets: data.buckets.map((b: any) => ({ 
                  ...b,
                  spent: b.spent || 0,
                  budgetedAmount: b.budgetedAmount || (b.percentage / 100) * (data.total || 0),
              }))
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
        budgetedAmount: (bucket.percentage / 100) * budget.total
      }));
      setBudget(prev => ({ ...prev, buckets: updatedBuckets }));
    };
  
    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value) || 0;
      setBudget(prev => ({ ...prev, total: value }));
      updateBucketAmounts();
    };
  
    const addNewBucket = async () => {
      if (newBucket.name && newBucket.budgetedAmount > 0) {
          // Checks for empty name and budgeted amount range
          if (!newBucket.name.trim()) {
              alert('Bucket name cannot be empty.');
              return;
          }
          if (newBucket.budgetedAmount <= 0 || newBucket.budgetedAmount > budget.total) {
              alert('Budgeted amount must be greater than zero and less than or equal to the total budget.');
              return;
          }
  
          // Calculate the new bucket's percentage of the total budget
          const newPercentage = (newBucket.budgetedAmount / budget.total) * 100;
  
          // Recalculate the total percentage of all buckets including the new one
          const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0) + newPercentage;
          if (totalPercentage > 100) {
              alert('Total percentage of all categories cannot exceed 100%.');
              return;
          }
  
          const newId = (budget.buckets.length + 1).toString();
          const newBucketItem: BucketType = {
              id: newId,
              name: newBucket.name,
              budgetedAmount: newBucket.budgetedAmount,
              spent: 0,
              percentage: newPercentage,
              color: '#FFD1DC' // Default new bucket color
          };
          const updatedBudget = {
              ...budget,
              buckets: [...budget.buckets, newBucketItem],
          };
  
          setBudget(updatedBudget);
          setNewBucket({ name: '', budgetedAmount: 0 }); // Reset budgetedAmount
          setShowNewBucketForm(false);
  
          try {
              await saveBudget(updatedBudget);
              alert('Bucket added successfully!');
          } catch (err: any) {
              alert(err.message || 'Failed to save the bucket.');
          }
      } else {
          alert('Please enter a category name and a budget amount greater than zero.');
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

    const handleAddSpending = async (amount: number, bucketId: string) => {
      const updatedBuckets = budget.buckets.map(bucket =>
          bucket.id === bucketId ? { ...bucket, spent: bucket.spent + amount } : bucket
      );
      const updatedBudget = { ...budget, buckets: updatedBuckets };
      setBudget(updatedBudget);
      setSpendingAmount(null);
      setSelectedBucketId(null);
      setShowAddSpendingForm(false);
      try {
          await saveBudget(updatedBudget); // Assuming your saveBudget can handle updates too
          alert('Spending added successfully!');
      } catch (err: any) {
          alert(err.message || 'Failed to save spending.');
      }
  };

  
    const totalPercentage = budget.buckets.reduce((sum, bucket) => sum + bucket.percentage, 0);
  
    return (
      //NEED TO ADD USER'S NAME
      <div className="min-h-screen bg-[#F4F4EA] p-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl mb-2 p-6 font-semibold text-[#10492A]">Welcome, "Name"!</h2>
          <div >
  
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
                <div key={bucket.id} className="relative bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border text-[#10492A] transition-all duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-700">{bucket.name}</h3>
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
    onClick={() => {
        setSelectedBucketId(bucket.id);
        setShowAddSpendingForm(true);
    }}
    className="absolute bottom-5 right-5 text-[#10492A] hover:text-pink-600"
>
    <Plus className="w-5 h-5" />
</button>
    

  </div>
)}
        </div>
        <div className="absolute bottom-6 right-12">
        <MiniPieChart percentage={(bucket.spent / bucket.budgetedAmount) * 100 || 0} color={bucket.color} size={75}  />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ">  
        </span>
    </div>
  
    <div className="mt-2">
    <h4 className="text-sm font-medium text-gray-700 mb-1">Budget:</h4>
    <p className="text-md font-semibold text-[#10492A]">${bucket.budgetedAmount.toFixed(2)}</p>
    <h4 className="text-sm font-medium text-gray-700 mt-1">Spent:</h4>
    <p className="text-md font-semibold text-blue-700">${bucket.spent.toFixed(2)}</p>
</div>
                </div>
              ))}
  
  
            </div>

    {/*adds spending*/}
    {showAddSpendingForm && selectedBucketId && (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#DEE9DC] rounded-2xl shadow-lg p-6 border border-green-200 z-50">
        <h3 className="text-lg font-semibold text-[#10492A] mb-4">Add Spending to "{budget.buckets.find(b => b.id === selectedBucketId)?.name}"</h3>
        <input
            type="number"
            value={spendingAmount || ''}
            onChange={(e) => setSpendingAmount(parseFloat(e.target.value) || null)}
            className="w-full px-4 py-2 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-400 focus:border-transparent mb-4"
            placeholder="Amount to Add"
        />
        <div className="flex space-x-4">
            <button
                onClick={() => {
                    if (spendingAmount !== null && selectedBucketId) {
                        const updatedBuckets = budget.buckets.map(b =>
                            b.id === selectedBucketId ? { ...b, spent: b.spent + spendingAmount } : b
                        );
                        const updatedBudget = { ...budget, buckets: updatedBuckets };
                        setBudget(updatedBudget);
                        setSpendingAmount(null);
                        setSelectedBucketId(null);
                        setShowAddSpendingForm(false);
                        saveBudget(updatedBudget);
                    }
                }}
                className="px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
                Add
            </button>
            <button
                onClick={() => {
                    setSpendingAmount(null);
                    setSelectedBucketId(null);
                    setShowAddSpendingForm(false);
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
            >
                Cancel
            </button>
        </div>
    </div>
)}
  
      
       {/*adds new bucket*/}
 {/* "Add New Category" form */}
{showNewBucketForm && (
    <div className="bg-[#DEE9DC] rounded-2xl shadow-lg p-4 mb-8 border border-pink-200 w-full md:w-1/2 lg:w-1/3">
        <h3 className="text-md font-semibold text-[#10492A] mb-2">Add New Category:</h3>
        <div className="space-y-2">
            <input
                type="text"
                value={newBucket.name}
                onChange={(e) => setNewBucket(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-2 py-1 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                placeholder="Category Name:"
            />
            <input
                type="number"
                value={newBucket.budgetedAmount || ''}
                onChange={(e) => setNewBucket(prev => ({ ...prev, budgetedAmount: parseFloat(e.target.value) || 0 }))}
                className="w-full px-2 py-1 rounded-xl border border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-transparent text-sm"
                placeholder="$Budgeted Amount:"
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
)}
  
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