# QuantumCash 3.0 (ICICI Enterprise Edition)

A brand-new, enterprise-grade corporate banking dashboard and predictive treasury simulator inspired by the ICICI Bank design ecosystem. 

QuantumCash 3.0 is a 100% self-contained React + TypeScript + Tailwind CSS Single-Page Application (SPA) built for zero-dependency client-side operations, featuring offline forecasting simulation and local state persistence.

---

## 🚀 Key Features

1. **ICICI Bank Design Language:** Implements corporate blue and white color schemes (`#003366`, `#0f4c81`), crisp interfaces, and premium micro-interactions.
2. **Strict Masked Data Privacy:** The global Eye Toggle hides all balances, deposits, investments, and loan figures behind `₹••••••` instantly.
3. **7-Day Predictive Cash Flow:** Analyzes ledger transaction histories dynamically, visualizes operational runways, and forecasts cash crunches.
4. **Dynamic Underwriting Letters:** Automatically drafts customized working capital micro-loan requests (for crunches) or expansion proposals (for stable accounts).
5. **Interactive Chatbot Treasurer:** Built-in Virtual Assistant ready to answer treasury, balance, and cash runway questions in real-time.
6. **Smart Budgeting Buckets:** Segment transactions into distinct categories, track spent percentages, and reclassify transactions.

---

## 🛠️ Architecture Breakdown

- `src/types.ts`: Domain models for user, accounts, transactions, deposits, investments, and projections.
- `src/utils.ts`: Includes `formatCurrency` masking logic and the ported 7-day predictive cash flow mathematical simulator.
- `src/context/AppContext.tsx`: Centralized React Context managing transaction logs, budget buckets, active segments, and `localStorage` persistence.
- `src/components/`: Sub-section layouts including `Login`, `Dashboard` (overview and tabs), `AccountsView`, `DepositsView`, `InvestmentsView`, `WhatIOweView`, and `AccountPredictiveDetail`.
- `netlify.toml`: Implements SPA routing redirects (`/*` -> `/index.html`) and strict enterprise HTTP security headers.

---

## 💻 Local Setup Instructions

We package a local portable Node.js runtime inside the project to allow compilation and testing without system-wide dependencies.

### Step 1: Prepend local Node to Path
Run the following inside PowerShell:
```powershell
$env:Path = 'c:\Users\Lalitha Subramanyam\Desktop\QC NEW\node_portable;' + $env:Path
```

### Step 2: Install Dependencies
```powershell
npm.cmd install
```

### Step 3: Run Development Server
```powershell
npm.cmd run dev
```

### Step 4: Run Tests
```powershell
npm.cmd run test
```

---

## ⚡ Netlify SPA Deployment

This repository is Netlify-ready. Simply link this project folder to your Netlify dashboard:
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Redirects & Headers:** Handled automatically via [netlify.toml](file:///netlify.toml).
