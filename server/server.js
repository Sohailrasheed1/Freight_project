import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'ffms_database.json');

// Initial seed data
const initialData = {
  customers: [
    {
      id: 'cust-1',
      code: 'CUST-001',
      name: 'Atlas Logistics International',
      ntn_strn: '1234567-8 / STRN-9988',
      address: 'Suite 401, Business Avenue, Shahrah-e-Faisal',
      city: 'Karachi',
      contact_person: 'Tariq Mehmood',
      phone: '+92 300 1234567',
      email: 'tariq@atlaslogistics.com',
      payment_terms: '30 Days Net',
      currency: 'PKR',
      credit_limit: 5000000,
      is_active: true
    },
    {
      id: 'cust-2',
      code: 'CUST-002',
      name: 'Orient Textile Mills Ltd',
      ntn_strn: '7654321-0 / STRN-4455',
      address: 'Industrial Area, Kot Lakhpat',
      city: 'Lahore',
      contact_person: 'Salman Farooqi',
      phone: '+92 321 9876543',
      email: 's.farooqi@orienttextiles.pk',
      payment_terms: '15 Days Net',
      currency: 'PKR',
      credit_limit: 10000000,
      is_active: true
    },
    {
      id: 'cust-3',
      code: 'CUST-003',
      name: 'Global Trade Consortium UAE',
      ntn_strn: 'VAT-AE-100293847',
      address: 'JAFZA One, Jebel Ali Freezone',
      city: 'Dubai',
      contact_person: 'Rashid Al-Maktoum',
      phone: '+971 4 8812345',
      email: 'operations@gtcuae.ae',
      payment_terms: 'Advance / CAD',
      currency: 'USD',
      credit_limit: 8000000,
      is_active: true
    }
  ],
  shippers: [
    {
      id: 'shp-1',
      code: 'SHP-001',
      name: 'Al-Karam Textile Mills Ltd',
      contact_person: 'Faisal Hayat',
      phone: '+92 21 35061234',
      email: 'shipping@alkaram.com',
      address: 'Landhi Industrial Area',
      city: 'Karachi'
    },
    {
      id: 'shp-2',
      code: 'SHP-002',
      name: 'Chenab Garments & Home Decor',
      contact_person: 'Imran Ashraf',
      phone: '+92 41 8540000',
      email: 'exports@chenab.com.pk',
      address: 'Nishatabad',
      city: 'Faisalabad'
    },
    {
      id: 'shp-3',
      code: 'SHP-003',
      name: 'Indus Agro Products',
      contact_person: 'Zahid Khan',
      phone: '+92 22 2781122',
      email: 'zahid@indusagro.com',
      address: 'SITE Area',
      city: 'Kotri'
    }
  ],
  consignees: [
    {
      id: 'cns-1',
      code: 'CNS-001',
      name: 'EuroTex Fashion GmbH',
      contact_person: 'Hans Mueller',
      phone: '+49 40 12345678',
      email: 'h.mueller@eurotex-fashion.de',
      address: 'Hafenstrasse 45',
      city: 'Hamburg'
    },
    {
      id: 'cns-2',
      code: 'CNS-002',
      name: 'American Retail Alliance LLC',
      contact_person: 'David Smith',
      phone: '+1 212 555 0199',
      email: 'imports@ara-retail.com',
      address: '500 5th Avenue',
      city: 'New York'
    },
    {
      id: 'cns-3',
      code: 'CNS-003',
      name: 'Gulf Mart Trading WLL',
      contact_person: 'Kareem Mansoor',
      phone: '+971 4 2233445',
      email: 'purchase@gulfmart.ae',
      address: 'Deira Wholesale Market',
      city: 'Dubai'
    }
  ],
  vendors: [
    {
      id: 'vnd-1',
      code: 'VND-001',
      name: 'Maersk Line Pakistan',
      service_type: 'Shipping Line',
      contact_person: 'Arif Siddiqui',
      phone: '+92 21 111 623 775',
      email: 'pakops@maersk.com'
    },
    {
      id: 'vnd-2',
      code: 'VND-002',
      name: 'Hapag-Lloyd Pakistan',
      service_type: 'Shipping Line',
      contact_person: 'Babar Azam',
      phone: '+92 21 3568 9900',
      email: 'karachi@hlag.com'
    },
    {
      id: 'vnd-3',
      code: 'VND-003',
      name: 'Karachi Port Terminal Operators (QICT / KICT)',
      service_type: 'Terminal & THC',
      contact_person: 'Nadeem Akhtar',
      phone: '+92 21 3285 2200',
      email: 'operations@kictl.com'
    },
    {
      id: 'vnd-4',
      code: 'VND-004',
      name: 'Apex Customs Clearance Agency',
      service_type: 'Customs & Handling',
      contact_person: 'Malik Shakeel',
      phone: '+92 300 4455667',
      email: 'shakeel@apexclearing.pk'
    }
  ],
  ports: [
    { id: 'port-1', code: 'PKKHI', name: 'Port Qasim / Karachi Port', country: 'Pakistan', type: 'SEA' },
    { id: 'port-2', code: 'AEDXB', name: 'Jebel Ali Port', country: 'UAE', type: 'SEA' },
    { id: 'port-3', code: 'DEHAM', name: 'Port of Hamburg', country: 'Germany', type: 'SEA' },
    { id: 'port-4', code: 'USNYC', name: 'Port of New York / New Jersey', country: 'USA', type: 'SEA' },
    { id: 'port-5', code: 'CNSHA', name: 'Port of Shanghai', country: 'China', type: 'SEA' },
    { id: 'port-6', code: 'PKKHI-AIR', name: 'Jinnah International Airport (KHI)', country: 'Pakistan', type: 'AIR' },
    { id: 'port-7', code: 'AEDXB-AIR', name: 'Dubai International Airport (DXB)', country: 'UAE', type: 'AIR' }
  ],
  jobs: [
    {
      id: 'job-1',
      job_number: 'JOB-2026-001',
      date: '2026-10-15',
      mode: 'Sea',
      job_type: 'Export',
      customer_id: 'cust-1',
      customer_name: 'Atlas Logistics International',
      shipper_id: 'shp-1',
      shipper_name: 'Al-Karam Textile Mills Ltd',
      consignee_id: 'cns-1',
      consignee_name: 'EuroTex Fashion GmbH',
      status: 'IN TRANSIT',
      mbl_number: 'MAEU230918234',
      hbl_number: 'HBL-KHI-HAM-901',
      booking_number: 'BKG-994821',
      vessel_name: 'MAERSK MC-KINNEY MOLLER',
      voyage_number: 'V.2610E',
      pol_id: 'port-1',
      pol_name: 'Port Qasim / Karachi Port',
      pod_id: 'port-3',
      pod_name: 'Port of Hamburg',
      etd: '2026-10-18',
      eta: '2026-11-08',
      commodity: '100% Cotton Printed Bed Linen & Garments',
      packages_count: 850,
      weight_kg: 18500,
      volume_cbm: 58.5,
      containers: [
        { id: 'cnt-1', container_type: '40 HC', quantity: 1, container_number: 'MSKU9182341', cbm: 58.5, weight_kg: 18500 }
      ],
      buying_charges: [
        { id: 'bc-1', charge_type: 'Ocean Freight', vendor_id: 'vnd-1', vendor_name: 'Maersk Line Pakistan', quantity: 1, rate: 80000, currency: 'PKR', exchange_rate: 1, amount: 80000, remarks: 'Contract ocean freight' },
        { id: 'bc-2', charge_type: 'THC / Terminal Charges', vendor_id: 'vnd-3', vendor_name: 'Karachi Port Terminal Operators', quantity: 1, rate: 15000, currency: 'PKR', exchange_rate: 1, amount: 15000, remarks: 'Terminal handling' },
        { id: 'bc-3', charge_type: 'Documentation Fee', vendor_id: 'vnd-1', vendor_name: 'Maersk Line Pakistan', quantity: 1, rate: 5000, currency: 'PKR', exchange_rate: 1, amount: 5000, remarks: 'MBL issuance fee' }
      ],
      selling_charges: [
        { id: 'sc-1', charge_type: 'Ocean Freight', customer_id: 'cust-1', customer_name: 'Atlas Logistics International', quantity: 1, rate: 105000, currency: 'PKR', exchange_rate: 1, amount: 105000, remarks: 'Agreed client freight' },
        { id: 'sc-2', charge_type: 'Local Charges / THC', customer_id: 'cust-1', customer_name: 'Atlas Logistics International', quantity: 1, rate: 20000, currency: 'PKR', exchange_rate: 1, amount: 20000, remarks: 'Client THC & Doc charge' }
      ],
      total_buying: 100000,
      total_selling: 125000,
      gross_profit: 25000,
      profit_margin_pct: 20,
      milestones: [
        { id: 'm-1', milestone_name: 'Booking Confirmed', planned_date: '2026-10-12', actual_date: '2026-10-12', status: 'Completed', notes: 'Booking released by Maersk' },
        { id: 'm-2', milestone_name: 'Container Stuffed & Sealed', planned_date: '2026-10-14', actual_date: '2026-10-15', status: 'Completed' },
        { id: 'm-3', milestone_name: 'Customs Cleared', planned_date: '2026-10-16', actual_date: '2026-10-16', status: 'Completed' },
        { id: 'm-4', milestone_name: 'Vessel Departure (ETD)', planned_date: '2026-10-18', status: 'In Progress' },
        { id: 'm-5', milestone_name: 'Port of Discharge Arrival (ETA)', planned_date: '2026-11-08', status: 'Pending' },
        { id: 'm-6', milestone_name: 'Cargo Delivered', planned_date: '2026-11-12', status: 'Pending' }
      ],
      documents: [
        { id: 'doc-1', name: 'Master_BL_MAEU230918234.pdf', doc_type: 'MBL', file_size: '1.2 MB', upload_date: '2026-10-15', uploaded_by: 'Operations' }
      ],
      audit_logs: [
        { id: 'al-1', timestamp: '2026-10-15 10:15', user_name: 'Admin', user_role: 'Administrator', action: 'CREATE_JOB', details: 'Job created with auto number JOB-2026-001' }
      ],
      is_locked: false,
      notes: 'Priority customer shipment.'
    }
  ]
};

// Database helper functions
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading DB file, reinitializing:', err);
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Financial calculation helper according to Section 3
function calculateFinancials(buyingCharges = [], sellingCharges = []) {
  const total_buying = buyingCharges.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const total_selling = sellingCharges.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const gross_profit = total_selling - total_buying;
  const profit_margin_pct = total_selling > 0 ? (gross_profit / total_selling) * 100 : 0;

  return {
    total_buying,
    total_selling,
    gross_profit,
    profit_margin_pct
  };
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), message: 'FFMS Backend Server Online' });
});

// All Master & Job Data in single sync
app.get('/api/sync-all', (req, res) => {
  const db = readDb();
  res.json(db);
});

// ---------------- JOBS CRUD ----------------

// GET /api/jobs
app.get('/api/jobs', (req, res) => {
  const db = readDb();
  res.json(db.jobs);
});

// GET /api/jobs/:id
app.get('/api/jobs/:id', (req, res) => {
  const db = readDb();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// POST /api/jobs (Create New Job Entry)
app.post('/api/jobs', (req, res) => {
  const db = readDb();
  const jobInput = req.body;

  const nextIndex = db.jobs.length + 1;
  const jobNumber = `JOB-2026-${String(nextIndex).padStart(3, '0')}`;
  const id = `job-${Date.now()}`;

  const financials = calculateFinancials(jobInput.buying_charges || [], jobInput.selling_charges || []);

  const initialAudit = {
    id: `al-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user_name: req.headers['x-user-name'] || 'Admin Officer',
    user_role: req.headers['x-user-role'] || 'Administrator',
    action: 'CREATE_JOB',
    details: `Created job ${jobNumber}. Buying: PKR ${financials.total_buying}, Selling: PKR ${financials.total_selling}, Profit: PKR ${financials.gross_profit}`
  };

  const newJob = {
    ...jobInput,
    id,
    job_number: jobNumber,
    ...financials,
    containers: jobInput.containers || [],
    buying_charges: jobInput.buying_charges || [],
    selling_charges: jobInput.selling_charges || [],
    milestones: jobInput.milestones || [],
    documents: jobInput.documents || [],
    is_locked: jobInput.status === 'CLOSED',
    audit_logs: [initialAudit, ...(jobInput.audit_logs || [])]
  };

  db.jobs.unshift(newJob);
  writeDb(db);

  res.status(201).json(newJob);
});

// PUT /api/jobs/:id (Update Job File & Recalculate Profit)
app.put('/api/jobs/:id', (req, res) => {
  const db = readDb();
  const index = db.jobs.findIndex(j => j.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Job not found' });

  const existing = db.jobs[index];
  const updateData = req.body;

  const buying = updateData.buying_charges !== undefined ? updateData.buying_charges : existing.buying_charges;
  const selling = updateData.selling_charges !== undefined ? updateData.selling_charges : existing.selling_charges;
  const financials = calculateFinancials(buying, selling);

  const status = updateData.status !== undefined ? updateData.status : existing.status;
  const isLocked = status === 'CLOSED';

  const auditEntry = {
    id: `al-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user_name: req.headers['x-user-name'] || 'Admin Officer',
    user_role: req.headers['x-user-role'] || 'Administrator',
    action: 'UPDATE_JOB',
    details: `Updated job file. Financials: Buying: PKR ${financials.total_buying}, Selling: PKR ${financials.total_selling}, Profit: PKR ${financials.gross_profit}`
  };

  const updatedJob = {
    ...existing,
    ...updateData,
    buying_charges: buying,
    selling_charges: selling,
    ...financials,
    is_locked: isLocked,
    audit_logs: [auditEntry, ...(existing.audit_logs || [])]
  };

  db.jobs[index] = updatedJob;
  writeDb(db);

  res.json(updatedJob);
});

// PATCH /api/jobs/:id/status (Workflow Status Stepper)
app.patch('/api/jobs/:id/status', (req, res) => {
  const db = readDb();
  const job = db.jobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });

  const isLocked = status === 'CLOSED';
  const auditEntry = {
    id: `al-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    user_name: req.headers['x-user-name'] || 'Admin Officer',
    user_role: req.headers['x-user-role'] || 'Administrator',
    action: 'STATUS_CHANGE',
    details: `Status transitioned from ${job.status} to ${status}.${isLocked ? ' (Job Closed & Profit Locked)' : ''}`
  };

  job.status = status;
  job.is_locked = isLocked;
  job.audit_logs = [auditEntry, ...(job.audit_logs || [])];

  writeDb(db);
  res.json(job);
});

// DELETE /api/jobs/:id
app.delete('/api/jobs/:id', (req, res) => {
  const db = readDb();
  const initialLength = db.jobs.length;
  db.jobs = db.jobs.filter(j => j.id !== req.params.id);
  
  if (db.jobs.length === initialLength) {
    return res.status(404).json({ error: 'Job not found' });
  }

  writeDb(db);
  res.json({ message: 'Job deleted successfully' });
});

// ---------------- MASTER DATA CRUD ----------------

// CUSTOMERS
app.get('/api/customers', (req, res) => res.json(readDb().customers));
app.post('/api/customers', (req, res) => {
  const db = readDb();
  const code = `CUST-${String(db.customers.length + 1).padStart(3, '0')}`;
  const newCust = {
    ...req.body,
    id: `cust-${Date.now()}`,
    code
  };
  db.customers.push(newCust);
  writeDb(db);
  res.status(201).json(newCust);
});

// SHIPPERS
app.get('/api/shippers', (req, res) => res.json(readDb().shippers));
app.post('/api/shippers', (req, res) => {
  const db = readDb();
  const code = `SHP-${String(db.shippers.length + 1).padStart(3, '0')}`;
  const newShipper = {
    ...req.body,
    id: `shp-${Date.now()}`,
    code
  };
  db.shippers.push(newShipper);
  writeDb(db);
  res.status(201).json(newShipper);
});

// CONSIGNEES
app.get('/api/consignees', (req, res) => res.json(readDb().consignees));
app.post('/api/consignees', (req, res) => {
  const db = readDb();
  const code = `CNS-${String(db.consignees.length + 1).padStart(3, '0')}`;
  const newConsignee = {
    ...req.body,
    id: `cns-${Date.now()}`,
    code
  };
  db.consignees.push(newConsignee);
  writeDb(db);
  res.status(201).json(newConsignee);
});

// VENDORS
app.get('/api/vendors', (req, res) => res.json(readDb().vendors));
app.post('/api/vendors', (req, res) => {
  const db = readDb();
  const code = `VND-${String(db.vendors.length + 1).padStart(3, '0')}`;
  const newVendor = {
    ...req.body,
    id: `vnd-${Date.now()}`,
    code
  };
  db.vendors.push(newVendor);
  writeDb(db);
  res.status(201).json(newVendor);
});

// PORTS
app.get('/api/ports', (req, res) => res.json(readDb().ports));
app.post('/api/ports', (req, res) => {
  const db = readDb();
  const newPort = {
    ...req.body,
    id: `port-${Date.now()}`
  };
  db.ports.push(newPort);
  writeDb(db);
  res.status(201).json(newPort);
});

// Start Server
app.listen(PORT, () => {
  console.log(`FFMS Backend REST API running at http://localhost:${PORT}`);
  console.log(`Database storage path: ${DB_FILE}`);
});
