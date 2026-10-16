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
  ShieldCheck
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
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, openJobCount }) => {
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

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-3">
          Main Navigation
        </p>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
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
      <div className="mt-auto p-4 m-3 bg-slate-800/60 rounded-xl border border-slate-700/50 text-xs">
        <p className="font-semibold text-slate-200 mb-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Job-Centric Formula
        </p>
        <p className="text-slate-400 text-[11px] leading-relaxed">
          PROFIT = SELLING − BUYING
        </p>
        <p className="text-slate-500 text-[10px] mt-1">
          Direct manual override of calculated profit is restricted for security.
        </p>
      </div>
    </aside>
  );
};
