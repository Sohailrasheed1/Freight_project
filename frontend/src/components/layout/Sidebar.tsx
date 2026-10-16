import React from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Users, 
  Truck, 
  Building2, 
  Store, 
  Anchor, 
  BarChart3, 
  FileText, 
  ShieldCheck,
  X,
  Ship
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'jobs' 
  | 'customers' 
  | 'shippers' 
  | 'consignees' 
  | 'vendors' 
  | 'ports' 
  | 'reports' 
  | 'documents' 
  | 'audit';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openJobCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  openJobCount,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs / Shipments', icon: Layers, badge: openJobCount },
    { id: 'customers', label: 'Customers Master', icon: Users },
    { id: 'shippers', label: 'Shippers Master', icon: Truck },
    { id: 'consignees', label: 'Consignees Master', icon: Building2 },
    { id: 'vendors', label: 'Vendors Master', icon: Store },
    { id: 'ports', label: 'Ports Master', icon: Anchor },
    { id: 'reports', label: 'Reports & Profitability', icon: BarChart3 },
    { id: 'documents', label: 'Job Documents', icon: FileText },
    { id: 'audit', label: 'Security & Audit Log', icon: ShieldCheck },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const navContent = (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Mobile Drawer Header */}
      <div className="md:hidden p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">FFMS Menu</span>
            <span className="text-[10px] text-slate-400 block">Freight Forwarding</span>
          </div>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-3 sm:p-4 flex-1">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 px-3">
          Main Navigation
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick operational tip */}
      <div className="p-4 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs mt-auto shrink-0">
        <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Job-Centric Formula
        </p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          PROFIT = SELLING − BUYING
        </p>
        <p className="text-slate-500 text-[10px] mt-1">
          Auto calculated & protected.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex-col shrink-0 min-h-[calc(100vh-4rem)]">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop & Modal */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer content */}
          <aside className="relative w-72 max-w-[85vw] bg-slate-900 text-slate-300 shadow-2xl flex flex-col z-10 h-full">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
};
