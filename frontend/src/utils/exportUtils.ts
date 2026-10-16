import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Job } from '../types';

export const exportJobsToExcel = (jobs: Job[], fileName = 'Job_Register.xlsx') => {
  const data = jobs.map(j => ({
    'Job Number': j.job_number,
    'Date': j.date,
    'Mode': j.mode,
    'Type': j.job_type,
    'Customer': j.customer_name,
    'Shipper': j.shipper_name,
    'Consignee': j.consignee_name,
    'MBL No': j.mbl_number,
    'HBL No': j.hbl_number,
    'POL': j.pol_name,
    'POD': j.pod_name,
    'Vessel/Voyage': `${j.vessel_name} ${j.voyage_number}`.trim(),
    'Buying Cost (PKR)': j.total_buying,
    'Selling Revenue (PKR)': j.total_selling,
    'Gross Profit (PKR)': j.gross_profit,
    'Margin %': `${j.profit_margin_pct.toFixed(2)}%`,
    'Status': j.status
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Jobs');
  XLSX.writeFile(workbook, fileName);
};

export const exportJobsToPDF = (jobs: Job[], title = 'Freight Forwarding Job Register') => {
  const doc = new jsPDF('landscape');
  
  // Header
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(title, 14, 18);
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`Generated on: ${new Date().toLocaleString()} | Total Jobs: ${jobs.length}`, 14, 25);

  const tableData = jobs.map(j => [
    j.job_number,
    j.date,
    j.customer_name,
    j.mbl_number || '-',
    j.pol_name.split('/')[0] || j.pol_name,
    j.pod_name.split('/')[0] || j.pod_name,
    j.total_buying.toLocaleString(),
    j.total_selling.toLocaleString(),
    j.gross_profit.toLocaleString(),
    `${j.profit_margin_pct.toFixed(1)}%`,
    j.status
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['Job No', 'Date', 'Customer', 'MBL', 'POL', 'POD', 'Buying', 'Selling', 'Profit', 'Margin', 'Status']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 3 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};

export const exportSingleJobPDF = (job: Job) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text('FREIGHT FORWARDING JOB FILE', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Job No: ${job.job_number} | Date: ${job.date} | Status: ${job.status}`, 14, 28);
  doc.text(`Mode: ${job.mode} | Type: ${job.job_type}`, 14, 35);

  doc.setLineWidth(0.5);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 40, 196, 40);

  // Shipment Information
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Shipment Details', 14, 48);

  const shipmentData = [
    ['Customer', job.customer_name, 'Shipper', job.shipper_name],
    ['Consignee', job.consignee_name, 'Booking No', job.booking_number || '-'],
    ['MBL No', job.mbl_number || '-', 'HBL No', job.hbl_number || '-'],
    ['Port of Loading', job.pol_name, 'Port of Discharge', job.pod_name],
    ['Vessel & Voyage', `${job.vessel_name} ${job.voyage_number}`, 'Commodity', job.commodity],
    ['ETD', job.etd || '-', 'ETA', job.eta || '-']
  ];

  autoTable(doc, {
    startY: 52,
    body: shipmentData,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2 }
  });

  const lastY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  // Financial Summary
  doc.setFontSize(12);
  doc.text('2. Financial Profitability Summary', 14, lastY);

  const finData = [
    ['Total Selling Revenue', `PKR ${job.total_selling.toLocaleString()}`],
    ['Total Buying Cost', `PKR ${job.total_buying.toLocaleString()}`],
    ['Gross Profit', `PKR ${job.gross_profit.toLocaleString()}`],
    ['Profit Margin %', `${job.profit_margin_pct.toFixed(2)}%`]
  ];

  autoTable(doc, {
    startY: lastY + 4,
    body: finData,
    theme: 'grid',
    headStyles: { fillColor: [30, 41, 59] },
    styles: { fontSize: 10, fontStyle: 'bold' }
  });

  doc.save(`${job.job_number}_Job_File.pdf`);
};
