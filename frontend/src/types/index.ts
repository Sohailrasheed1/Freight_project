export type UserRole = 'Administrator' | 'Operations' | 'Sales' | 'Accounts' | 'Management';

export type JobStatus = 
  | 'NEW'
  | 'BOOKED'
  | 'DOCUMENTATION'
  | 'IN TRANSIT'
  | 'ARRIVED'
  | 'DELIVERED'
  | 'INVOICED'
  | 'COST COMPLETED'
  | 'CLOSED';

export type TransportMode = 'Sea' | 'Air' | 'Road';
export type JobType = 'Export' | 'Import';

export interface Customer {
  id: string;
  code: string;
  name: string;
  ntn_strn?: string;
  address: string;
  city: string;
  contact_person: string;
  phone: string;
  email: string;
  payment_terms: string;
  currency: string;
  credit_limit: number;
  is_active: boolean;
}

export interface Shipper {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Consignee {
  id: string;
  code: string;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  address: string;
  city: string;
}

export interface Vendor {
  id: string;
  code: string;
  name: string;
  service_type: string;
  contact_person: string;
  phone: string;
  email: string;
}

export interface Port {
  id: string;
  code: string;
  name: string;
  country: string;
  type: 'SEA' | 'AIR';
}

export interface ContainerItem {
  id: string;
  container_type: '20 FT' | '40 FT' | '40 HC' | '45 HC' | 'LCL / CBM';
  quantity: number;
  container_number: string;
  cbm: number;
  weight_kg: number;
}

export interface BuyingCharge {
  id: string;
  charge_type: string;
  vendor_id: string;
  vendor_name: string;
  quantity: number;
  rate: number;
  currency: string;
  exchange_rate: number;
  amount: number; // calculated as qty * rate * exchange_rate
  remarks?: string;
}

export interface SellingCharge {
  id: string;
  charge_type: string;
  customer_id: string;
  customer_name: string;
  quantity: number;
  rate: number;
  currency: string;
  exchange_rate: number;
  amount: number; // calculated as qty * rate * exchange_rate
  remarks?: string;
}

export interface JobMilestone {
  id: string;
  milestone_name: string;
  planned_date: string;
  actual_date?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  notes?: string;
}

export interface JobDocument {
  id: string;
  name: string;
  doc_type: 'MBL' | 'HBL' | 'Commercial Invoice' | 'Packing List' | 'Quotation' | 'Vendor Invoice' | 'Customer Invoice' | 'Other';
  file_size: string;
  upload_date: string;
  uploaded_by: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: UserRole;
  action: string;
  details: string;
}

export interface Job {
  id: string;
  job_number: string;
  date: string;
  mode: TransportMode;
  job_type: JobType;
  customer_id: string;
  customer_name: string;
  shipper_id: string;
  shipper_name: string;
  consignee_id: string;
  consignee_name: string;
  status: JobStatus;
  
  // Shipment fields
  mbl_number: string;
  hbl_number: string;
  booking_number: string;
  vessel_name: string;
  voyage_number: string;
  pol_id: string;
  pol_name: string;
  pod_id: string;
  pod_name: string;
  etd: string;
  eta: string;
  commodity: string;
  packages_count: number;
  weight_kg: number;
  volume_cbm: number;

  // Grids
  containers: ContainerItem[];
  buying_charges: BuyingCharge[];
  selling_charges: SellingCharge[];

  // Auto-calculated Financials
  total_buying: number;
  total_selling: number;
  gross_profit: number;
  profit_margin_pct: number;

  milestones: JobMilestone[];
  documents: JobDocument[];
  audit_logs: AuditLog[];
  is_locked: boolean;
  notes?: string;
}
