import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { exportJobsToExcel, exportJobsToPDF } from '../../utils/exportUtils';
import { BarChart3, FileSpreadsheet, FileText, ArrowUpRight, TrendingUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const ReportsView: React.FC = () => {
  const { jobs, customers } = useApp();
  const [selectedReport, setSelectedReport] = useState<'job_profit' | 'customer_profit' | 'monthly' | 'route_profit'>('job_profit');

  // Customer-wise Profit aggregation
  const customerStats = customers.map(cust => {
    const custJobs = jobs.filter(j => j.customer_id === cust.id);
    const totalBuying = custJobs.reduce((sum, j) => sum + j.total_buying, 0);
    const totalSelling = custJobs.reduce((sum, j) => sum + j.total_selling, 0);
    const profit = totalSelling - totalBuying;
    const margin = totalSelling > 0 ? (profit / totalSelling) * 100 : 0;

    return {
      name: cust.name,
      code: cust.code,
      jobCount: custJobs.length,
      totalBuying,
      totalSelling,
      profit,
      margin
    };
  }).filter(c => c.jobCount > 0);

  // Route-wise (POL/POD) Profit aggregation
  const routeMap: Record<string, { route: string; jobCount: number; buying: number; selling: number; profit: number }> = {};
  jobs.forEach(j => {
    const route = `${j.pol_name.split('/')[0]} → ${j.pod_name.split('/')[0]}`;
    if (!routeMap[route]) {
      routeMap[route] = { route, jobCount: 0, buying: 0, selling: 0, profit: 0 };
    }
    routeMap[route].jobCount += 1;
    routeMap[route].buying += j.total_buying;
    routeMap[route].selling += j.total_selling;
    routeMap[route].profit += j.gross_profit;
  });
  const routeStats = Object.values(routeMap);

  // Export Customer Profit to Excel
  const exportCustomerProfitExcel = () => {
    const data = customerStats.map(c => ({
      'Customer Code': c.code,
      'Customer Name': c.name,
      'Jobs': c.jobCount,
      'Total Buying (PKR)': c.totalBuying,
      'Total Selling (PKR)': c.totalSelling,
      'Gross Profit (PKR)': c.profit,
      'Margin %': `${c.margin.toFixed(2)}%`
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Customer_Profit');
    XLSX.writeFile(workbook, 'Customer_Profitability_Report.xlsx');
  };

  const exportCustomerProfitPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Customer-wise Profitability Report', 14, 18);
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 25);

    const body = customerStats.map(c => [
      c.code,
      c.name,
      c.jobCount,
      c.totalBuying.toLocaleString(),
      c.totalSelling.toLocaleString(),
      c.profit.toLocaleString(),
      `${c.margin.toFixed(1)}%`
    ]);

    autoTable(doc, {
      startY: 30,
      head: [['Code', 'Customer', 'Jobs', 'Buying (PKR)', 'Selling (PKR)', 'Profit (PKR)', 'Margin']],
      body,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42] }
    });

    doc.save('Customer_Profitability_Report.pdf');
  };

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl mx-auto text-xs w-full max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Financial & Operational Reports (Section 11)</h1>
          <p className="text-slate-500 text-xs mt-0.5">Comprehensive job costing, customer revenue, profit margins and route performance.</p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {selectedReport === 'job_profit' ? (
            <>
              <button
                onClick={() => exportJobsToExcel(jobs, 'Job_Profitability_Report.xlsx')}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-sm transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={() => exportJobsToPDF(jobs, 'Job_Profitability_Report')}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={exportCustomerProfitExcel}
                className="flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold shadow-sm transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Export Excel</span>
              </button>
              <button
                onClick={exportCustomerProfitPDF}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-semibold shadow-sm transition"
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="flex gap-2 border-b pb-3 overflow-x-auto font-semibold">
        <button
          onClick={() => setSelectedReport('job_profit')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedReport === 'job_profit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          1. Job-wise Profitability Register
        </button>
        <button
          onClick={() => setSelectedReport('customer_profit')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedReport === 'customer_profit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          2. Customer-wise Profit Summary
        </button>
        <button
          onClick={() => setSelectedReport('route_profit')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedReport === 'route_profit'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white border text-slate-700 hover:bg-slate-50'
          }`}
        >
          3. POL / POD Route Profitability
        </button>
      </div>

      {/* REPORT 1: JOB-WISE PROFITABILITY */}
      {selectedReport === 'job_profit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-800">Job Costing & Profit Ledger (Real-time Calculated)</span>
            <span className="text-slate-500 font-mono text-[11px]">{jobs.length} jobs analyzed</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3 pl-5">Job Number</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Route</th>
                  <th className="p-3 text-right">Buying Cost</th>
                  <th className="p-3 text-right">Selling Revenue</th>
                  <th className="p-3 text-right">Gross Profit</th>
                  <th className="p-3 text-right">Margin %</th>
                  <th className="p-3 pr-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {jobs.map(j => (
                  <tr key={j.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-bold text-blue-600">{j.job_number}</td>
                    <td className="p-3 font-semibold text-slate-900">{j.customer_name}</td>
                    <td className="p-3 text-slate-600">{j.pol_name.split('/')[0]} → {j.pod_name.split('/')[0]}</td>
                    <td className="p-3 text-right font-medium text-slate-600">PKR {j.total_buying.toLocaleString()}</td>
                    <td className="p-3 text-right font-semibold text-slate-900">PKR {j.total_selling.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">PKR +{j.gross_profit.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-slate-800">{j.profit_margin_pct.toFixed(1)}%</td>
                    <td className="p-3 pr-5 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {j.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: CUSTOMER-WISE PROFIT */}
      {selectedReport === 'customer_profit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-800">Customer Account Profitability Breakdown</span>
            <span className="text-slate-500 font-mono text-[11px]">{customerStats.length} active parties</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3 pl-5">Code</th>
                  <th className="p-3">Customer Name</th>
                  <th className="p-3 text-center">Total Shipments</th>
                  <th className="p-3 text-right">Total Buying (PKR)</th>
                  <th className="p-3 text-right">Total Selling (PKR)</th>
                  <th className="p-3 text-right">Gross Profit (PKR)</th>
                  <th className="p-3 pr-5 text-right">Profit Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customerStats.map(c => (
                  <tr key={c.code} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{c.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="p-3 text-center font-bold">{c.jobCount}</td>
                    <td className="p-3 text-right text-slate-600">{c.totalBuying.toLocaleString()}</td>
                    <td className="p-3 text-right font-medium text-slate-900">{c.totalSelling.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-600">+{c.profit.toLocaleString()}</td>
                    <td className="p-3 pr-5 text-right font-bold">{c.margin.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: ROUTE PROFITABILITY */}
      {selectedReport === 'route_profit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-800">Trade Lane & Route (POL → POD) Performance</span>
            <span className="text-slate-500 font-mono text-[11px]">{routeStats.length} trade lanes</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
                  <th className="p-3 pl-5">Trade Lane / Route</th>
                  <th className="p-3 text-center">Volume (Jobs)</th>
                  <th className="p-3 text-right">Total Buying (PKR)</th>
                  <th className="p-3 text-right">Total Selling (PKR)</th>
                  <th className="p-3 text-right">Gross Profit (PKR)</th>
                  <th className="p-3 pr-5 text-right">Margin %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {routeStats.map(r => {
                  const margin = r.selling > 0 ? (r.profit / r.selling) * 100 : 0;
                  return (
                    <tr key={r.route} className="hover:bg-slate-50">
                      <td className="p-3 pl-5 font-bold text-slate-900">{r.route}</td>
                      <td className="p-3 text-center font-semibold">{r.jobCount}</td>
                      <td className="p-3 text-right text-slate-600">{r.buying.toLocaleString()}</td>
                      <td className="p-3 text-right font-medium text-slate-900">{r.selling.toLocaleString()}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">+{r.profit.toLocaleString()}</td>
                      <td className="p-3 pr-5 text-right font-bold">{margin.toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
