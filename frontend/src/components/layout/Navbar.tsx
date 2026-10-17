import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Ship, Shield, Bell, Plus, UserCheck, LogOut, Menu } from 'lucide-react';

interface NavbarProps {
  onOpenNewJob: () => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewJob, onToggleMobileMenu }) => {
  const { currentRole, setCurrentRole, currentUser, jobs, isServerConnected, logout } = useApp();

  const roles: UserRole[] = ['Administrator', 'Operations', 'Sales', 'Accounts', 'Management'];

  // Calculate alerts (low margin jobs or missing costs)
  const lowMarginJobs = jobs.filter(j => j.total_selling > 0 && j.profit_margin_pct < 10);
  const missingCostJobs = jobs.filter(j => j.total_selling > 0 && j.total_buying === 0);
  const totalAlerts = lowMarginJobs.length + missingCostJobs.length;

  return (
    <header className="bg-slate-900/95 backdrop-blur-md text-white border-b border-teal-800/40 sticky top-0 z-30 shadow-md w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-1.5 sm:gap-4 w-full">
        
        {/* Left: Mobile Hamburger & Brand */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700 transition focus:outline-none border border-slate-700 shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-md shadow-teal-900/40 shrink-0">
            <Ship className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>

          <div className="shrink-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-lg tracking-wide text-white">FFMS</span>
              <span className="hidden xs:inline-flex text-[10px] sm:text-xs bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded font-mono border border-teal-400/30">
                v1.0
              </span>
              <span className={`hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-full font-bold items-center gap-1 ${
                isServerConnected 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isServerConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{isServerConnected ? 'Online' : 'Local'}</span>
              </span>
            </div>
            <p className="text-[11px] text-teal-200/70 hidden lg:block">Freight Forwarding Management System</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          
          {/* Quick Add Job Button */}
          {(currentRole === 'Administrator' || currentRole === 'Operations' || currentRole === 'Sales') && (
            <button
              onClick={onOpenNewJob}
              className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 text-slate-950 p-1.5 sm:px-3 sm:py-1.5 rounded-lg text-xs font-bold transition shadow-sm shrink-0 cursor-pointer"
              title="Add New Job"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Job</span>
            </button>
          )}

          {/* Alert Indicator */}
          <div className="relative group">
            <button className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              {totalAlerts > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              )}
            </button>
            {totalAlerts > 0 && (
              <div className="absolute right-0 mt-2 w-64 sm:w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-3 hidden group-hover:block z-50 text-xs">
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
          <div className="flex items-center gap-1 bg-slate-800/80 px-1.5 sm:px-2.5 py-1 rounded-lg border border-slate-700">
            <Shield className="w-3.5 h-3.5 text-blue-400 shrink-0 hidden xs:block" />
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-[10px] sm:text-xs font-medium text-white focus:outline-none cursor-pointer max-w-[65px] sm:max-w-none truncate"
            >
              {roles.map(r => (
                <option key={r} value={r} className="bg-slate-800 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Current User Badge & Logout */}
          <div className="flex items-center gap-1 sm:gap-2 border-l border-slate-700 pl-1 sm:pl-2.5">
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span className="truncate max-w-[100px]">{currentUser}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition flex items-center gap-1 text-xs cursor-pointer"
              title="Sign Out / Exit"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>

        </div>

      </div>
    </header>
  );
};
