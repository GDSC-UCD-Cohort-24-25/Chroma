import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../layouts/AuthContext';
import { loginUser } from '../services/apiService';
import LoadingScreen from '../loadingScreen'

const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await loginUser(email, password);
            console.log('API Response:', res);
            login();
            console.log('navigate to dashboard');
            await new Promise((res) => setTimeout(res, 400)); // delay for loadingscreen
            navigate('/budget');
          
        } catch (error: any) {
          setError(error.message || 'Failed to sign in. Please try again.');
          console.error(error);
        }
        finally{
            setLoading(false);
        }
      };
    if (loading) return <LoadingScreen />;
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
    
            {/* Right Side: Sign-in Form */}
            <div className="w-1/2 p-8 pr-16 flex flex-col pt-20">
            <h2 className="text-3xl font-bold bg-clip-text text-[#92BAA4] mb-6 text-center">
                 Welcome Back!
            </h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
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
                        Sign In
                    </button>
                </form>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                <p className="text-gray-700 text-sm mt-4 text-center">
                    Don't have an account?{' '}
                    <Link to="/signUp" className="text-[#92BAA4] hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    </div>
    );
};

export default SignIn;
