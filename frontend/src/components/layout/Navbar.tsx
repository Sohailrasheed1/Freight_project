import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Ship, Shield, Bell, Plus, UserCheck } from 'lucide-react';

interface NavbarProps {
  onOpenNewJob: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewJob }) => {
  const { currentRole, setCurrentRole, currentUser, jobs, isServerConnected } = useApp();

  const roles: UserRole[] = ['Administrator', 'Operations', 'Sales', 'Accounts', 'Management'];

  // Calculate alerts (low margin jobs or missing costs)
  const lowMarginJobs = jobs.filter(j => j.total_selling > 0 && j.profit_margin_pct < 10);
  const missingCostJobs = jobs.filter(j => j.total_selling > 0 && j.total_buying === 0);
  const totalAlerts = lowMarginJobs.length + missingCostJobs.length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-inner">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-wide text-white">FFMS</span>
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono border border-blue-400/30">v1.0 Pro</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isServerConnected 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isServerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isServerConnected ? 'Backend API Online' : 'Local Cache'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Freight Forwarding Management System</p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-4">
          
          {/* Quick Add Job Button */}
          {(currentRole === 'Administrator' || currentRole === 'Operations' || currentRole === 'Sales') && (
            <button
              onClick={onOpenNewJob}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-medium transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Job</span>
            </button>
          )}

          {/* Alert Indicator */}
          <div className="relative group">
            <button className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition">
              <Bell className="w-5 h-5" />
              {totalAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
            {totalAlerts > 0 && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3 hidden group-hover:block z-50 text-xs">
                <p className="font-semibold text-amber-400 mb-1.5">Operational Warnings ({totalAlerts}):</p>
                {lowMarginJobs.length > 0 && (
                  <p className="text-slate-300 py-1 border-b border-slate-700">
                    ⚠️ {lowMarginJobs.length} job(s) have margin &lt; 10%
                  </p>
                )}
                {missingCostJobs.length > 0 && (
                  <p className="text-slate-300 py-1">
                    ⚠️ {missingCostJobs.length} job(s) with revenue have NO buying cost
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Shield className="w-4 h-4 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Role</span>
              <select
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value as UserRole)}
                className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer"
              >
                {roles.map(r => (
                  <option key={r} value={r} className="bg-slate-800 text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Current User Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-300 border-l border-slate-700 pl-4">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{currentUser}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
