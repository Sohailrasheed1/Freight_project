import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Search, Download, ExternalLink } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { jobs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Collect all documents across all jobs
  const allDocs = jobs.flatMap(job => 
    job.documents.map(doc => ({
      ...doc,
      job_number: job.job_number,
      customer_name: job.customer_name,
      job_id: job.id
    }))
  );

  const filteredDocs = allDocs.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.job_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.doc_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Central Document Repository (Section 13)</h1>
        <p className="text-slate-500 text-xs mt-0.5">Secure job-linked digital storage for Bills of Lading, Commercial Invoices, Packing Lists and Quotations.</p>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by file name, job #, party or document type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <th className="p-3 pl-5">Document Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Linked Job</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Size</th>
              <th className="p-3">Upload Date</th>
              <th className="p-3 pr-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-10 text-slate-400">
                  No documents found. Attach documents inside individual Job Files.
                </td>
              </tr>
            ) : (
              filteredDocs.map((doc, idx) => (
                <tr key={`${doc.id}-${idx}`} className="hover:bg-slate-50">
                  <td className="p-3 pl-5 font-semibold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{doc.name}</span>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                      {doc.doc_type}
                    </span>
                  </td>
                  <td className="p-3 font-mono font-bold text-blue-600">{doc.job_number}</td>
                  <td className="p-3 text-slate-600">{doc.customer_name}</td>
                  <td className="p-3 text-slate-500">{doc.file_size}</td>
                  <td className="p-3 text-slate-500">{doc.upload_date}</td>
                  <td className="p-3 pr-5 text-center">
                    <button
                      onClick={() => alert(`Simulating download for ${doc.name}`)}
                      className="px-2 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 rounded transition font-medium text-[11px] inline-flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
};
