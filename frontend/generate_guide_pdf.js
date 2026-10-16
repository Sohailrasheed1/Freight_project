import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';

function buildUserGuide() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 20;

  function checkNewPage(neededHeight = 25) {
    if (currentY + neededHeight > pageHeight - 15) {
      doc.addPage();
      currentY = 20;
      // Header on subsequent pages
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.text('Freight Forwarding Management System (FFMS) - User Guide & Operational Manual', margin, 12);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, 14, pageWidth - margin, 14);
    }
  }

  function addSectionHeader(title, subtitle = '') {
    checkNewPage(22);
    currentY += 4;
    doc.setFillColor(15, 23, 42); // slate-900
    doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 10, 2, 2, 'F');
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin + 4, currentY + 6.8);
    currentY += 13;

    if (subtitle) {
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.text(subtitle, margin, currentY);
      currentY += 5;
    }
  }

  function addSubHeader(title) {
    checkNewPage(12);
    currentY += 3;
    doc.setFontSize(10.5);
    doc.setTextColor(30, 58, 138); // blue-900
    doc.setFont('helvetica', 'bold');
    doc.text(title, margin, currentY);
    currentY += 5;
  }

  function addParagraph(text, isBullet = false) {
    checkNewPage(10);
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85); // slate-700
    doc.setFont('helvetica', 'normal');

    const prefix = isBullet ? '•  ' : '';
    const lines = doc.splitTextToSize(prefix + text, pageWidth - (margin * 2) - (isBullet ? 4 : 0));
    lines.forEach((line) => {
      checkNewPage(5);
      doc.text(line, margin + (isBullet ? 2 : 0), currentY);
      currentY += 4.5;
    });
  }

  function addBox(title, rows = []) {
    checkNewPage(rows.length * 6 + 12);
    currentY += 2;
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(203, 213, 225); // slate-300
    const boxHeight = rows.length * 5.5 + 9;
    doc.roundedRect(margin, currentY, pageWidth - (margin * 2), boxHeight, 2, 2, 'FD');
    
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(title, margin + 4, currentY + 5.5);

    let rowY = currentY + 10;
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    rows.forEach(r => {
      doc.text(r, margin + 5, rowY);
      rowY += 5.2;
    });

    currentY += boxHeight + 4;
  }

  // ================= COVER / TITLE PAGE =================
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 45, 'F');

  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('FREIGHT FORWARDING MANAGEMENT SYSTEM', margin, 20);

  doc.setFontSize(11);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.setFont('helvetica', 'normal');
  doc.text('Comprehensive Operational User Manual & Verification Guide Book', margin, 28);
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225);
  doc.text('Web Portal: https://freightproject.vercel.app | Built for Daily Freight Forwarding Operations', margin, 36);

  currentY = 55;

  // Overview box
  addBox('System Overview & Core Philosophy', [
    '• Job-Centric Architecture: Har shipment/job central record hoti hai.',
    '• Everything attaches to the Job Number: Customer, Shipper, Containers, Charges, Profit, Documents.',
    '• Real-time Profit Formula: PROFIT = TOTAL SELLING REVENUE - TOTAL BUYING COST.',
    '• Direct manual modification of profit is strictly prohibited for security integrity.',
    '• Built strictly according to Software Requirements & Development Blueprint.'
  ]);

  // Section 1: Live Login
  addSectionHeader('1. Web Portal & System Login Credentials', 'Live URL: https://freightproject.vercel.app');
  addParagraph('System mein secure role-based login screen mojood hai. Kisi bhi device (Mobile, Laptop, Tablet) se website open karein aur mandarja zail credentials se login karein:');
  
  addBox('Pre-configured User Login Accounts', [
    '1. Administrator:   Username: admin         Password: admin123   (Full System Access & Delete)',
    '2. Operations:      Username: ops           Password: ops123     (Shipments, Containers & Documents)',
    '3. Accounts:        Username: accounts      Password: accounts123(Buying/Selling Charges & Profit)',
    '4. Sales:           Username: sales         Password: sales123   (Customer Masters & Selling Rates)',
    '5. Management:      Username: management    Password: management123(KPI Dashboard & Profit Reports)',
    '* Note: Login screen par neeche "Quick 1-Click Role Login" buttons bhi hain jahan 1-click se login ho jata hai.'
  ]);

  // Section 2: Master Data
  addSectionHeader('2. Master Data Kahan Aur Kese Add Karein? (Step-by-Step)', 'Section 9 of Requirements Blueprint');
  addParagraph('Shipment banane se pehle Masters mein data hona zaroori hai taake naye job mein unhein select kiya ja sakay:');

  addSubHeader('A. Customer Master (Parties / Clients)');
  addParagraph('Left Menu se "Customers Master" par click karein. Upar "+ Add New Record" button dabayein:');
  addParagraph('Field 1: Customer Name (e.g. Atlas Logistics International)', true);
  addParagraph('Field 2: NTN / STRN (e.g. 1234567-8 / STRN-9988)', true);
  addParagraph('Field 3: Contact Person, Phone & Email', true);
  addParagraph('Field 4: Payment Terms (e.g. 30 Days Net, Advance)', true);
  addParagraph('Field 5: Credit Limit (e.g. PKR 5,000,000)', true);

  addSubHeader('B. Shipper Master (Origin Exporters / Factory)');
  addParagraph('Left Menu se "Shippers Master" par click karein. "+ Add New Record" par click karke Shipper Name (e.g. Al-Karam Textile Mills), Phone, aur City darj karein.');

  addSubHeader('C. Consignee Master (Destination Receivers / Importers)');
  addParagraph('Left Menu se "Consignees Master" par click karein. Foreign buyer name (e.g. EuroTex Fashion GmbH, Hamburg), Email aur City save karein.');

  addSubHeader('D. Vendor Master (Shipping Lines & Port Terminals)');
  addParagraph('Left Menu se "Vendors Master" par click karein. Shipping Lines (Maersk Line, Hapag-Lloyd) aur Terminals (QICT, KICT, Customs Agent) add karein.');

  addSubHeader('E. Ports Master (POL & POD Routes)');
  addParagraph('Left Menu se "Ports Master" par click karein. Port Code (e.g. PKKHI, AEDXB, DEHAM), Name (Port Qasim, Jebel Ali) aur Type (SEA / AIR) add karein.');

  // Section 3: Add New Shipment
  addSectionHeader('3. Nayi Shipment / Job File Kese Add Karein? (Detailed Guide)', 'Section 2 & 6.2 of Requirements Blueprint');
  addParagraph('Top Right par neelay rang ke "+ New Job" button par click karein. Nayi shipment modal khulay ga:');

  addBox('Shipment Creation Steps (Mandatory Fields)', [
    'Step 1: Date, Mode (Sea/Air/Road) aur Job Type (Export/Import) select karein.',
    'Step 2: Customer, Shipper aur Consignee ko dropdown se select karein.',
    'Step 3: MBL (Master Bill of Lading), HBL (House B/L) aur Booking Number darj karein.',
    'Step 4: Vessel Name, Voyage Number, POL (Port of Loading) aur POD (Port of Discharge) chunein.',
    'Step 5: Commodity / Cargo Description (e.g. 100% Cotton Garments) aur Weight/CBM likhein.',
    'Step 6: "Create Job File" dabayein. Auto Job Number (e.g. JOB-2026-004) generate ho jayega!'
  ]);

  // Section 4: Costing & Profit
  addSectionHeader('4. Container Grid, Buying/Selling Charges & Auto Profit', 'Section 3 & 7 of Requirements Blueprint');
  addParagraph('Naya Job banne ke baad ya Job Register se kisi bhi job par click karne se uski "Complete Job File" khul jati hai:');

  addSubHeader('A. Container Details Grid (Tab 2)');
  addParagraph('Container Type (20 FT, 40 FT, 40 HC, 45 HC, LCL/CBM), Container Number, Quantity, CBM aur Gross Weight darj karein. Multiple containers ke rows add/delete kiye ja sakte hain.');

  addSubHeader('B. Multi-Charge Costing Model (Tab 3)');
  addParagraph('System single amount par munhasir nahi hai, balki multiple cost aur revenue charge lines support karta hai:');
  addParagraph('Buying Charges (Vendor Costs): Ocean Freight, THC, Documentation, Customs clearance. Har line mein Vendor, Rate, Qty, Currency aur Ex Rate enter karein.', true);
  addParagraph('Selling Charges (Client Revenue): Client ko bill kiye gaye freight aur local charges enter karein.', true);

  addBox('Automatic Profit Calculation Rule (Section 3)', [
    '• FORMULA: PROFIT = TOTAL SELLING REVENUE - TOTAL BUYING COST',
    '• MARGIN % = (PROFIT / TOTAL SELLING) * 100',
    '• Auto Recalculation: Kisi bhi charge ke tabdeel hote hi Profit foran live update hota hai.',
    '• Tamper Protection: Normal user profit ko manually edit nahi kar sakta.'
  ]);

  // Section 5: Workflow Stepper
  addSectionHeader('5. 9-Stage Job Workflow Lifecycle & Profit Lock', 'Section 8 & 16 of Requirements Blueprint');
  addParagraph('Har Job File ke top par 9-stage visual stepper hai:');
  addParagraph('NEW -> BOOKED -> DOCUMENTATION -> IN TRANSIT -> ARRIVED -> DELIVERED -> INVOICED -> COST COMPLETED -> CLOSED');
  addParagraph('Profit Lock Feature: Jab job "CLOSED" status par muntaqil hota hai, to tamam buying/selling charges aur profit lock ho jate hain taake ghair-mutaliqa tabdeeli na ho sakay. Reopen karne ke liye Administrator role darkar hota hai.');

  // Section 6: Smart Warnings
  addSectionHeader('6. Smart Operational Warnings & Alerts', 'Section 16 & 20 of Requirements Blueprint');
  addParagraph('System operational ghaltiyan rokne ke liye automatic alerts deta hai:');
  addParagraph('1. Duplicate MBL/HBL Alert: Agar koi bill number pehle se kisi job mein darj ho to foran warning aati hai.', true);
  addParagraph('2. Missing Cost Alert: Agar selling revenue darj ho magar buying cost PKR 0 ho to alert flag lag jata hai.', true);
  addParagraph('3. Low Margin Warning: Agar job ka profit margin 10% se kam ho to peela alert trigger hota hai.', true);

  // Section 7: Reports
  addSectionHeader('7. Reports & Excel/PDF Exporting', 'Section 11 & 12 of Requirements Blueprint');
  addParagraph('Left Menu se "Reports & Profitability" par click karein:');
  addParagraph('1. Job-wise Profitability Register (Complete shipment-wise profit breakdown)', true);
  addParagraph('2. Customer-wise Profit Summary (Customer account profitability analysis)', true);
  addParagraph('3. Trade Lane / Route Profitability (POL -> POD route performance)', true);
  addParagraph('1-Click Excel Export: "Excel Export" button dabate hi asli structured .xlsx spreadsheet download ho jati hai.', true);
  addParagraph('1-Click PDF Export: "PDF Export" button dabate hi formatted audit PDF download ho jati hai.', true);
  addParagraph('Individual Job File PDF: Job File ke andar "Print / PDF Job File" button se single shipment ka mukammal print nikalta hai.', true);

  // Section 8: Clear Demo Data
  addSectionHeader('8. Demo Data Khatam Karke Asli Entry Kese Shuru Karein?', 'Zero-Error Testing Process');
  addBox('Clean Slate / Fresh Start Instructions', [
    '1. Live site kholein: https://freightproject.vercel.app/',
    '2. "Jobs / Shipments" register page par jayein.',
    '3. Top right par "Clear Demo Data" (Trash icon) button dabayein aur OK karein.',
    '4. Sara sample data foran clear ho jayega aur register 0 ho jayega.',
    '5. Ab "+ Add New Job" daba kar apni asli shipments ki entry start karein!',
    '6. Data us shakhs ke computer / browser mein hamesha safe aur save rahega.'
  ]);

  // Page numbering on all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 15, pageHeight - 8);
    doc.text('Confidential • Freight Forwarding Management System Manual', margin, pageHeight - 8);
  }

  const outputPath = path.resolve('../Freight_Forwarding_System_User_Guide.pdf');
  const buffer = Buffer.from(doc.output('arraybuffer'));
  fs.writeFileSync(outputPath, buffer);
  console.log('Successfully generated PDF at:', outputPath, 'Size:', buffer.length);
}

buildUserGuide();
