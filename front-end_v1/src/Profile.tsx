import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, DollarSign, PieChart } from 'lucide-react';

export default function ProfilePage() {
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    categories: [
      { name: 'Change Name'},
      { name: 'Change Email',},
      { name: 'Change Password',},
      { name: 'Sign out',},
    ],

  };

  return (
    <div className="min-h-screen bg-[#F4F4EA] p-6">

    <div className="max-w-4xl mx-auto p-4">

      {/* {/<nav className="flex space-x-6 mb-6 text-blue-600">
         <Link href="/expenses/new" className="hover:underline">Add Expense</Link>
        <Link href="/reports" className="hover:underline">Reports</Link>
        <Link href="/settings" className="hover:underline">Settings</Link>
        <Link href="/profile" className="font-semibold hover:underline">Profile</Link> /}
      </nav> */}

 
      <div className=" flex items-center justify-center mb-8">
        <h1 className="text-3xl font-semibold">Welcome, {user.name}!</h1>
      </div>


      <div className=" bg-[#DEE9DC] flex items-center rounded-2xl space-x-4 mb-8 p-4 border border-gray-200 rounded">

        <div>
          <h2 className="text-xl font-medium">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>

        </div>
      </div>


      <div className="bg-[#DEE9DC] p-4 border border-gray-200 rounded-2xl">
        <ul className="space-y-2">

          {user.categories.map(cat => (
            <li key={cat.name} className="flex justify-center">
                        <button
            className =" bg-[#DEE9DC]  text-[#10492A]">
              <span>{cat.name}</span>
              </button>
            </li>

          ))}
        </ul>
      </div>

   </div>
    </div>



  );
}