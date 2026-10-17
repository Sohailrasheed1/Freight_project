import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, Search, Building2, Users, Truck, Store, Anchor, CheckCircle, XCircle } from 'lucide-react';
import { Customer, Shipper, Consignee, Vendor, Port } from '../../types';

interface MasterDataViewProps {
  type: 'customers' | 'shippers' | 'consignees' | 'vendors' | 'ports';
}

export const MasterDataView: React.FC<MasterDataViewProps> = ({ type }) => {
  const { 
    customers, 
    shippers, 
    consignees, 
    vendors, 
    ports, 
    addCustomer, 
    addShipper, 
    addConsignee, 
    addVendor, 
    addPort,
    currentRole 
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Modal form states
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [ntnStrn, setNtnStrn] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('30 Days Net');
  const [currency, setCurrency] = useState('PKR');
  const [creditLimit, setCreditLimit] = useState<number>(1000000);
  const [serviceType, setServiceType] = useState('Shipping Line');
  const [portCode, setPortCode] = useState('');
  const [portCountry, setPortCountry] = useState('Pakistan');
  const [portType, setPortType] = useState<'SEA' | 'AIR'>('SEA');

  const getTitle = () => {
    switch (type) {
      case 'customers': return 'Customer Master (Section 9)';
      case 'shippers': return 'Shipper Master';
      case 'consignees': return 'Consignee Master';
      case 'vendors': return 'Vendor & Shipping Line Master';
      case 'ports': return 'Ports & Airports Master';
    }
  };

  const getSubtitle = () => {
    switch (type) {
      case 'customers': return 'Manage client accounts, tax NTN/STRN, commercial credit limits and payment terms.';
      case 'shippers': return 'Origin exporters and shippers linked directly to jobs.';
      case 'consignees': return 'Destination receivers and consignees for cargo delivery.';
      case 'vendors': return 'Shipping lines, port terminals, customs agents and transport contractors.';
      case 'ports': return 'Port of Loading (POL) and Port of Discharge (POD) routing master.';
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (type === 'customers') {
      addCustomer({
        name: name.trim(),
        ntn_strn: ntnStrn.trim(),
        address: address.trim(),
        city: city.trim(),
        contact_person: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        payment_terms: paymentTerms,
        currency,
        credit_limit: creditLimit,
        is_active: true
      });
    } else if (type === 'shippers') {
      addShipper({
        name: name.trim(),
        contact_person: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim()
      });
    } else if (type === 'consignees') {
      addConsignee({
        name: name.trim(),
        contact_person: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim()
      });
    } else if (type === 'vendors') {
      addVendor({
        name: name.trim(),
        service_type: serviceType,
        contact_person: contactPerson.trim(),
        phone: phone.trim(),
        email: email.trim()
      });
    } else if (type === 'ports') {
      addPort({
        name: name.trim(),
        code: portCode.trim().toUpperCase(),
        country: portCountry.trim(),
        type: portType
      });
    }

    // Reset & close
    setName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setNtnStrn('');
    setPortCode('');
    setShowAddModal(false);
  };

  const isAllowedToEdit = currentRole === 'Administrator' || currentRole === 'Sales' || currentRole === 'Operations';

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-5 max-w-7xl mx-auto text-xs w-full max-w-full overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">{getTitle()}</h1>
          <p className="text-slate-500 text-xs mt-0.5">{getSubtitle()}</p>
        </div>

        {isAllowedToEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Record</span>
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder={`Search ${type}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs focus:outline-none"
        />
      </div>

      {/* Tables based on Type */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
        
        {/* CUSTOMERS TABLE */}
        {type === 'customers' && (
          <table className="w-full min-w-[750px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 pl-5">Code</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">NTN / STRN</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Phone & Email</th>
                <th className="p-3">Payment Terms</th>
                <th className="p-3 text-right">Credit Limit</th>
                <th className="p-3 pr-5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {customers
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{c.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{c.ntn_strn || '-'}</td>
                    <td className="p-3">{c.contact_person}</td>
                    <td className="p-3 text-slate-500">
                      <div>{c.phone}</div>
                      <div className="text-[10px] text-slate-400">{c.email}</div>
                    </td>
                    <td className="p-3">{c.payment_terms}</td>
                    <td className="p-3 text-right font-medium text-slate-900">{c.currency} {c.credit_limit.toLocaleString()}</td>
                    <td className="p-3 pr-5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.is_active ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        <span>{c.is_active ? 'Active' : 'Inactive'}</span>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* SHIPPERS TABLE */}
        {type === 'shippers' && (
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 pl-5">Code</th>
                <th className="p-3">Shipper Name</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3 pr-5">City / Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {shippers
                .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{s.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{s.name}</td>
                    <td className="p-3">{s.contact_person}</td>
                    <td className="p-3">{s.phone}</td>
                    <td className="p-3 text-slate-500">{s.email}</td>
                    <td className="p-3 pr-5">{s.city}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* CONSIGNEES TABLE */}
        {type === 'consignees' && (
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 pl-5">Code</th>
                <th className="p-3">Consignee Name</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Email</th>
                <th className="p-3 pr-5">City</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {consignees
                .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(c => (
                  <tr key={c.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{c.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{c.name}</td>
                    <td className="p-3">{c.contact_person}</td>
                    <td className="p-3">{c.phone}</td>
                    <td className="p-3 text-slate-500">{c.email}</td>
                    <td className="p-3 pr-5">{c.city}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* VENDORS TABLE */}
        {type === 'vendors' && (
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 pl-5">Code</th>
                <th className="p-3">Vendor / Supplier Name</th>
                <th className="p-3">Service Type</th>
                <th className="p-3">Contact Person</th>
                <th className="p-3">Phone</th>
                <th className="p-3 pr-5">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {vendors
                .filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(v => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{v.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{v.name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 font-medium">
                        {v.service_type}
                      </span>
                    </td>
                    <td className="p-3">{v.contact_person}</td>
                    <td className="p-3">{v.phone}</td>
                    <td className="p-3 pr-5 text-slate-500">{v.email}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* PORTS TABLE */}
        {type === 'ports' && (
          <table className="w-full min-w-[600px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 pl-5">Code</th>
                <th className="p-3">Port / Terminal Name</th>
                <th className="p-3">Country</th>
                <th className="p-3 pr-5 text-center">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {ports
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.code.toLowerCase().includes(searchTerm.toLowerCase()))
                .map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-5 font-mono font-bold text-blue-600">{p.code}</td>
                    <td className="p-3 font-semibold text-slate-900">{p.name}</td>
                    <td className="p-3 text-slate-600">{p.country}</td>
                    <td className="p-3 pr-5 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.type === 'SEA' ? 'bg-blue-100 text-blue-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {p.type} PORT
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        </div>
      </div>

      {/* ADD NEW MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-lg w-full p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 border-b pb-2">
              Add New {type.slice(0, -1).toUpperCase()}
            </h2>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Official Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  placeholder="e.g. Apex Global Logistics"
                />
              </div>

              {type === 'customers' && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">NTN / STRN</label>
                      <input
                        type="text"
                        value={ntnStrn}
                        onChange={(e) => setNtnStrn(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-semibold mb-1">Payment Terms</label>
                      <input
                        type="text"
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Credit Limit (PKR)</label>
                    <input
                      type="number"
                      value={creditLimit}
                      onChange={(e) => setCreditLimit(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {type === 'vendors' && (
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Service Type</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Shipping Line">Shipping Line</option>
                    <option value="Terminal & THC">Terminal & THC</option>
                    <option value="Customs & Handling">Customs & Handling</option>
                    <option value="Haulage & Transport">Haulage & Transport</option>
                  </select>
                </div>
              )}

              {type === 'ports' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Port Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PKBQM"
                      value={portCode}
                      onChange={(e) => setPortCode(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Type</label>
                    <select
                      value={portType}
                      onChange={(e) => setPortType(e.target.value as 'SEA' | 'AIR')}
                      className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="SEA">Sea Port</option>
                      <option value="AIR">Airport</option>
                    </select>
                  </div>
                </div>
              )}

              {type !== 'ports' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Contact Person</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
