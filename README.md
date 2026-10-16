# Freight Forwarding Management System (FFMS)

A practical, job-centric web application for freight forwarding operations, shipment management, multi-currency costing, revenue and automatic profitability.

Built strictly according to **`Freight_Forwarding_Management_System_Requirements.docx`**.

---

## 🚀 Live Application URL
The development server is running live:
* **Local Web Interface:** [http://localhost:5173/](http://localhost:5173/)
* **Network Access:** Available across local Wi-Fi / LAN.

---

## 📋 Features Implemented

### 1. Job-Centric Architecture (Section 1 & 2)
* Central **Job File** connecting:
  * Customer, Shipper, Consignee
  * MBL, HBL, Booking Number, Vessel, Voyage
  * Port of Loading (POL) & Port of Discharge (POD)
  * ETD, ETA, Cargo Description, Weight, Volume
  * Container details grid (20', 40', 40 HC, CBM)
  * Buying Charges (Costs) & Selling Charges (Revenue)
  * Shipment Milestones Tracker
  * Digital Document Attachments
  * Audit Trail & Status Workflow

### 2. Automatic Profit Engine (Section 3 & 20)
* **Core Formula:**
  $$\text{PROFIT} = \text{TOTAL SELLING AMOUNT} - \text{TOTAL BUYING AMOUNT}$$
  $$\text{MARGIN \%} = \left(\frac{\text{PROFIT}}{\text{SELLING}}\right) \times 100$$
* Real-time recalculation whenever a buying or selling charge is added, edited, or removed.
* Direct manual editing of calculated profit is strictly blocked for data integrity.

### 3. Executive Dashboard (Section 6.1)
* 8 Real-time KPIs:
  1. **Total Jobs**
  2. **Open Jobs**
  3. **Total Buying Cost (PKR)**
  4. **Total Selling Revenue (PKR)**
  5. **Gross Profit (PKR)**
  6. **Profit Margin %**
  7. **This Month's Jobs**
  8. **This Month's Profit (PKR)**
* 9-stage Workflow Pipeline distribution chart.
* Recent jobs list with 1-click access to complete Job Files.

### 4. Advanced Job Register (Section 6.3 & 10)
* Search across Job Number, Customer, Shipper, MBL, HBL, POL, POD, Container Number, Vessel, and Commodity.
* Filters for Transport Mode (Sea, Air, Road), Type (Export, Import), Status, and Date Range.
* Column sorting and totals summary row.
* **1-Click Export to Microsoft Excel (`.xlsx`) & Adobe PDF (`.pdf`)**.

### 5. Multi-Role Security & Governance (Section 14 & 16)
* Role Switcher: **Administrator**, **Operations**, **Sales**, **Accounts**, **Management**.
* **Smart Alerts & Validations:**
  * **Duplicate MBL / HBL Warning:** Immediate warning banner if a bill number exists.
  * **Missing Cost Alert:** Flags jobs with revenue but zero recorded buying cost.
  * **Low Margin Alert:** Flags jobs with margin below 10%.
  * **Profit Lock:** Marking a job as `CLOSED` locks all financial charges; reopening requires Administrator privilege.
  * **Audit Log:** Captures user, timestamp, action, and changed data.

### 6. Master Data Management (Section 9)
* CRUD management with searchable tables for:
  * **Customer Master** (Code, Name, NTN/STRN, Address, Contact, Payment Terms, Credit Limit, Active/Inactive)
  * **Shipper Master**
  * **Consignee Master**
  * **Vendor & Shipping Line Master**
  * **Ports & Airports Master (POL / POD)**

### 7. Financial & Route Reports (Section 11 & 12)
* Job-wise Profitability Register
* Customer Account Profitability Breakdown
* Trade Lane & Route (POL $\rightarrow$ POD) Profitability
* Export any report directly to structured Excel or formatted PDF.

---

## 🛠️ How to Run Manually

```powershell
cd c:\Users\dell\Desktop\Freight_project\frontend
npm run dev
```
Open your browser at `http://localhost:5173/`.
