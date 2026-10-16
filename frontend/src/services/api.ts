const API_BASE = 'http://localhost:5000/api';

export const api = {
  // Sync all data
  async syncAll() {
    const res = await fetch(`${API_BASE}/sync-all`);
    if (!res.ok) throw new Error('Failed to sync from backend');
    return res.json();
  },

  // Jobs
  async getJobs() {
    const res = await fetch(`${API_BASE}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(jobData: any, user: { name: string; role: string }) {
    const res = await fetch(`${API_BASE}/jobs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-name': user.name,
        'x-user-role': user.role,
      },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  async updateJob(id: string, jobData: any, user: { name: string; role: string }) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-name': user.name,
        'x-user-role': user.role,
      },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to update job');
    return res.json();
  },

  async updateJobStatus(id: string, status: string, user: { name: string; role: string }) {
    const res = await fetch(`${API_BASE}/jobs/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-user-name': user.name,
        'x-user-role': user.role,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update job status');
    return res.json();
  },

  async deleteJob(id: string) {
    const res = await fetch(`${API_BASE}/jobs/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete job');
    return res.json();
  },

  // Master Data
  async createCustomer(data: any) {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create customer');
    return res.json();
  },

  async createShipper(data: any) {
    const res = await fetch(`${API_BASE}/shippers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create shipper');
    return res.json();
  },

  async createConsignee(data: any) {
    const res = await fetch(`${API_BASE}/consignees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create consignee');
    return res.json();
  },

  async createVendor(data: any) {
    const res = await fetch(`${API_BASE}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create vendor');
    return res.json();
  },

  async createPort(data: any) {
    const res = await fetch(`${API_BASE}/ports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create port');
    return res.json();
  },
};
