import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { useAuth } from './AuthContext'; // Adjust the import path as necessary

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth(); // Use the login function from AuthContext
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email); //debug
        console.log('Password:', password);

        try {
            const res = await registerUser(email, password);
            login();
            //console.log('Navigate to setup'); //debug
            navigate('/setup');
        } catch (error: any) {
            setError(error.message || 'Failed to sign up. Please try again.1');
            //console.error(error); // Log the error for debugging
            
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-rose-100 p-6">
            <div className="max-w-md w-full bg-white/90 p-8 rounded-3xl shadow-xl backdrop-blur-md">
                <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-6 text-center">
                    Create an Account
                </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-400"
                    />
                    <button
                        type="submit"
                        className="w-full px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Sign Up
                    </button>
                </form>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <p className="text-gray-700 text-sm mt-4 text-center">
                    Already have an account?{' '}
                    <Link to="/signin" className="text-pink-500 hover:underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
