# 📘 Freight Forwarding Management System (FFMS)
## Complete Operational User Manual & Verification Guide Book

**Live Application Portal:** [https://freightproject.vercel.app/](https://freightproject.vercel.app/)  
**Document Architecture:** Job-Centric Freight Forwarding Operations

---

## 📑 Table of Contents
1. [Web Portal & System Login Credentials](#1-web-portal--system-login-credentials)
2. [Master Data Kahan Aur Kese Add Karein?](#2-master-data-kahan-aur-kese-add-karein)
3. [Nayi Shipment / Job File Kese Banayein?](#3-nayi-shipment--job-file-kese-banayein)
4. [Container Grid, Multi-Charge Costing & Auto Profit](#4-container-grid-multi-charge-costing--auto-profit)
5. [9-Stage Job Workflow Pipeline & Profit Lock](#5-9-stage-job-workflow-pipeline--profit-lock)
6. [Smart Operational Alerts & Safeguards](#6-smart-operational-alerts--safeguards)
7. [Reports & Excel / PDF Exporting](#7-reports--excel--pdf-exporting)
8. [Demo Data Khatam Karke Asli Entry Kese Karein?](#8-demo-data-khatam-karke-asli-entry-kese-karein)

---

## 1. Web Portal & System Login Credentials
Website Link: **[https://freightproject.vercel.app/](https://freightproject.vercel.app/)**

Jab bhi aap ya koi doosra shakhs website kholega, samne **Secure Login Screen** aayegi. Unke liye pre-configured accounts:

| Role (Ohda) | Username | Password | Purpose & Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin` | `admin123` | Full System Access, delete permissions & closed job override |
| **Operations** | `ops` | `ops123` | Shipments, Container grids, Milestones & Documents |
| **Accounts** | `accounts` | `accounts123` | Buying/Selling rates, costing, profit & invoices |
| **Sales** | `sales` | `sales123` | Customers, quotations & selling rates |
| **Management** | `management` | `management123` | Executive KPI dashboard & management reports |

*💡 Tip: Login screen par neeche **"Quick 1-Click Role Login"** ke buttons bhi mojood hain jin par click karne se username/password khud likh kar foran login ho jata hai.*

---

## 2. Master Data Kahan Aur Kese Add Karein?
Nayi shipment banane se pehle Master Data save karna hota hai taake job banate waqt sirf searchable dropdown se select karna paray:

### A. Customer Master (Parties / Clients)
* **Kahan milega:** Left menu $\rightarrow$ **"Customers Master"**
* **Kese add karein:** Top right par **"+ Add New Record"** dabayein.
* **Fields:** Customer Name, NTN/STRN, Address, City, Contact Person, Phone, Email, Payment Terms (e.g. 30 Days Net), Currency, Credit Limit.

### B. Shipper Master (Origin Exporters / Factory)
* **Kahan milega:** Left menu $\rightarrow$ **"Shippers Master"**
* **Kese add karein:** **"+ Add New Record"** par click karein aur Exporter Name (e.g. *Al-Karam Textile Mills*), Phone aur City enter karein.

### C. Consignee Master (Foreign Importers / Buyers)
* **Kahan milega:** Left menu $\rightarrow$ **"Consignees Master"**
* **Kese add karein:** **"+ Add New Record"** par click karein aur Destination Buyer (e.g. *EuroTex Fashion GmbH, Hamburg*), Phone, Email aur Address darj karein.

### D. Vendor Master (Shipping Lines & Port Terminals)
* **Kahan milega:** Left menu $\rightarrow$ **"Vendors Master"**
* **Kese add karein:** Shipping Lines (*Maersk, Hapag-Lloyd*), Port Terminals (*QICT, KICT*), ya Customs Agents ka record save karein.

### E. Ports Master (POL & POD Trade Lanes)
* **Kahan milega:** Left menu $\rightarrow$ **"Ports Master"**
* **Kese add karein:** Port of Loading (e.g. *Port Qasim, Karachi*) aur Port of Discharge (e.g. *Jebel Ali, Hamburg, New York*) add karein.

---

## 3. Nayi Shipment / Job File Kese Banayein?
Jab Master Data mojood ho, to Shipment add karna intehai aasan hai:

1. Top bar par neelay rang ke **"+ New Job"** button par click karein.
2. **Section 1 (Basic Info):** Date, Transport Mode (*Sea / Air / Road*), Direction (*Export / Import*), Booking Number.
3. **Section 2 (Parties):** Dropdown se Customer, Shipper aur Consignee select karein.
4. **Section 3 (Transport):** MBL Number, HBL Number, Vessel Name, Voyage No, POL, POD, ETD, ETA.
5. **Section 4 (Cargo):** Cargo Description (e.g. *100% Cotton Printed Garments*), Packages Count, Gross Weight (KG), Volume (CBM).
6. **"Create Job File"** click karein. Unique Auto Job Number (e.g. `JOB-2026-004`) generate ho jayega aur uski complete file khul jayegi!

---

## 4. Container Grid, Multi-Charge Costing & Auto Profit
Job File open hote hi aapke samne complete file aa jati hai:

### A. Container Grid (Tab 2)
* Container Type chunein: `20 FT Standard`, `40 FT Standard`, `40 HC (High Cube)`, `45 HC`, ya `LCL / CBM`.
* Container Number, Quantity, CBM aur Gross Weight darj karein.
* Multiple container rows add ya delete ki ja sakti hain.

### B. Buying & Selling Costing Sheet (Tab 3)
* **Buying Charges (Vendor Costs):**
  * Ocean Freight, THC, Documentation Fee, Customs Clearance waghaira add karein.
  * Vendor select karein, Quantity, Rate, Currency aur Exchange Rate enter karein.
* **Selling Charges (Client Revenue):**
  * Client ko bill kiye gaye freight aur local charges add karein.

### 💰 Automatic Profit Calculation Engine (Section 3):
$$\text{GROSS PROFIT} = \text{TOTAL SELLING REVENUE} - \text{TOTAL BUYING COST}$$
$$\text{PROFIT MARGIN \%} = \left(\frac{\text{PROFIT}}{\text{SELLING}}\right) \times 100$$
* **Auto-Recalculation:** Kisi bhi charge ke change hote hi Profit foran real-time calculate hota hai.
* **Security Lock:** Koi bhi normal user profit ko manually edit nahi kar sakta.

---

## 5. 9-Stage Job Workflow Pipeline & Profit Lock
Shipment lifecycle ko track karne ke liye har Job File ke upar 9-stage stepper diya gaya hai:
$$\text{NEW} \rightarrow \text{BOOKED} \rightarrow \text{DOCUMENTATION} \rightarrow \text{IN TRANSIT} \rightarrow \text{ARRIVED} \rightarrow \text{DELIVERED} \rightarrow \text{INVOICED} \rightarrow \text{COST COMPLETED} \rightarrow \text{CLOSED}$$

* **Profit Lock (Closed Job):** Jab status `CLOSED` par click kiya jata hai, to saari charges aur profit lock ho jati hain taake koi ghalti ya ghair-mutaliqa tabdeeli na ho sakay. Isko sirf Administrator re-open kar sakta hai.

---

## 6. Smart Operational Alerts & Safeguards
System operational ghaltiyon ko pakadne ke liye live alerts deta hai:
1. **Duplicate MBL/HBL Alert:** Agar entered MBL ya HBL kisi doosri shipment mein pehle se ho to laal warning banner aa jata hai.
2. **Missing Cost Alert:** Agar client se revenue bill kiya gaya ho magar Vendor Buying Cost 0 ho to alert flag lag jata hai.
3. **Low Margin Warning:** Agar profit margin 10% se kam ho to yellow warning show hoti hai.

---

## 7. Reports & Excel / PDF Exporting
Left Menu se **"Reports & Profitability"** par click karein:
* **Job-wise Profitability Register:** Har job ka Buying, Selling, Profit aur Margin ledger.
* **Customer-wise Profit Summary:** Kis customer se kitna profit hua.
* **Trade Lane (POL $\rightarrow$ POD) Profitability:** Kis route par zyada revenue ban raha hai.

### 📥 1-Click Export:
* **Excel Export:** `Excel Export` button se asli structured `.xlsx` spreadsheet download hoti hai.
* **PDF Export:** `PDF Export` button se professional printable PDF report download hoti hai.
* **Individual Job File PDF:** Kisi bhi Job File ke top par **"Print / PDF Job File"** click karne se us akayli shipment ka mukammal print download hota hai.

---

## 8. Demo Data Khatam Karke Asli Entry Kese Karein?
Agar wo shakhs bilkul clean / fresh register chahta hai:
1. [https://freightproject.vercel.app/](https://freightproject.vercel.app/) open karein.
2. Left menu mein **"Jobs / Shipments"** par click karein.
3. Top right par **"Clear Demo Data"** (laal trash icon) dabayein aur OK karein.
4. Pura demo data khatam ho jayega aur table khali ho jayegi.
5. Ab **"+ Add New Job"** daba kar apni asli shipments ki entry start karein!
6. Sara data unke computer / browser mein hamesha mefooz rahega.

---
*Generated strictly in accordance with Freight Forwarding Management System Requirements.*
