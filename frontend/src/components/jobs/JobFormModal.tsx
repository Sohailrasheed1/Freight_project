import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Job, TransportMode, JobType, ContainerItem, BuyingCharge, SellingCharge } from '../../types';
import { X, Plus, AlertTriangle, Layers, DollarSign } from 'lucide-react';

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: (createdJob: Job) => void;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({ isOpen, onClose, onJobCreated }) => {
  const { 
    customers, 
    shippers, 
    consignees, 
    vendors, 
    ports, 
    addJob, 
    checkDuplicateMBL, 
    checkDuplicateHBL,
    calculateFinancials 
  } = useApp();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<TransportMode>('Sea');
  const [jobType, setJobType] = useState<JobType>('Export');
  
  const [customerId, setCustomerId] = useState(customers[0]?.id || '');
  const [shipperId, setShipperId] = useState(shippers[0]?.id || '');
  const [consigneeId, setConsigneeId] = useState(consignees[0]?.id || '');

  const [mblNumber, setMblNumber] = useState('');
  const [hblNumber, setHblNumber] = useState('');
  const [bookingNumber, setBookingNumber] = useState('');
  const [vesselName, setVesselName] = useState('');
  const [voyageNumber, setVoyageNumber] = useState('');

  const [polId, setPolId] = useState(ports[0]?.id || '');
  const [podId, setPodId] = useState(ports[1]?.id || '');
  const [etd, setEtd] = useState('');
  const [eta, setEta] = useState('');

  const [commodity, setCommodity] = useState('');
  const [packagesCount, setPackagesCount] = useState<number>(100);
  const [weightKg, setWeightKg] = useState<number>(5000);
  const [volumeCbm, setVolumeCbm] = useState<number>(20);

  // Containers
  const [containers, setContainers] = useState<ContainerItem[]>([
    { id: 'cnt-init', container_type: '20 FT', quantity: 1, container_number: '', cbm: 20, weight_kg: 5000 }
  ]);

  // Initial Buying & Selling charges for quick start (Test case friendly)
  const [buyingCharges, setBuyingCharges] = useState<BuyingCharge[]>([
    {
      id: 'bc-init-1',
      charge_type: 'Ocean Freight',
      vendor_id: vendors[0]?.id || 'vnd-1',
      vendor_name: vendors[0]?.name || 'Shipping Line',
      quantity: 1,
      rate: 100000,
      currency: 'PKR',
      exchange_rate: 1,
      amount: 100000
    }
  ]);

  const [sellingCharges, setSellingCharges] = useState<SellingCharge[]>([
    {
      id: 'sc-init-1',
      charge_type: 'Ocean Freight',
      customer_id: customers[0]?.id || 'cust-1',
      customer_name: customers[0]?.name || 'Customer',
      quantity: 1,
      rate: 125000,
      currency: 'PKR',
      exchange_rate: 1,
      amount: 125000
    }
  ]);

  if (!isOpen) return null;

  // Real-time financial calculations
  const financials = calculateFinancials(buyingCharges, sellingCharges);

  // Validations
  const isDuplicateMBL = checkDuplicateMBL(mblNumber);
  const isDuplicateHBL = checkDuplicateHBL(hblNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCust = customers.find(c => c.id === customerId);
    const selectedShp = shippers.find(s => s.id === shipperId);
    const selectedCns = consignees.find(c => c.id === consigneeId);
    const selectedPol = ports.find(p => p.id === polId);
    const selectedPod = ports.find(p => p.id === podId);

    if (!selectedCust || !selectedShp || !selectedPol || !selectedPod) {
      alert('Please select Customer, Shipper, POL and POD.');
      return;
    }

    if (!commodity.trim()) {
      alert('Please enter commodity description.');
      return;
    }

    const created = await addJob({
      date,
      mode,
      job_type: jobType,
      customer_id: selectedCust.id,
      customer_name: selectedCust.name,
      shipper_id: selectedShp.id,
      shipper_name: selectedShp.name,
      consignee_id: selectedCns?.id || '',
      consignee_name: selectedCns?.name || '',
      status: 'NEW',
      mbl_number: mblNumber.trim(),
      hbl_number: hblNumber.trim(),
      booking_number: bookingNumber.trim(),
      vessel_name: vesselName.trim(),
      voyage_number: voyageNumber.trim(),
      pol_id: selectedPol.id,
      pol_name: selectedPol.name,
      pod_id: selectedPod.id,
      pod_name: selectedPod.name,
      etd,
      eta,
      commodity: commodity.trim(),
      packages_count: packagesCount,
      weight_kg: weightKg,
      volume_cbm: volumeCbm,
      containers,
      buying_charges: buyingCharges,
      selling_charges: sellingCharges,
      milestones: [
        { id: `m-${Date.now()}-1`, milestone_name: 'Job Created', planned_date: date, actual_date: date, status: 'Completed' },
        { id: `m-${Date.now()}-2`, milestone_name: 'Booking Confirmation', planned_date: date, status: 'Pending' },
        { id: `m-${Date.now()}-3`, milestone_name: 'Vessel Departure', planned_date: etd || date, status: 'Pending' },
        { id: `m-${Date.now()}-4`, milestone_name: 'Port Arrival', planned_date: eta || date, status: 'Pending' }
      ],
      documents: []
    });

    onJobCreated(created);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-xs">
        
        {/* Modal Header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold">Create New Job File (Section 6.2)</h2>
            <p className="text-slate-400 text-xs mt-0.5">Enter mandatory shipment details, containers and initial rate costing.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          
          {/* Duplicate Warnings */}
          {(isDuplicateMBL || isDuplicateHBL) && (
            <div className="bg-rose-50 border border-rose-300 rounded-lg p-3 text-rose-800 space-y-1">
              {isDuplicateMBL && <p>⚠️ Warning: MBL Number &apos;{mblNumber}&apos; already exists in another job!</p>}
              {isDuplicateHBL && <p>⚠️ Warning: HBL Number &apos;{hblNumber}&apos; already exists in another job!</p>}
            </div>
          )}

          {/* Section: Job Basics */}
          <div>
            <h3 className="font-bold text-slate-900 border-b pb-1.5 mb-3 text-sm">1. Basic Information</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Mode *</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as TransportMode)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Sea">Sea Freight</option>
                  <option value="Air">Air Freight</option>
                  <option value="Road">Road Freight</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Job Type *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as JobType)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Export">Export</option>
                  <option value="Import">Import</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Booking Number</label>
                <input
                  type="text"
                  placeholder="e.g. BKG-9921"
                  value={bookingNumber}
                  onChange={(e) => setBookingNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section: Parties */}
          <div>
            <h3 className="font-bold text-slate-900 border-b pb-1.5 mb-3 text-sm">2. Master Parties (Section 9)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Customer / Party Name *</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Shipper Name *</label>
                <select
                  required
                  value={shipperId}
                  onChange={(e) => setShipperId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {shippers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Consignee Name *</label>
                <select
                  required
                  value={consigneeId}
                  onChange={(e) => setConsigneeId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {consignees.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section: Transport Details */}
          <div>
            <h3 className="font-bold text-slate-900 border-b pb-1.5 mb-3 text-sm">3. Transport & Routing</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">MBL Number</label>
                <input
                  type="text"
                  placeholder="Master B/L"
                  value={mblNumber}
                  onChange={(e) => setMblNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">HBL Number</label>
                <input
                  type="text"
                  placeholder="House B/L"
                  value={hblNumber}
                  onChange={(e) => setHblNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Vessel</label>
                <input
                  type="text"
                  placeholder="Vessel Name"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Voyage</label>
                <input
                  type="text"
                  placeholder="Voyage No"
                  value={voyageNumber}
                  onChange={(e) => setVoyageNumber(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Port of Loading (POL) *</label>
                <select
                  required
                  value={polId}
                  onChange={(e) => setPolId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Port of Discharge (POD) *</label>
                <select
                  required
                  value={podId}
                  onChange={(e) => setPodId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {ports.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ETD</label>
                <input
                  type="date"
                  value={etd}
                  onChange={(e) => setEtd(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">ETA</label>
                <input
                  type="date"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Section: Cargo & Commodity */}
          <div>
            <h3 className="font-bold text-slate-900 border-b pb-1.5 mb-3 text-sm">4. Cargo Specification</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-600 font-semibold mb-1">Commodity / Cargo Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Export Cotton Textiles / Garments"
                  value={commodity}
                  onChange={(e) => setCommodity(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Weight (KG)</label>
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Volume (CBM)</label>
                <input
                  type="number"
                  step="0.1"
                  value={volumeCbm}
                  onChange={(e) => setVolumeCbm(parseFloat(e.target.value) || 0)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Real-time Profit Preview */}
          <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Automatic Initial Profitability:</span>
              <p className="text-xs text-slate-300 mt-0.5">
                Buying: <span className="text-rose-400 font-bold">PKR {financials.total_buying.toLocaleString()}</span> | 
                Selling: <span className="text-emerald-400 font-bold ml-1">PKR {financials.total_selling.toLocaleString()}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">Calculated Profit</span>
              <p className="text-lg font-bold text-blue-400">PKR {financials.gross_profit.toLocaleString()} ({financials.profit_margin_pct.toFixed(1)}%)</p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition cursor-pointer"
            >
              Create Job File
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
