import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Search, Filter } from 'lucide-react';

export const AuditView: React.FC = () => {
  const { jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all audit records across all jobs
  const allLogs = jobs.flatMap(job => 
    job.audit_logs.map(log => ({
      ...log,
      job_number: job.job_number
    }))
  ).sort((a, b) => b.timestamp.localeCompare(a.timestamp));

  const filteredLogs = allLogs.filter(l => 
    l.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs w-full max-w-full overflow-hidden">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Security & System Audit Log (Section 14)</h1>
        <p className="text-slate-500 text-xs mt-0.5">
          Tamper-evident audit trail capturing user, date/time, action and changed data for financial and operational governance.
        </p>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search audit trail by user, job #, action or change details..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3 pl-5">Timestamp</th>
              <th className="p-3">Job Number</th>
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Action Event</th>
              <th className="p-3 pr-5">Change Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredLogs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50">
                <td className="p-3 pl-5 whitespace-nowrap font-mono text-slate-500">{log.timestamp}</td>
                <td className="p-3 font-mono font-bold text-blue-600">{log.job_number}</td>
                <td className="p-3 font-medium text-slate-900">{log.user_name}</td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                    {log.user_role}
                  </span>
                </td>
                <td className="p-3 font-mono font-semibold text-blue-700">{log.action}</td>
                <td className="p-3 pr-5 text-slate-600">{log.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
