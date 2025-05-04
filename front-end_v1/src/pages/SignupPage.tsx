import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/apiService';
import { useAuth } from '../layouts/AuthContext';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Email:', email); //debug
        console.log('Password:', password);

        try {
            const res = await registerUser(email, password, name);
            console.log('API Response:', res);
            login();
            console.log('Navigate to setup'); //debug
            navigate('/setup');
            
            
        } catch (error: any) {
            setError(error.message || 'Failed to sign up. Please try again.1');
            //console.error(error); // Log the error for debugging
            
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F4EA] p-6 flex items-center justify-center">
    <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl p-8 shadow-xl backdrop-blur-md flex">
        {/* Left Side: Logo */}
        <div className="w-1/2 flex justify-center">
            <img
                src="/assets/logo.png"
                alt="Cow Budget"
                className="max-w-full h-auto rounded-xl"
            />
        </div>

        {/* Right Side: Sign-up Form */}
        <div className="w-1/2 p-8 pr-16 flex flex-col pt-20">
            <h2 className="text-3xl font-bold bg-clip-text text-[#92BAA4] mb-6 text-center">
                 Create an account!
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                    type="name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    className="w-full px-6 py-2 bg-[#92BAA4] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                    Sign Up
                </button>
            </form>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <p className="text-gray-700 text-sm mt-4 text-center">
                Already have an account?{' '}
                <Link to="/signin" className="text-[#92BAA4] hover:underline">
                    Sign In
                </Link>
            </p>
        </div>
    </div>
</div>
    );
};

export default SignUp;
