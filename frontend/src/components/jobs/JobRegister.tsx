import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, JobStatus, TransportMode, JobType } from '../../types';
import { exportJobsToExcel, exportJobsToPDF } from '../../utils/exportUtils';
import { 
  Search, 
  FileSpreadsheet, 
  FileText, 
  Plus, 
  Filter, 
  X, 
  Eye, 
  Lock,
  ArrowUpDown,
  Trash2,
  RotateCcw
} from 'lucide-react';

interface JobRegisterProps {
  onSelectJob: (job: Job) => void;
  onOpenNewJob: () => void;
}

export const JobRegister: React.FC<JobRegisterProps> = ({ onSelectJob, onOpenNewJob }) => {
  const { jobs, currentRole, clearAllDemoData, resetToDemoData } = useApp();

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [modeFilter, setModeFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Sorting
  const [sortField, setSortField] = useState<keyof Job>('date');
  const [sortAsc, setSortAsc] = useState(false);

  // Filter & Search logic
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      // Global text search across mandatory fields (Section 10)
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        const matchesTerm = 
          job.job_number.toLowerCase().includes(term) ||
          job.customer_name.toLowerCase().includes(term) ||
          job.shipper_name.toLowerCase().includes(term) ||
          job.consignee_name.toLowerCase().includes(term) ||
          job.mbl_number.toLowerCase().includes(term) ||
          job.hbl_number.toLowerCase().includes(term) ||
          job.pol_name.toLowerCase().includes(term) ||
          job.pod_name.toLowerCase().includes(term) ||
          job.vessel_name.toLowerCase().includes(term) ||
          job.commodity.toLowerCase().includes(term) ||
          job.containers.some(c => c.container_number.toLowerCase().includes(term));

        if (!matchesTerm) return false;
      }

      // Status
      if (statusFilter !== 'ALL' && job.status !== statusFilter) return false;

      // Mode
      if (modeFilter !== 'ALL' && job.mode !== modeFilter) return false;

      // Type
      if (typeFilter !== 'ALL' && job.job_type !== typeFilter) return false;

      // Date range
      if (dateFrom && job.date < dateFrom) return false;
      if (dateTo && job.date > dateTo) return false;

      return true;
    }).sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';

      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortAsc 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [jobs, searchTerm, statusFilter, modeFilter, typeFilter, dateFrom, dateTo, sortField, sortAsc]);

  // Aggregate sums for current view
  const sumBuying = filteredJobs.reduce((sum, j) => sum + j.total_buying, 0);
  const sumSelling = filteredJobs.reduce((sum, j) => sum + j.total_selling, 0);
  const sumProfit = sumSelling - sumBuying;
  const avgMargin = sumSelling > 0 ? (sumProfit / sumSelling) * 100 : 0;

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('ALL');
    setModeFilter('ALL');
    setTypeFilter('ALL');
    setDateFrom('');
    setDateTo('');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Job Register</h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Operational register with automatic multi-currency charges, buying cost, selling revenue and profit.
          </p>
        </div>

        {/* Action Buttons: Export to Excel, PDF, New Job */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-wrap">
          <button
            onClick={() => exportJobsToExcel(filteredJobs)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            title="Export filtered records to Microsoft Excel"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Excel Export</span>
          </button>

          <button
            onClick={() => exportJobsToPDF(filteredJobs)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            title="Export filtered records to PDF document"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>PDF Export</span>
          </button>

          {(currentRole === 'Administrator' || currentRole === 'Operations' || currentRole === 'Sales') && (
            <button
              onClick={onOpenNewJob}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Add Job</span>
            </button>
          )}

          {jobs.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm('Kya aap tamam demo jobs khatam karke bilkul fresh (khali) register shuru karna chahte hain?')) {
                  clearAllDemoData();
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 border border-slate-200 rounded-lg text-xs font-medium transition cursor-pointer"
              title="Clear sample demo jobs to start with clean real data"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden xs:inline sm:inline">Clear Demo</span>
              <span className="xs:hidden sm:hidden">Clear</span>
            </button>
          ) : (
            <button
              onClick={() => resetToDemoData()}
              className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition cursor-pointer"
              title="Restore sample demo jobs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Load Demo</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          
          {/* Global Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Job #, Customer, Shipper, MBL, HBL, POL, POD, Container #, Vessel, Commodity..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">NEW</option>
            <option value="BOOKED">BOOKED</option>
            <option value="DOCUMENTATION">DOCUMENTATION</option>
            <option value="IN TRANSIT">IN TRANSIT</option>
            <option value="ARRIVED">ARRIVED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="INVOICED">INVOICED</option>
            <option value="COST COMPLETED">COST COMPLETED</option>
            <option value="CLOSED">CLOSED</option>
          </select>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition ${
              showFilters || modeFilter !== 'ALL' || typeFilter !== 'ALL' || dateFrom || dateTo
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>

          {(searchTerm || statusFilter !== 'ALL' || modeFilter !== 'ALL' || typeFilter !== 'ALL' || dateFrom || dateTo) && (
            <button
              onClick={clearFilters}
              className="text-xs text-rose-600 hover:underline px-2 py-1 font-medium"
            >
              Reset
            </button>
          )}

        </div>

        {/* Collapsible Advanced Filters (Section 10) */}
        {showFilters && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Transport Mode</label>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">All Modes</option>
                <option value="Sea">Sea Freight</option>
                <option value="Air">Air Freight</option>
                <option value="Road">Road Freight</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Direction / Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              >
                <option value="ALL">Export & Import</option>
                <option value="Export">Export</option>
                <option value="Import">Import</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">Date To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white"
              />
            </div>
          </div>
        )}

      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                <th 
                  className="p-3 pl-5 cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('job_number')}
                >
                  <div className="flex items-center gap-1">
                    <span>Job No</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="p-3 cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('customer_name')}
                >
                  <div className="flex items-center gap-1">
                    <span>Customer</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3">MBL / HBL</th>
                <th className="p-3">POL → POD</th>
                <th className="p-3">Mode & Type</th>
                <th 
                  className="p-3 text-right cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('total_buying')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Buying (Cost)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="p-3 text-right cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('total_selling')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Selling (Revenue)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="p-3 text-right cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('gross_profit')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Profit</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="p-3 text-right cursor-pointer hover:bg-slate-200 transition"
                  onClick={() => handleSort('profit_margin_pct')}
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Margin</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 pr-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-slate-400 font-medium">
                    No jobs match the specified search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredJobs.map(job => {
                  const isLowMargin = job.total_selling > 0 && job.profit_margin_pct < 10;
                  const isMissingCost = job.total_selling > 0 && job.total_buying === 0;

                  return (
                    <tr
                      key={job.id}
                      onClick={() => onSelectJob(job)}
                      className={`hover:bg-blue-50/60 transition cursor-pointer ${
                        job.is_locked ? 'bg-slate-50/50' : ''
                      }`}
                    >
                      <td className="p-3 pl-5 font-bold text-blue-600 flex items-center gap-1.5">
                        {job.is_locked && (
                          <span title="Job Closed & Profit Locked">
                            <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                          </span>
                        )}
                        <span>{job.job_number}</span>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">{job.date}</td>
                      <td className="p-3 font-medium text-slate-900 max-w-[160px] truncate" title={job.customer_name}>
                        {job.customer_name}
                      </td>
                      <td className="p-3 text-slate-500 whitespace-nowrap">
                        <div className="text-[11px] font-mono text-slate-700">{job.mbl_number || '-'}</div>
                        <div className="text-[10px] text-slate-400">{job.hbl_number || '-'}</div>
                      </td>
                      <td className="p-3 text-slate-600 whitespace-nowrap">
                        <span className="font-medium">{job.pol_name.split('/')[0]}</span>
                        <span className="text-slate-400 mx-1">→</span>
                        <span>{job.pod_name.split('/')[0]}</span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 mr-1">
                          {job.mode}
                        </span>
                        <span className="text-[10px] text-slate-500">{job.job_type}</span>
                      </td>
                      <td className="p-3 text-right font-medium text-slate-600">
                        {job.total_buying.toLocaleString()}
                        {isMissingCost && (
                          <span className="block text-[9px] text-rose-500 font-bold">⚠️ No Cost!</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold text-slate-900">
                        {job.total_selling.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-bold text-emerald-600">
                        +{job.gross_profit.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-bold">
                        <span className={`px-1.5 py-0.5 rounded ${
                          isLowMargin ? 'bg-amber-100 text-amber-700' : 'text-slate-800'
                        }`}>
                          {job.profit_margin_pct.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full ${
                          job.status === 'CLOSED'
                            ? 'bg-slate-200 text-slate-800'
                            : job.status === 'IN TRANSIT'
                            ? 'bg-indigo-100 text-indigo-700'
                            : job.status === 'BOOKED'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="p-3 pr-5 text-center whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectJob(job);
                          }}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded font-medium transition text-[11px] inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Open File</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            {/* Table Footer with Summary */}
            {filteredJobs.length > 0 && (
              <tfoot>
                <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-300">
                  <td colSpan={6} className="p-3 pl-5 text-right uppercase tracking-wider text-[11px] text-slate-600">
                    Register Total ({filteredJobs.length} Jobs):
                  </td>
                  <td className="p-3 text-right text-slate-800">
                    PKR {sumBuying.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-slate-900">
                    PKR {sumSelling.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-emerald-700 text-sm">
                    PKR +{sumProfit.toLocaleString()}
                  </td>
                  <td className="p-3 text-right text-slate-900">
                    {avgMargin.toFixed(1)}%
                  </td>
                  <td colSpan={2} className="p-3 pr-5"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

    </div>
  );
};
