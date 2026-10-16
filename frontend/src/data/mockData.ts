import { Customer, Shipper, Consignee, Vendor, Port, Job } from '../types';

export const initialCustomers: Customer[] = [
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
];

export const initialShippers: Shipper[] = [
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
];

export const initialConsignees: Consignee[] = [
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
];

export const initialVendors: Vendor[] = [
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
];

export const initialPorts: Port[] = [
  { id: 'port-1', code: 'PKKHI', name: 'Port Qasim / Karachi Port', country: 'Pakistan', type: 'SEA' },
  { id: 'port-2', code: 'AEDXB', name: 'Jebel Ali Port', country: 'UAE', type: 'SEA' },
  { id: 'port-3', code: 'DEHAM', name: 'Port of Hamburg', country: 'Germany', type: 'SEA' },
  { id: 'port-4', code: 'USNYC', name: 'Port of New York / New Jersey', country: 'USA', type: 'SEA' },
  { id: 'port-5', code: 'CNSHA', name: 'Port of Shanghai', country: 'China', type: 'SEA' },
  { id: 'port-6', code: 'PKKHI-AIR', name: 'Jinnah International Airport (KHI)', country: 'Pakistan', type: 'AIR' },
  { id: 'port-7', code: 'AEDXB-AIR', name: 'Dubai International Airport (DXB)', country: 'UAE', type: 'AIR' }
];

export const initialJobs: Job[] = [
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
    // Acceptance Test Case 1: Buying 100,000; Selling 125,000 -> Profit 25,000
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
      { id: 'doc-1', name: 'Master_BL_MAEU230918234.pdf', doc_type: 'MBL', file_size: '1.2 MB', upload_date: '2026-10-15', uploaded_by: 'Operations' },
      { id: 'doc-2', name: 'House_BL_HBL-KHI-HAM-901.pdf', doc_type: 'HBL', file_size: '950 KB', upload_date: '2026-10-15', uploaded_by: 'Operations' },
      { id: 'doc-3', name: 'Commercial_Invoice_EuroTex.pdf', doc_type: 'Commercial Invoice', file_size: '420 KB', upload_date: '2026-10-15', uploaded_by: 'Operations' }
    ],
    audit_logs: [
      { id: 'al-1', timestamp: '2026-10-15 10:15', user_name: 'Admin', user_role: 'Administrator', action: 'CREATE_JOB', details: 'Job created with auto number JOB-2026-001' },
      { id: 'al-2', timestamp: '2026-10-15 11:30', user_name: 'Farhan (Ops)', user_role: 'Operations', action: 'ADD_CHARGES', details: 'Buying: 100,000 PKR, Selling: 125,000 PKR. Profit: 25,000 PKR' }
    ],
    is_locked: false,
    notes: 'Priority customer shipment. Direct sailing to Hamburg.'
  },
  {
    id: 'job-2',
    job_number: 'JOB-2026-002',
    date: '2026-10-14',
    mode: 'Sea',
    job_type: 'Export',
    customer_id: 'cust-2',
    customer_name: 'Orient Textile Mills Ltd',
    shipper_id: 'shp-2',
    shipper_name: 'Chenab Garments & Home Decor',
    consignee_id: 'cns-2',
    consignee_name: 'American Retail Alliance LLC',
    status: 'BOOKED',
    mbl_number: 'HLCU98127391',
    hbl_number: 'HBL-KHI-NYC-402',
    booking_number: 'HL-BK-77123',
    vessel_name: 'AL ZUBARA',
    voyage_number: 'V.880W',
    pol_id: 'port-1',
    pol_name: 'Port Qasim / Karachi Port',
    pod_id: 'port-4',
    pod_name: 'Port of New York / New Jersey',
    etd: '2026-10-22',
    eta: '2026-11-20',
    commodity: 'Men Knitted T-Shirts and Denim Apparel',
    packages_count: 1200,
    weight_kg: 24000,
    volume_cbm: 68.0,
    containers: [
      { id: 'cnt-2', container_type: '40 HC', quantity: 1, container_number: 'HLXU4401928', cbm: 68.0, weight_kg: 24000 }
    ],
    buying_charges: [
      { id: 'bc-4', charge_type: 'Ocean Freight', vendor_id: 'vnd-2', vendor_name: 'Hapag-Lloyd Pakistan', quantity: 1, rate: 320000, currency: 'PKR', exchange_rate: 1, amount: 320000 },
      { id: 'bc-5', charge_type: 'THC / Terminal', vendor_id: 'vnd-3', vendor_name: 'Karachi Port Terminal Operators', quantity: 1, rate: 25000, currency: 'PKR', exchange_rate: 1, amount: 25000 }
    ],
    selling_charges: [
      { id: 'sc-3', charge_type: 'Ocean Freight All-in', customer_id: 'cust-2', customer_name: 'Orient Textile Mills Ltd', quantity: 1, rate: 410000, currency: 'PKR', exchange_rate: 1, amount: 410000 }
    ],
    total_buying: 345000,
    total_selling: 410000,
    gross_profit: 65000,
    profit_margin_pct: 15.85,
    milestones: [
      { id: 'm-7', milestone_name: 'Booking Confirmed', planned_date: '2026-10-14', actual_date: '2026-10-14', status: 'Completed' },
      { id: 'm-8', milestone_name: 'Container Gated In', planned_date: '2026-10-19', status: 'Pending' }
    ],
    documents: [],
    audit_logs: [
      { id: 'al-3', timestamp: '2026-10-14 14:00', user_name: 'Admin', user_role: 'Administrator', action: 'CREATE_JOB', details: 'Job created' }
    ],
    is_locked: false
  },
  {
    id: 'job-3',
    job_number: 'JOB-2026-003',
    date: '2026-10-10',
    mode: 'Sea',
    job_type: 'Export',
    customer_id: 'cust-3',
    customer_name: 'Global Trade Consortium UAE',
    shipper_id: 'shp-3',
    shipper_name: 'Indus Agro Products',
    consignee_id: 'cns-3',
    consignee_name: 'Gulf Mart Trading WLL',
    status: 'CLOSED',
    mbl_number: 'MAEU77192834',
    hbl_number: 'HBL-KHI-DXB-108',
    booking_number: 'BKG-552310',
    vessel_name: 'MSC INES',
    voyage_number: 'V.120S',
    pol_id: 'port-1',
    pol_name: 'Port Qasim / Karachi Port',
    pod_id: 'port-2',
    pod_name: 'Jebel Ali Port',
    etd: '2026-10-05',
    eta: '2026-10-10',
    commodity: 'Fresh Mangoes & Vegetables (Reefer)',
    packages_count: 1400,
    weight_kg: 22000,
    volume_cbm: 55.0,
    containers: [
      { id: 'cnt-3', container_type: '40 HC', quantity: 1, container_number: 'MSKU1092837', cbm: 55.0, weight_kg: 22000 }
    ],
    buying_charges: [
      { id: 'bc-6', charge_type: 'Reefer Freight', vendor_id: 'vnd-1', vendor_name: 'Maersk Line Pakistan', quantity: 1, rate: 210000, currency: 'PKR', exchange_rate: 1, amount: 210000 },
      { id: 'bc-7', charge_type: 'Genset & Monitoring', vendor_id: 'vnd-1', vendor_name: 'Maersk Line Pakistan', quantity: 1, rate: 30000, currency: 'PKR', exchange_rate: 1, amount: 30000 }
    ],
    selling_charges: [
      { id: 'sc-4', charge_type: 'All-inclusive Reefer Freight', customer_id: 'cust-3', customer_name: 'Global Trade Consortium UAE', quantity: 1, rate: 310000, currency: 'PKR', exchange_rate: 1, amount: 310000 }
    ],
    total_buying: 240000,
    total_selling: 310000,
    gross_profit: 70000,
    profit_margin_pct: 22.58,
    milestones: [
      { id: 'm-9', milestone_name: 'Delivered to Consignee', planned_date: '2026-10-11', actual_date: '2026-10-11', status: 'Completed' }
    ],
    documents: [
      { id: 'doc-4', name: 'Delivery_Order_DXB.pdf', doc_type: 'Other', file_size: '512 KB', upload_date: '2026-10-11', uploaded_by: 'Operations' }
    ],
    audit_logs: [
      { id: 'al-4', timestamp: '2026-10-12 17:00', user_name: 'Accounts Manager', user_role: 'Accounts', action: 'CLOSE_JOB', details: 'Job marked CLOSED. Profit locked.' }
    ],
    is_locked: true,
    notes: 'Closed and fully settled.'
  }
];
