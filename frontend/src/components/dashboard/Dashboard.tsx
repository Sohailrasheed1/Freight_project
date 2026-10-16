import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Briefcase, 
  Clock, 
  TrendingUp, 
  CreditCard, 
  DollarSign, 
  Percent, 
  Calendar, 
  Plus, 
  ArrowUpRight, 
  AlertTriangle 
} from 'lucide-react';
import { Job } from '../../types';

interface DashboardProps {
  onOpenNewJob: () => void;
  onSelectJob: (job: Job) => void;
  onViewAllJobs: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onOpenNewJob, onSelectJob, onViewAllJobs }) => {
  const { jobs, currentRole } = useApp();

  // 8 Mandatory KPIs from Section 6.1
  const totalJobs = jobs.length;
  const openJobs = jobs.filter(j => j.status !== 'CLOSED').length;
  const totalBuying = jobs.reduce((sum, j) => sum + j.total_buying, 0);
  const totalSelling = jobs.reduce((sum, j) => sum + j.total_selling, 0);
  const grossProfit = totalSelling - totalBuying;
  const profitMarginPct = totalSelling > 0 ? (grossProfit / totalSelling) * 100 : 0;

  // Current month (October 2026) jobs
  const thisMonthJobs = jobs.filter(j => j.date.startsWith('2026-10')).length;
  const thisMonthProfit = jobs
    .filter(j => j.date.startsWith('2026-10'))
    .reduce((sum, j) => sum + j.gross_profit, 0);

  // Warnings
  const lowMarginJobs = jobs.filter(j => j.total_selling > 0 && j.profit_margin_pct < 10);
  const missingCostJobs = jobs.filter(j => j.total_selling > 0 && j.total_buying === 0);

  // Status distribution
  const statusCounts: Record<string, number> = {};
  jobs.forEach(j => {
    statusCounts[j.status] = (statusCounts[j.status] || 0) + 1;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-blue-950 p-6 rounded-2xl text-white shadow-lg border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Freight Forwarding Operations Dashboard</h1>
          <p className="text-slate-300 text-sm mt-1">
            Real-time shipment tracking, automatic profitability calculation & operational control.
          </p>
        </div>
        {(currentRole === 'Administrator' || currentRole === 'Operations' || currentRole === 'Sales') && (
          <button
            onClick={onOpenNewJob}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Job File</span>
          </button>
        )}
      </div>

      {/* Warnings Banner if any */}
      {(lowMarginJobs.length > 0 || missingCostJobs.length > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-amber-800">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1">
            <span className="font-semibold text-amber-900">Attention Required:</span>
            {lowMarginJobs.length > 0 && (
              <p>• {lowMarginJobs.length} job(s) have a profit margin below 10% (Low Margin Alert).</p>
            )}
            {missingCostJobs.length > 0 && (
              <p>• {missingCostJobs.length} job(s) have revenue recorded but ZERO buying cost entered (Missing Cost Warning).</p>
            )}
          </div>
        </div>
      )}

      {/* 8 Mandatory KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Jobs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Jobs</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">{totalJobs}</span>
            <span className="text-xs text-slate-500 block mt-0.5">All shipments in system</span>
          </div>
        </div>

        {/* 2. Open Jobs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Open Jobs</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-600">{openJobs}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Active / not yet closed</span>
          </div>
        </div>

        {/* 3. Total Buying Cost */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Buying (Cost)</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">PKR {totalBuying.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Aggregated vendor costs</span>
          </div>
        </div>

        {/* 4. Total Selling Revenue */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Selling (Revenue)</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">PKR {totalSelling.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Billed customer revenue</span>
          </div>
        </div>

        {/* 5. Gross Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Gross Profit</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-indigo-700">PKR {grossProfit.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Selling less Buying</span>
          </div>
        </div>

        {/* 6. Profit Margin % */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Profit Margin %</span>
            <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-violet-700">{profitMarginPct.toFixed(2)}%</span>
            <span className="text-xs text-slate-500 block mt-0.5">Overall profitability ratio</span>
          </div>
        </div>

        {/* 7. This Month's Jobs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">This Month's Jobs</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-800">{thisMonthJobs}</span>
            <span className="text-xs text-slate-500 block mt-0.5">October 2026 volume</span>
          </div>
        </div>

        {/* 8. This Month's Profit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">This Month's Profit</span>
            <div className="p-2 bg-teal-50 text-teal-600 rounded-lg">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-teal-700">PKR {thisMonthProfit.toLocaleString()}</span>
            <span className="text-xs text-slate-500 block mt-0.5">Current month gross profit</span>
          </div>
        </div>

      </div>

      {/* Operational Workflow Stages Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-base font-semibold text-slate-800 mb-3">Job Workflow Pipeline Distribution</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
          {[
            'NEW', 'BOOKED', 'DOCUMENTATION', 'IN TRANSIT', 'ARRIVED', 
            'DELIVERED', 'INVOICED', 'COST COMPLETED', 'CLOSED'
          ].map(st => {
            const count = statusCounts[st] || 0;
            return (
              <div key={st} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-500 block truncate">{st}</span>
                <span className={`text-lg font-bold block mt-1 ${count > 0 ? 'text-blue-600' : 'text-slate-400'}`}>
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">Recent Job Files</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click any job to open the complete job file and charge sheet</p>
          </div>
          <button
            onClick={onViewAllJobs}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            <span>View Full Register</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3 pl-6">Job No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Route (POL → POD)</th>
                <th className="p-3 text-right">Buying (PKR)</th>
                <th className="p-3 text-right">Selling (PKR)</th>
                <th className="p-3 text-right">Profit (PKR)</th>
                <th className="p-3 text-right">Margin %</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 pr-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {jobs.slice(0, 5).map(job => (
                <tr 
                  key={job.id}
                  onClick={() => onSelectJob(job)}
                  className="hover:bg-blue-50/50 transition cursor-pointer"
                >
                  <td className="p-3 pl-6 font-semibold text-blue-600">{job.job_number}</td>
                  <td className="p-3">{job.date}</td>
                  <td className="p-3 font-medium text-slate-900">{job.customer_name}</td>
                  <td className="p-3 text-slate-500">
                    {job.pol_name.split('/')[0]} → {job.pod_name.split('/')[0]}
                  </td>
                  <td className="p-3 text-right text-slate-600">{job.total_buying.toLocaleString()}</td>
                  <td className="p-3 text-right font-medium text-slate-900">{job.total_selling.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold text-emerald-600">+{job.gross_profit.toLocaleString()}</td>
                  <td className="p-3 text-right font-semibold text-slate-800">{job.profit_margin_pct.toFixed(1)}%</td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                      job.status === 'CLOSED'
                        ? 'bg-slate-100 text-slate-700'
                        : job.status === 'IN TRANSIT'
                        ? 'bg-indigo-100 text-indigo-700'
                        : job.status === 'BOOKED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3 pr-6 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectJob(job);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-slate-700 font-medium transition text-[11px]"
                    >
                      Open File
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
