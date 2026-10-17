import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Ship, Lock, User, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useApp();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    const success = login(username, password);
    if (!success) {
      setError('Invalid username or password. Check sample credentials below.');
    }
  };

  const handleQuickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    login(user, pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        
        {/* Logo and Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white items-center justify-center shadow-xl shadow-teal-500/20">
            <Ship className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Freight Forwarding Management System
          </h1>
          <p className="text-xs text-teal-200/70">
            Secure Role-Based Operations & Financial Portal (Section 4 & 14)
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/90 border border-teal-800/40 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          
          <div className="mb-6">
            <h2 className="text-base font-semibold text-white">System Sign In</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your credentials or click any demo role below</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / ID */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Username / User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or ops"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-teal-400 hover:underline"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950/70 border border-slate-700 rounded-xl text-white text-xs placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition cursor-pointer"
            >
              <span>Sign In to System</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Quick Demo Login Pills */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick 1-Click Role Login:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between text-slate-200 cursor-pointer"
              >
                <div>
                  <span className="font-semibold block text-[11px]">Administrator</span>
                  <span className="text-[10px] text-slate-400">admin / admin123</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('ops', 'ops123')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between text-slate-200 cursor-pointer"
              >
                <div>
                  <span className="font-semibold block text-[11px]">Operations</span>
                  <span className="text-[10px] text-slate-400">ops / ops123</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('accounts', 'accounts123')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between text-slate-200 cursor-pointer"
              >
                <div>
                  <span className="font-semibold block text-[11px]">Accounts</span>
                  <span className="text-[10px] text-slate-400">accounts / accounts123</span>
                </div>
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('sales', 'sales123')}
                className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-left transition flex items-center justify-between text-slate-200 cursor-pointer"
              >
                <div>
                  <span className="font-semibold block text-[11px]">Sales</span>
                  <span className="text-[10px] text-slate-400">sales / sales123</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
              </button>
            </div>
          </div>

        </div>

        {/* Security Notice */}
        <p className="text-center text-[11px] text-slate-500">
          Protected & Encrypted • Job-Centric Freight Forwarding Management System
        </p>

      </div>
    </div>
  );
};
