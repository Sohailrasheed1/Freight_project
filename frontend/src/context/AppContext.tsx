import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Job, 
  Customer, 
  Shipper, 
  Consignee, 
  Vendor, 
  Port, 
  UserRole,
  JobStatus,
  BuyingCharge,
  SellingCharge,
  AuditLog
} from '../types';
import { 
  initialJobs, 
  initialCustomers, 
  initialShippers, 
  initialConsignees, 
  initialVendors, 
  initialPorts 
} from '../data/mockData';
import { api } from '../services/api';

interface AppContextType {
  // Master data
  jobs: Job[];
  customers: Customer[];
  shippers: Shipper[];
  consignees: Consignee[];
  vendors: Vendor[];
  ports: Port[];

  // Server state
  isServerConnected: boolean;

  // User & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: string;

  // Job Actions
  addJob: (job: Omit<Job, 'id' | 'job_number' | 'total_buying' | 'total_selling' | 'gross_profit' | 'profit_margin_pct' | 'audit_logs' | 'is_locked'>) => Promise<Job>;
  updateJob: (id: string, updatedData: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  updateJobStatus: (id: string, newStatus: JobStatus) => Promise<void>;
  
  // Master Actions
  addCustomer: (customer: Omit<Customer, 'id' | 'code'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  addShipper: (shipper: Omit<Shipper, 'id' | 'code'>) => Promise<void>;
  addConsignee: (consignee: Omit<Consignee, 'id' | 'code'>) => Promise<void>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'code'>) => Promise<void>;
  addPort: (port: Omit<Port, 'id'>) => Promise<void>;

  // Validation Helpers
  checkDuplicateMBL: (mbl: string, currentJobId?: string) => boolean;
  checkDuplicateHBL: (hbl: string, currentJobId?: string) => boolean;
  
  // Helpers
  calculateFinancials: (buying: BuyingCharge[], selling: SellingCharge[]) => {
    total_buying: number;
    total_selling: number;
    gross_profit: number;
    profit_margin_pct: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('ffms_jobs');
    return saved ? JSON.parse(saved) : initialJobs;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('ffms_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [shippers, setShippers] = useState<Shipper[]>(() => {
    const saved = localStorage.getItem('ffms_shippers');
    return saved ? JSON.parse(saved) : initialShippers;
  });

  const [consignees, setConsignees] = useState<Consignee[]>(() => {
    const saved = localStorage.getItem('ffms_consignees');
    return saved ? JSON.parse(saved) : initialConsignees;
  });

  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('ffms_vendors');
    return saved ? JSON.parse(saved) : initialVendors;
  });

  const [ports, setPorts] = useState<Port[]>(() => {
    const saved = localStorage.getItem('ffms_ports');
    return saved ? JSON.parse(saved) : initialPorts;
  });

  const [isServerConnected, setIsServerConnected] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>('Administrator');
  const currentUser = currentRole === 'Administrator' ? 'Admin Officer' : `${currentRole} User`;

  // Sync with backend server on startup
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const data = await api.syncAll();
        if (data && data.jobs) {
          setJobs(data.jobs);
          setCustomers(data.customers);
          setShippers(data.shippers);
          setConsignees(data.consignees);
          setVendors(data.vendors);
          setPorts(data.ports);
          setIsServerConnected(true);
        }
      } catch (err) {
        console.warn('Backend sync failed, running with local storage cache:', err);
        setIsServerConnected(false);
      }
    };
    syncBackend();
  }, []);

  // Save to local storage cache as fallback
  useEffect(() => {
    localStorage.setItem('ffms_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('ffms_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('ffms_shippers', JSON.stringify(shippers));
  }, [shippers]);

  useEffect(() => {
    localStorage.setItem('ffms_consignees', JSON.stringify(consignees));
  }, [consignees]);

  useEffect(() => {
    localStorage.setItem('ffms_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('ffms_ports', JSON.stringify(ports));
  }, [ports]);

  // Financial calculation engine (Section 3)
  const calculateFinancials = (buying: BuyingCharge[], selling: SellingCharge[]) => {
    const total_buying = buying.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const total_selling = selling.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const gross_profit = total_selling - total_buying;
    const profit_margin_pct = total_selling > 0 ? (gross_profit / total_selling) * 100 : 0;

    return {
      total_buying,
      total_selling,
      gross_profit,
      profit_margin_pct
    };
  };

  const checkDuplicateMBL = (mbl: string, currentJobId?: string) => {
    if (!mbl || mbl.trim() === '') return false;
    return jobs.some(j => j.id !== currentJobId && j.mbl_number?.toLowerCase().trim() === mbl.toLowerCase().trim());
  };

  const checkDuplicateHBL = (hbl: string, currentJobId?: string) => {
    if (!hbl || hbl.trim() === '') return false;
    return jobs.some(j => j.id !== currentJobId && j.hbl_number?.toLowerCase().trim() === hbl.toLowerCase().trim());
  };

  const addJob = async (jobInput: Omit<Job, 'id' | 'job_number' | 'total_buying' | 'total_selling' | 'gross_profit' | 'profit_margin_pct' | 'audit_logs' | 'is_locked'>): Promise<Job> => {
    const nextIndex = jobs.length + 1;
    const jobNumber = `JOB-2026-${String(nextIndex).padStart(3, '0')}`;
    const id = `job-${Date.now()}`;

    const financials = calculateFinancials(jobInput.buying_charges, jobInput.selling_charges);

    const initialAudit: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user_name: currentUser,
      user_role: currentRole,
      action: 'CREATE_JOB',
      details: `Created job ${jobNumber}. Buying: PKR ${financials.total_buying}, Selling: PKR ${financials.total_selling}, Profit: PKR ${financials.gross_profit}`
    };

    const newJob: Job = {
      ...jobInput,
      id,
      job_number: jobNumber,
      ...financials,
      is_locked: jobInput.status === 'CLOSED',
      audit_logs: [initialAudit]
    };

    // Optimistic UI update
    setJobs(prev => [newJob, ...prev]);

    // Persist to Backend API
    try {
      const serverCreated = await api.createJob(jobInput, { name: currentUser, role: currentRole });
      if (serverCreated) {
        setJobs(prev => prev.map(j => j.id === id ? serverCreated : j));
        setIsServerConnected(true);
        return serverCreated;
      }
    } catch (e) {
      console.warn('Backend offline, saved locally:', e);
      setIsServerConnected(false);
    }

    return newJob;
  };

  const updateJob = async (id: string, updatedData: Partial<Job>) => {
    const targetJob = jobs.find(j => j.id === id);
    if (!targetJob) return;

    if (targetJob.is_locked && currentRole !== 'Administrator') {
      alert('This job is CLOSED and profit locked. Administrator privilege is required to edit.');
      return;
    }

    const buying = updatedData.buying_charges !== undefined ? updatedData.buying_charges : targetJob.buying_charges;
    const selling = updatedData.selling_charges !== undefined ? updatedData.selling_charges : targetJob.selling_charges;
    const financials = calculateFinancials(buying, selling);
    const status = updatedData.status !== undefined ? updatedData.status : targetJob.status;
    const isLocked = status === 'CLOSED';

    const auditEntry: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user_name: currentUser,
      user_role: currentRole,
      action: 'UPDATE_JOB',
      details: `Updated job file. Financials: Buying: PKR ${financials.total_buying}, Selling: PKR ${financials.total_selling}, Profit: PKR ${financials.gross_profit}`
    };

    const updatedJob: Job = {
      ...targetJob,
      ...updatedData,
      buying_charges: buying,
      selling_charges: selling,
      ...financials,
      is_locked: isLocked,
      audit_logs: [auditEntry, ...(targetJob.audit_logs || [])]
    };

    setJobs(prev => prev.map(j => j.id === id ? updatedJob : j));

    // Send to server
    try {
      await api.updateJob(id, updatedJob, { name: currentUser, role: currentRole });
      setIsServerConnected(true);
    } catch (err) {
      console.warn('Saved to local storage (server offline):', err);
      setIsServerConnected(false);
    }
  };

  const deleteJob = async (id: string) => {
    if (currentRole !== 'Administrator') {
      alert('Only Administrators can delete a job record.');
      return;
    }
    setJobs(prev => prev.filter(j => j.id !== id));
    try {
      await api.deleteJob(id);
      setIsServerConnected(true);
    } catch (err) {
      console.warn('Backend delete offline:', err);
    }
  };

  const updateJobStatus = async (id: string, newStatus: JobStatus) => {
    const target = jobs.find(j => j.id === id);
    if (!target) return;

    const isLocked = newStatus === 'CLOSED';
    const auditEntry: AuditLog = {
      id: `al-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      user_name: currentUser,
      user_role: currentRole,
      action: 'STATUS_CHANGE',
      details: `Status transitioned from ${target.status} to ${newStatus}.${isLocked ? ' (Job Closed & Profit Locked)' : ''}`
    };

    setJobs(prev => prev.map(job => {
      if (job.id !== id) return job;
      return {
        ...job,
        status: newStatus,
        is_locked: isLocked,
        audit_logs: [auditEntry, ...(job.audit_logs || [])]
      };
    }));

    try {
      await api.updateJobStatus(id, newStatus, { name: currentUser, role: currentRole });
      setIsServerConnected(true);
    } catch (e) {
      console.warn('Backend status update offline:', e);
    }
  };

  // Master Data Add/Update
  const addCustomer = async (customer: Omit<Customer, 'id' | 'code'>) => {
    const code = `CUST-${String(customers.length + 1).padStart(3, '0')}`;
    const newCust: Customer = {
      ...customer,
      id: `cust-${Date.now()}`,
      code
    };
    setCustomers(prev => [...prev, newCust]);

    try {
      const saved = await api.createCustomer(customer);
      if (saved) {
        setCustomers(prev => prev.map(c => c.id === newCust.id ? saved : c));
        setIsServerConnected(true);
      }
    } catch (e) {
      console.warn('Backend customer save failed, cached locally:', e);
    }
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const addShipper = async (shipper: Omit<Shipper, 'id' | 'code'>) => {
    const code = `SHP-${String(shippers.length + 1).padStart(3, '0')}`;
    const newShipper = { ...shipper, id: `shp-${Date.now()}`, code };
    setShippers(prev => [...prev, newShipper]);

    try {
      const saved = await api.createShipper(shipper);
      if (saved) {
        setShippers(prev => prev.map(s => s.id === newShipper.id ? saved : s));
        setIsServerConnected(true);
      }
    } catch (e) {
      console.warn('Backend shipper save offline:', e);
    }
  };

  const addConsignee = async (consignee: Omit<Consignee, 'id' | 'code'>) => {
    const code = `CNS-${String(consignees.length + 1).padStart(3, '0')}`;
    const newConsignee = { ...consignee, id: `cns-${Date.now()}`, code };
    setConsignees(prev => [...prev, newConsignee]);

    try {
      const saved = await api.createConsignee(consignee);
      if (saved) {
        setConsignees(prev => prev.map(c => c.id === newConsignee.id ? saved : c));
        setIsServerConnected(true);
      }
    } catch (e) {
      console.warn('Backend consignee save offline:', e);
    }
  };

  const addVendor = async (vendor: Omit<Vendor, 'id' | 'code'>) => {
    const code = `VND-${String(vendors.length + 1).padStart(3, '0')}`;
    const newVendor = { ...vendor, id: `vnd-${Date.now()}`, code };
    setVendors(prev => [...prev, newVendor]);

    try {
      const saved = await api.createVendor(vendor);
      if (saved) {
        setVendors(prev => prev.map(v => v.id === newVendor.id ? saved : v));
        setIsServerConnected(true);
      }
    } catch (e) {
      console.warn('Backend vendor save offline:', e);
    }
  };

  const addPort = async (port: Omit<Port, 'id'>) => {
    const newPort = { ...port, id: `port-${Date.now()}` };
    setPorts(prev => [...prev, newPort]);

    try {
      const saved = await api.createPort(port);
      if (saved) {
        setPorts(prev => prev.map(p => p.id === newPort.id ? saved : p));
        setIsServerConnected(true);
      }
    } catch (e) {
      console.warn('Backend port save offline:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      jobs,
      customers,
      shippers,
      consignees,
      vendors,
      ports,
      isServerConnected,
      currentRole,
      setCurrentRole,
      currentUser,
      addJob,
      updateJob,
      deleteJob,
      updateJobStatus,
      addCustomer,
      updateCustomer,
      addShipper,
      addConsignee,
      addVendor,
      addPort,
      checkDuplicateMBL,
      checkDuplicateHBL,
      calculateFinancials
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
