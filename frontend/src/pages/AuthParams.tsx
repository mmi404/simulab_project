import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

const AuthParams = ({ type }: { type: 'login' | 'register' }) => {
    const navigate = useNavigate();
    const { login, register } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Basic Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email address. Please use a format like user@example.com');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            if (type === 'login') {
                await login(email, password);
            } else {
                await register(name, email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.message || err.message || 'Authentication failed. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-900">
                <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:30px_30px]" />
                <div className="absolute -top-20 -left-20 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
                <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
            </div>

            <div className="relative w-full max-w-md p-8 sm:px-10 z-10">
                {/* Logo Section */}
                <div className="flex justify-center mb-8">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20 shadow-xl group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 text-white fill-current" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">SimuLab</span>
                    </Link>
                </div>

                {/* Main Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/50">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {type === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm">
                            {type === 'login'
                                ? 'Enter your details to access your simulations'
                                : 'Join thousands of students mastering systems'}
                        </p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 border border-red-100 animate-slideUp">
                                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-4">
                            {type === 'register' && (
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium bg-slate-50/50 focus:bg-white"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium bg-slate-50/50 focus:bg-white"
                                    placeholder="john@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium bg-slate-50/50 focus:bg-white"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {type === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Checkbox / Helper Links */}
                    {type === 'login' && (
                        <div className="mt-6 flex justify-between items-center text-sm">
                            <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                                Remember me
                            </label>
                            <a href="#" className="font-semibold text-primary hover:text-blue-600">Forgot password?</a>
                        </div>
                    )}
                </div>

                {/* Toggle Type */}
                <div className="text-center mt-8">
                    <p className="text-blue-100/80">
                        {type === 'login' ? "Don't have an account yet?" : "Already have an account?"}
                        <Link
                            to={type === 'login' ? '/register' : '/login'}
                            className="ml-2 font-bold text-white hover:underline decoration-2 underline-offset-4"
                        >
                            {type === 'login' ? 'Register now' : 'Sign in'}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthParams;
