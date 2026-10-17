import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Job, 
  JobStatus, 
  BuyingCharge, 
  SellingCharge, 
  ContainerItem, 
  JobMilestone, 
  JobDocument 
} from '../../types';
import { exportSingleJobPDF } from '../../utils/exportUtils';
import { 
  ArrowLeft, 
  Save, 
  FileText, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Upload, 
  Layers, 
  DollarSign, 
  Check
} from 'lucide-react';

interface JobDetailViewProps {
  job: Job;
  onBack: () => void;
}

const WORKFLOW_STAGES: JobStatus[] = [
  'NEW',
  'BOOKED',
  'DOCUMENTATION',
  'IN TRANSIT',
  'ARRIVED',
  'DELIVERED',
  'INVOICED',
  'COST COMPLETED',
  'CLOSED'
];

const CHARGE_TYPES = [
  'Ocean Freight',
  'Air Freight',
  'THC / Terminal Charges',
  'Documentation Fee',
  'Customs Clearance & Examination',
  'Handling & Port Logistics',
  'Delivery Order (DO) Fee',
  'Inland Haulage / Trucking',
  'Storage & Demurrage',
  'Reefer Genset / Monitoring',
  'Insurance Charges',
  'Other Charges'
];

export const JobDetailView: React.FC<JobDetailViewProps> = ({ job, onBack }) => {
  const { 
    updateJob, 
    updateJobStatus, 
    customers, 
    shippers, 
    consignees, 
    vendors, 
    ports, 
    currentRole,
    checkDuplicateMBL,
    checkDuplicateHBL,
    calculateFinancials
  } = useApp();

  const [activeTab, setActiveTab] = useState<'shipment' | 'containers' | 'charges' | 'milestones' | 'documents' | 'audit'>('shipment');

  // Form State
  const [formData, setFormData] = useState<Job>({ ...job });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Document upload state
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<JobDocument['doc_type']>('MBL');

  // Check warnings
  const isDuplicateMBL = checkDuplicateMBL(formData.mbl_number, job.id);
  const isDuplicateHBL = checkDuplicateHBL(formData.hbl_number, job.id);
  const isLowMargin = formData.total_selling > 0 && formData.profit_margin_pct < 10;
  const isMissingCost = formData.total_selling > 0 && formData.total_buying === 0;

  // Real-time calculation updater
  const handleBuyingChargesChange = (updatedCharges: BuyingCharge[]) => {
    const fin = calculateFinancials(updatedCharges, formData.selling_charges);
    setFormData(prev => ({
      ...prev,
      buying_charges: updatedCharges,
      ...fin
    }));
  };

  const handleSellingChargesChange = (updatedCharges: SellingCharge[]) => {
    const fin = calculateFinancials(formData.buying_charges, updatedCharges);
    setFormData(prev => ({
      ...prev,
      selling_charges: updatedCharges,
      ...fin
    }));
  };

  // Add charge row
  const addBuyingChargeRow = () => {
    const defaultVendor = vendors[0] || { id: 'vnd-1', name: 'Vendor' };
    const newCharge: BuyingCharge = {
      id: `bc-${Date.now()}`,
      charge_type: 'Ocean Freight',
      vendor_id: defaultVendor.id,
      vendor_name: defaultVendor.name,
      quantity: 1,
      rate: 0,
      currency: 'PKR',
      exchange_rate: 1,
      amount: 0,
      remarks: ''
    };
    handleBuyingChargesChange([...formData.buying_charges, newCharge]);
  };

  const addSellingChargeRow = () => {
    const newCharge: SellingCharge = {
      id: `sc-${Date.now()}`,
      charge_type: 'Ocean Freight',
      customer_id: formData.customer_id,
      customer_name: formData.customer_name,
      quantity: 1,
      rate: 0,
      currency: 'PKR',
      exchange_rate: 1,
      amount: 0,
      remarks: ''
    };
    handleSellingChargesChange([...formData.selling_charges, newCharge]);
  };

  // Add container row
  const addContainerRow = () => {
    const newCnt: ContainerItem = {
      id: `cnt-${Date.now()}`,
      container_type: '40 HC',
      quantity: 1,
      container_number: '',
      cbm: 0,
      weight_kg: 0
    };
    setFormData(prev => ({
      ...prev,
      containers: [...prev.containers, newCnt]
    }));
  };

  // Status transition handler
  const handleStatusChange = (newStatus: JobStatus) => {
    if (formData.is_locked && currentRole !== 'Administrator') {
      alert('This job is CLOSED and profit locked. Only an Administrator can reopen it.');
      return;
    }

    if (newStatus === 'CLOSED' && !window.confirm('Marking this job as CLOSED will lock all buying costs, selling charges, and profit. Do you want to proceed?')) {
      return;
    }

    updateJobStatus(job.id, newStatus);
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      is_locked: newStatus === 'CLOSED'
    }));
  };

  const handleSave = () => {
    updateJob(job.id, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim()) return;

    const doc: JobDocument = {
      id: `doc-${Date.now()}`,
      name: newDocName.trim(),
      doc_type: newDocType,
      file_size: `${(Math.random() * 2 + 0.3).toFixed(1)} MB`,
      upload_date: new Date().toISOString().split('T')[0],
      uploaded_by: currentRole
    };

    const updatedDocs = [...formData.documents, doc];
    setFormData(prev => ({ ...prev, documents: updatedDocs }));
    updateJob(job.id, { documents: updatedDocs });
    setNewDocName('');
  };

  const isReadOnly = formData.is_locked && currentRole !== 'Administrator';

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto w-full max-w-full overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 w-full">
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 sm:p-2 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 transition text-slate-700 shrink-0"
            title="Back to Job Register"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{formData.job_number}</h1>
              <span className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-semibold bg-slate-100 text-slate-700">
                {formData.mode} • {formData.job_type}
              </span>
              {formData.is_locked && (
                <span className="flex items-center gap-1 text-[11px] sm:text-xs px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 font-medium">
                  <Lock className="w-3 h-3" />
                  <span>Locked</span>
                </span>
              )}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-none">
              Party: <span className="font-semibold text-slate-800">{formData.customer_name}</span> | Date: {formData.date}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => exportSingleJobPDF(formData)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold shadow-sm transition"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Print PDF</span>
          </button>

          {!isReadOnly && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Warnings & Alerts */}
      {(isDuplicateMBL || isDuplicateHBL || isLowMargin || isMissingCost || isReadOnly) && (
        <div className="space-y-2 w-full">
          {isDuplicateMBL && (
            <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Warning: Duplicate MBL Number &apos;{formData.mbl_number}&apos; detected in another job!</span>
            </div>
          )}
          {isDuplicateHBL && (
            <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 flex items-center gap-2 text-rose-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Warning: Duplicate HBL Number &apos;{formData.hbl_number}&apos; detected in another job!</span>
            </div>
          )}
          {isMissingCost && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center gap-2 text-amber-900 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Missing Cost Alert: Revenue is recorded but Buying Cost is PKR 0.</span>
            </div>
          )}
          {isLowMargin && (
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-3 flex items-center gap-2 text-amber-900 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Low Margin Warning: Current profit margin is below 10% ({formData.profit_margin_pct.toFixed(1)}%).</span>
            </div>
          )}
          {isReadOnly && (
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 flex items-center gap-2 text-slate-700 text-xs">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>This job is CLOSED. Financial charges and shipment fields are locked. Switch to Administrator role to make changes.</span>
            </div>
          )}
        </div>
      )}

      {/* Workflow Stepper (Section 8) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto w-full max-w-full">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Job Workflow Lifecycle
        </p>
        <div className="flex items-center justify-between min-w-[700px]">
          {WORKFLOW_STAGES.map((st, idx) => {
            const currentIdx = WORKFLOW_STAGES.indexOf(formData.status);
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <button
                key={st}
                onClick={() => handleStatusChange(st)}
                disabled={isReadOnly}
                className={`flex flex-col items-center flex-1 group transition ${
                  isReadOnly ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center w-full">
                  <div className={`h-1 flex-1 ${idx === 0 ? 'invisible' : isCompleted || isCurrent ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                      : isCompleted
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div className={`h-1 flex-1 ${idx === WORKFLOW_STAGES.length - 1 ? 'invisible' : isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                </div>
                <span className={`text-[10px] mt-1.5 font-bold truncate max-w-[85px] ${
                  isCurrent ? 'text-blue-600' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                }`}>
                  {st}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Profitability Banner (Section 3) */}
      <div className="bg-slate-900 text-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl shadow-md border border-slate-800 w-full max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6 w-full">
            <div className="bg-slate-800/50 hover:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-slate-700/50 hover:border-rose-500/50 transition-all duration-200 min-w-0 cursor-default">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate block">Total Buying</span>
              <p className="text-xs xs:text-sm sm:text-xl font-bold text-rose-400 mt-0.5 truncate block" title={`PKR ${formData.total_buying.toLocaleString()}`}>PKR {formData.total_buying.toLocaleString()}</p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Vendor costs</span>
            </div>
            <div className="bg-slate-800/50 hover:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-200 min-w-0 cursor-default">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate block">Total Selling</span>
              <p className="text-xs xs:text-sm sm:text-xl font-bold text-emerald-400 mt-0.5 truncate block" title={`PKR ${formData.total_selling.toLocaleString()}`}>PKR {formData.total_selling.toLocaleString()}</p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Customer revenue</span>
            </div>
            <div className="bg-slate-800/50 hover:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-slate-700/50 hover:border-sky-500/50 transition-all duration-200 min-w-0 cursor-default">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate block">Gross Profit</span>
              <p className={`text-xs xs:text-sm sm:text-xl font-bold mt-0.5 truncate block ${formData.gross_profit >= 0 ? 'text-sky-400' : 'text-rose-400'}`} title={`PKR ${formData.gross_profit.toLocaleString()}`}>
                PKR {formData.gross_profit.toLocaleString()}
              </p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Selling − Buying</span>
            </div>
            <div className="bg-slate-800/50 hover:bg-slate-800/80 p-2.5 sm:p-3 rounded-lg border border-slate-700/50 hover:border-violet-500/50 transition-all duration-200 min-w-0 cursor-default">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate block">Profit Margin</span>
              <p className="text-xs xs:text-sm sm:text-xl font-bold text-violet-300 mt-0.5 truncate block">{formData.profit_margin_pct.toFixed(2)}%</p>
              <span className="text-[9px] sm:text-[10px] text-slate-400 truncate block">Auto calculated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-1 sm:gap-2 overflow-x-auto text-xs font-semibold scrollbar-none w-full max-w-full">
        {[
          { id: 'shipment', label: '1. Shipment Info' },
          { id: 'containers', label: `2. Containers (${formData.containers.length})` },
          { id: 'charges', label: '3. Costing & Charges' },
          { id: 'milestones', label: `4. Milestones (${formData.milestones.length})` },
          { id: 'documents', label: `5. Documents (${formData.documents.length})` },
          { id: 'audit', label: `6. Audit Log (${formData.audit_logs.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as unknown as typeof activeTab)}
            className={`py-2.5 px-3 sm:py-3 sm:px-4 border-b-2 whitespace-nowrap transition cursor-pointer text-xs ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: SHIPMENT INFORMATION */}
      {activeTab === 'shipment' && (
        <div className="bg-white p-3.5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">Core Job & Parties (Section 2 & 9)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer / Party Name *</label>
                <select
                  disabled={isReadOnly}
                  value={formData.customer_id}
                  onChange={(e) => {
                    const cust = customers.find(c => c.id === e.target.value);
                    if (cust) {
                      setFormData(prev => ({ ...prev, customer_id: cust.id, customer_name: cust.name }));
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Shipper Name *</label>
                <select
                  disabled={isReadOnly}
                  value={formData.shipper_id}
                  onChange={(e) => {
                    const shp = shippers.find(s => s.id === e.target.value);
                    if (shp) {
                      setFormData(prev => ({ ...prev, shipper_id: shp.id, shipper_name: shp.name }));
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  {shippers.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Consignee Name *</label>
                <select
                  disabled={isReadOnly}
                  value={formData.consignee_id}
                  onChange={(e) => {
                    const cns = consignees.find(c => c.id === e.target.value);
                    if (cns) {
                      setFormData(prev => ({ ...prev, consignee_id: cns.id, consignee_name: cns.name }));
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  {consignees.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">Transport & Bill of Lading Details (Section 2)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">MBL Number *</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.mbl_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, mbl_number: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono disabled:bg-slate-100"
                  placeholder="e.g. MAEU9823412"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">HBL Number *</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.hbl_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, hbl_number: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono disabled:bg-slate-100"
                  placeholder="e.g. HBL-KHI-001"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Booking Number</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.booking_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, booking_number: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Vessel & Voyage</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={formData.vessel_name}
                    placeholder="Vessel"
                    onChange={(e) => setFormData(prev => ({ ...prev, vessel_name: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                  />
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={formData.voyage_number}
                    placeholder="Voyage"
                    onChange={(e) => setFormData(prev => ({ ...prev, voyage_number: e.target.value }))}
                    className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Port of Loading (POL) *</label>
                <select
                  disabled={isReadOnly}
                  value={formData.pol_id}
                  onChange={(e) => {
                    const p = ports.find(pt => pt.id === e.target.value);
                    if (p) {
                      setFormData(prev => ({ ...prev, pol_id: p.id, pol_name: p.name }));
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Port of Discharge (POD) *</label>
                <select
                  disabled={isReadOnly}
                  value={formData.pod_id}
                  onChange={(e) => {
                    const p = ports.find(pt => pt.id === e.target.value);
                    if (p) {
                      setFormData(prev => ({ ...prev, pod_id: p.id, pod_name: p.name }));
                    }
                  }}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white disabled:bg-slate-100"
                >
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ETD (Estimated Departure)</label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={formData.etd}
                  onChange={(e) => setFormData(prev => ({ ...prev, etd: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ETA (Estimated Arrival)</label>
                <input
                  type="date"
                  disabled={isReadOnly}
                  value={formData.eta}
                  onChange={(e) => setFormData(prev => ({ ...prev, eta: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2 mb-4">Cargo & Commodity Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Commodity / Cargo Description *</label>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={formData.commodity}
                  onChange={(e) => setFormData(prev => ({ ...prev, commodity: e.target.value }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                  placeholder="e.g. 100% Cotton Garments & Fabrics"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Gross Weight (KG)</label>
                <input
                  type="number"
                  disabled={isReadOnly}
                  value={formData.weight_kg}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight_kg: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Volume (CBM)</label>
                <input
                  type="number"
                  step="0.1"
                  disabled={isReadOnly}
                  value={formData.volume_cbm}
                  onChange={(e) => setFormData(prev => ({ ...prev, volume_cbm: parseFloat(e.target.value) || 0 }))}
                  className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 font-semibold mb-1">Operational Notes / Remarks</label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={formData.notes || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full p-2 border border-slate-300 rounded-lg disabled:bg-slate-100"
              placeholder="Internal operational notes or client instructions..."
            />
          </div>
        </div>
      )}

      {/* TAB 2: CONTAINER DETAILS GRID */}
      {activeTab === 'containers' && (
        <div className="bg-white p-3.5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Container Details Grid (Section 2, Field 10)</h2>
              <p className="text-slate-500 text-[11px]">Record container type (20&apos;, 40&apos;, 40 HC, CBM), equipment numbers and specifications.</p>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={addContainerRow}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Container</span>
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Type</th>
                  <th className="p-2.5">Quantity</th>
                  <th className="p-2.5">Container Number</th>
                  <th className="p-2.5">CBM</th>
                  <th className="p-2.5">Weight (KG)</th>
                  {!isReadOnly && <th className="p-2.5 text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {formData.containers.map((cnt, index) => (
                  <tr key={cnt.id} className="hover:bg-slate-50/50">
                    <td className="p-2">
                      <select
                        disabled={isReadOnly}
                        value={cnt.container_type}
                        onChange={(e) => {
                          const updated = [...formData.containers];
                          updated[index].container_type = e.target.value as ContainerItem['container_type'];
                          setFormData(prev => ({ ...prev, containers: updated }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                      >
                        <option value="20 FT">20 FT Standard</option>
                        <option value="40 FT">40 FT Standard</option>
                        <option value="40 HC">40 FT High Cube (HC)</option>
                        <option value="45 HC">45 FT High Cube (HC)</option>
                        <option value="LCL / CBM">LCL / Consolidated CBM</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        min="1"
                        disabled={isReadOnly}
                        value={cnt.quantity}
                        onChange={(e) => {
                          const updated = [...formData.containers];
                          updated[index].quantity = parseInt(e.target.value) || 1;
                          setFormData(prev => ({ ...prev, containers: updated }));
                        }}
                        className="w-24 p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={cnt.container_number}
                        placeholder="e.g. MSKU9182341"
                        onChange={(e) => {
                          const updated = [...formData.containers];
                          updated[index].container_number = e.target.value;
                          setFormData(prev => ({ ...prev, containers: updated }));
                        }}
                        className="w-full p-1.5 border border-slate-300 rounded font-mono disabled:bg-slate-100"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        step="0.1"
                        disabled={isReadOnly}
                        value={cnt.cbm}
                        onChange={(e) => {
                          const updated = [...formData.containers];
                          updated[index].cbm = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, containers: updated }));
                        }}
                        className="w-28 p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        disabled={isReadOnly}
                        value={cnt.weight_kg}
                        onChange={(e) => {
                          const updated = [...formData.containers];
                          updated[index].weight_kg = parseFloat(e.target.value) || 0;
                          setFormData(prev => ({ ...prev, containers: updated }));
                        }}
                        className="w-28 p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                      />
                    </td>
                    {!isReadOnly && (
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const updated = formData.containers.filter((_, i) => i !== index);
                            setFormData(prev => ({ ...prev, containers: updated }));
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: BUYING & SELLING COSTING (Section 7) */}
      {activeTab === 'charges' && (
        <div className="space-y-6 text-xs">
          
          {/* BUYING CHARGES (COSTS) */}
          <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-rose-800 flex items-center gap-1.5 flex-wrap">
                  <span>Buying Charges & Vendor Costs (Section 7)</span>
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-bold">
                    PKR {formData.total_buying.toLocaleString()}
                  </span>
                </h2>
                <p className="text-slate-500 text-[11px]">Ocean freight, terminal handling, documentation, customs fees paid to shipping lines and vendors.</p>
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={addBuyingChargeRow}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition cursor-pointer text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Cost</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left border-collapse">
                <thead>
                  <tr className="bg-rose-50/70 text-slate-700 font-bold border-b border-rose-100">
                    <th className="p-2.5">Charge Type</th>
                    <th className="p-2.5">Vendor / Payee</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-center">Currency</th>
                    <th className="p-2.5 text-center">Ex. Rate</th>
                    <th className="p-2.5 text-right">Amount (PKR)</th>
                    <th className="p-2.5">Remarks</th>
                    {!isReadOnly && <th className="p-2.5 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.buying_charges.map((charge, index) => (
                    <tr key={charge.id} className="hover:bg-slate-50/50">
                      <td className="p-2">
                        <select
                          disabled={isReadOnly}
                          value={charge.charge_type}
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            updated[index].charge_type = e.target.value;
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                        >
                          {CHARGE_TYPES.map(ct => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <select
                          disabled={isReadOnly}
                          value={charge.vendor_id}
                          onChange={(e) => {
                            const v = vendors.find(vnd => vnd.id === e.target.value);
                            const updated = [...formData.buying_charges];
                            updated[index].vendor_id = e.target.value;
                            updated[index].vendor_name = v?.name || '';
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                        >
                          {vendors.map(v => (
                            <option key={v.id} value={v.id}>{v.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          disabled={isReadOnly}
                          value={charge.quantity}
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            const qty = parseFloat(e.target.value) || 0;
                            updated[index].quantity = qty;
                            updated[index].amount = qty * updated[index].rate * updated[index].exchange_rate;
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-16 p-1.5 text-center border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          disabled={isReadOnly}
                          value={charge.rate}
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            const rate = parseFloat(e.target.value) || 0;
                            updated[index].rate = rate;
                            updated[index].amount = updated[index].quantity * rate * updated[index].exchange_rate;
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-24 p-1.5 text-right border border-slate-300 rounded disabled:bg-slate-100 font-mono"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <select
                          disabled={isReadOnly}
                          value={charge.currency}
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            updated[index].currency = e.target.value;
                            handleBuyingChargesChange(updated);
                          }}
                          className="p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                        >
                          <option value="PKR">PKR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="AED">AED</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.01"
                          disabled={isReadOnly}
                          value={charge.exchange_rate}
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            const ex = parseFloat(e.target.value) || 1;
                            updated[index].exchange_rate = ex;
                            updated[index].amount = updated[index].quantity * updated[index].rate * ex;
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-16 p-1.5 text-center border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-rose-700 font-mono">
                        {charge.amount.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={charge.remarks || ''}
                          placeholder="Optional notes..."
                          onChange={(e) => {
                            const updated = [...formData.buying_charges];
                            updated[index].remarks = e.target.value;
                            handleBuyingChargesChange(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      {!isReadOnly && (
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.buying_charges.filter((_, i) => i !== index);
                              handleBuyingChargesChange(updated);
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* SELLING CHARGES (REVENUE) */}
          <div className="bg-white p-3.5 sm:p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5 flex-wrap">
                  <span>Selling Charges & Customer Revenue (Section 7)</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                    PKR {formData.total_selling.toLocaleString()}
                  </span>
                </h2>
                <p className="text-slate-500 text-[11px]">Freight, local charges and fees billed to the client/customer.</p>
              </div>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={addSellingChargeRow}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition cursor-pointer text-xs shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Revenue</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/70 text-slate-700 font-bold border-b border-emerald-100">
                    <th className="p-2.5">Charge Type</th>
                    <th className="p-2.5">Customer / Debtor</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-center">Currency</th>
                    <th className="p-2.5 text-center">Ex. Rate</th>
                    <th className="p-2.5 text-right">Amount (PKR)</th>
                    <th className="p-2.5">Remarks</th>
                    {!isReadOnly && <th className="p-2.5 text-center">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {formData.selling_charges.map((charge, index) => (
                    <tr key={charge.id} className="hover:bg-slate-50/50">
                      <td className="p-2">
                        <select
                          disabled={isReadOnly}
                          value={charge.charge_type}
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            updated[index].charge_type = e.target.value;
                            handleSellingChargesChange(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                        >
                          {CHARGE_TYPES.map(ct => (
                            <option key={ct} value={ct}>{ct}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled
                          value={charge.customer_name}
                          className="w-full p-1.5 border border-slate-300 rounded bg-slate-100 text-slate-700"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          min="1"
                          disabled={isReadOnly}
                          value={charge.quantity}
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            const qty = parseFloat(e.target.value) || 0;
                            updated[index].quantity = qty;
                            updated[index].amount = qty * updated[index].rate * updated[index].exchange_rate;
                            handleSellingChargesChange(updated);
                          }}
                          className="w-16 p-1.5 text-center border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          disabled={isReadOnly}
                          value={charge.rate}
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            const rate = parseFloat(e.target.value) || 0;
                            updated[index].rate = rate;
                            updated[index].amount = updated[index].quantity * rate * updated[index].exchange_rate;
                            handleSellingChargesChange(updated);
                          }}
                          className="w-24 p-1.5 text-right border border-slate-300 rounded disabled:bg-slate-100 font-mono"
                        />
                      </td>
                      <td className="p-2 text-center">
                        <select
                          disabled={isReadOnly}
                          value={charge.currency}
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            updated[index].currency = e.target.value;
                            handleSellingChargesChange(updated);
                          }}
                          className="p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-100"
                        >
                          <option value="PKR">PKR</option>
                          <option value="USD">USD</option>
                          <option value="EUR">EUR</option>
                          <option value="AED">AED</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <input
                          type="number"
                          step="0.01"
                          disabled={isReadOnly}
                          value={charge.exchange_rate}
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            const ex = parseFloat(e.target.value) || 1;
                            updated[index].exchange_rate = ex;
                            updated[index].amount = updated[index].quantity * updated[index].rate * ex;
                            handleSellingChargesChange(updated);
                          }}
                          className="w-16 p-1.5 text-center border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      <td className="p-2 text-right font-bold text-emerald-700 font-mono">
                        {charge.amount.toLocaleString()}
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={charge.remarks || ''}
                          placeholder="Optional notes..."
                          onChange={(e) => {
                            const updated = [...formData.selling_charges];
                            updated[index].remarks = e.target.value;
                            handleSellingChargesChange(updated);
                          }}
                          className="w-full p-1.5 border border-slate-300 rounded disabled:bg-slate-100"
                        />
                      </td>
                      {!isReadOnly && (
                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.selling_charges.filter((_, i) => i !== index);
                              handleSellingChargesChange(updated);
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: MILESTONES (Section 16) */}
      {activeTab === 'milestones' && (
        <div className="bg-white p-3.5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs w-full max-w-full overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Shipment Operational Milestones</h2>
              <p className="text-slate-500 text-[11px]">Track progress: booking, stuffing, customs, vessel departure, transshipment, arrival and cargo release.</p>
            </div>
            {!isReadOnly && (
              <button
                type="button"
                onClick={() => {
                  const newM: JobMilestone = {
                    id: `m-${Date.now()}`,
                    milestone_name: 'Custom Milestone',
                    planned_date: new Date().toISOString().split('T')[0],
                    status: 'Pending'
                  };
                  setFormData(prev => ({ ...prev, milestones: [...prev.milestones, newM] }));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition cursor-pointer self-start sm:self-auto shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Milestone</span>
              </button>
            )}
          </div>

          <div className="divide-y divide-slate-100">
            {formData.milestones.map((m, idx) => (
              <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    m.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={m.milestone_name}
                      onChange={(e) => {
                        const updated = [...formData.milestones];
                        updated[idx].milestone_name = e.target.value;
                        setFormData(prev => ({ ...prev, milestones: updated }));
                      }}
                      className="font-semibold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-none w-full max-w-xs"
                    />
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                      Planned: {m.planned_date} {m.actual_date ? `| Actual: ${m.actual_date}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <select
                    disabled={isReadOnly}
                    value={m.status}
                    onChange={(e) => {
                      const updated = [...formData.milestones];
                      const newSt = e.target.value as JobMilestone['status'];
                      updated[idx].status = newSt;
                      if (newSt === 'Completed' && !updated[idx].actual_date) {
                        updated[idx].actual_date = new Date().toISOString().split('T')[0];
                      }
                      setFormData(prev => ({ ...prev, milestones: updated }));
                    }}
                    className={`px-2.5 py-1 rounded text-xs font-semibold ${
                      m.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : m.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-300'
                        : 'bg-slate-100 text-slate-700 border border-slate-300'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>

                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = formData.milestones.filter((_, i) => i !== idx);
                        setFormData(prev => ({ ...prev, milestones: updated }));
                      }}
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DOCUMENTS (Section 13) */}
      {activeTab === 'documents' && (
        <div className="bg-white p-3.5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-6 text-xs w-full max-w-full overflow-hidden">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Attached Job Documents (Section 13)</h2>
            <p className="text-slate-500 text-[11px]">Upload and store MBL, HBL, Commercial Invoices, Packing Lists, Quotations and Custom clearance papers.</p>
          </div>

          {!isReadOnly && (
            <form onSubmit={handleAddDocument} className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
              <div className="flex-1 w-full min-w-0">
                <label className="block text-slate-600 font-semibold mb-1">Document Name / File Title</label>
                <input
                  type="text"
                  placeholder="e.g. Master_BL_Signed.pdf"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                />
              </div>

              <div className="w-full sm:w-56">
                <label className="block text-slate-600 font-semibold mb-1">Document Category</label>
                <select
                  value={newDocType}
                  onChange={(e) => setNewDocType(e.target.value as JobDocument['doc_type'])}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="MBL">Master Bill of Lading (MBL)</option>
                  <option value="HBL">House Bill of Lading (HBL)</option>
                  <option value="Commercial Invoice">Commercial Invoice</option>
                  <option value="Packing List">Packing List</option>
                  <option value="Quotation">Quotation</option>
                  <option value="Vendor Invoice">Vendor Invoice</option>
                  <option value="Customer Invoice">Customer Invoice</option>
                  <option value="Other">Other Operational Doc</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shrink-0"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {formData.documents.map(doc => (
              <div key={doc.id} className="p-3.5 border border-slate-200 rounded-xl hover:shadow-sm transition bg-white flex items-start justify-between min-w-0">
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg mt-0.5 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 truncate" title={doc.name}>{doc.name}</h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {doc.doc_type}
                      </span>
                      <span className="text-[10px] text-slate-400">{doc.file_size}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">
                      Uploaded {doc.upload_date} by {doc.uploaded_by}
                    </p>
                  </div>
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => {
                      const updated = formData.documents.filter(d => d.id !== doc.id);
                      setFormData(prev => ({ ...prev, documents: updated }));
                    }}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded shrink-0 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL (Section 14) */}
      {activeTab === 'audit' && (
        <div className="bg-white p-3.5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-xs w-full max-w-full overflow-hidden">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Immutable Audit Trail & Activity Log (Section 14)</span>
            </h2>
            <p className="text-slate-500 text-[11px]">Chronological record of all updates, status changes, and costing adjustments made to this job file.</p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-x-auto w-full max-w-full">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-2.5">Timestamp</th>
                  <th className="p-2.5">User</th>
                  <th className="p-2.5">Role</th>
                  <th className="p-2.5">Action</th>
                  <th className="p-2.5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {formData.audit_logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-2.5 whitespace-nowrap font-mono text-slate-500 text-[11px]">{log.timestamp}</td>
                    <td className="p-2.5 font-medium text-slate-900 whitespace-nowrap">{log.user_name}</td>
                    <td className="p-2.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-semibold">
                        {log.user_role}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono font-semibold text-blue-600 whitespace-nowrap">{log.action}</td>
                    <td className="p-2.5 text-slate-600 min-w-[200px]">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
