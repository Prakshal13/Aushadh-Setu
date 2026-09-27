# Aushadh Setu (औषध सेतु)
### Outbreak-Aware Medicine Intelligence & Redistribution Grid

> **Mission Statement:**  
> *"No patient in India should spend time, money, and hope traveling to a public health facility, only to be turned away because essential medicines were out of stock or expired on a distant shelf."*

---

## 1. Executive Summary & Problem Breakdown

### The Public Health Paradox in India
India operates one of the largest public healthcare facility networks in the world, spanning Sub-Centres, Primary Health Centres (PHCs), Community Health Centres (CHCs), Sub-District Hospitals (SDHs), and District Hospitals (DHs). Despite significant investments, drug supply chains suffer from a severe structural disconnect:

1. **Peripheral Stock-Outs:** Rural and peri-urban PHCs regularly face zero-inventory situations for vital antibiotics, anti-diabetic formulations, and anti-hypertensives. Patients are forced into catastrophic out-of-pocket private pharmacy expenditures (accounting for up to 60–70% of out-of-pocket healthcare costs in India) or drop out of chronic care regimens entirely.
2. **Central & Warehouse Expiries:** Concurrently, Comptroller and Auditor General (CAG) performance audits have documented crores of rupees worth of medicines (e.g., ₹6.57 crore across selected district warehouses in state audits) expiring unused before ever being issued to peripheral facilities.
3. **Surveillance–Supply Disconnect:** Disease surveillance (IDSP/IHIP) runs on a weekly reporting cycle tracking clinical syndromes and outbreaks, yet district drug stores procure and distribute supplies using rigid quarterly or annual historical averages. When monsoon-induced dengue or diarrhoeal waves strike, facilities run out of IV fluids and ORS within 48 hours.
4. **Logistical Blind Spots:** PHC A may be 12 km from PHC B, with PHC A facing a critical shortage of Metformin while PHC B holds batches of Metformin expiring in 45 days that it cannot consume in time. There is no automated, regulatory-compliant mechanism to detect this imbalance and recommend an authorized peer-to-peer rebalancing.

---

## 2. Platform Architecture: The 6 Core Pillars

```
                         [EXTERNAL FEEDS]
        🛰️ IMD / Earth Engine Climate Anomalies (Rainfall, Temp)
        📊 Weekly IDSP / IHIP Syndromic Disease Surveillance
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │     Vertex AI Predictive & Risk Engine       │
         │   • Syndromic-to-Commodity Correlation       │
         │   • Latent / Suppressed Demand Correction    │
         │   • Dual-Risk Matrix (Stock-out vs. Expiry)  │
         └──────────────────────┬───────────────────────┘
                                │
         ┌──────────────────────┴──────────────────────┐
         ▼                                             ▼
  [DISTRICT REDISTRIBUTION CORE]              [THREE TOUCHPOINTS]
  • Google Maps Distance Matrix               • 👨‍⚕️ Pharmacist: Camera OCR & Voice Log
  • Cold-Chain & Minimum Batch Rules          • 🏛️ DHO: Gemini Executive Copilot
  • Human-in-the-Loop DHO Approval            • 👥 Citizen: Public Medicine Finder Web
```

### Pillar 1: Multimodal, Frictionless Stock Logging (PHC Pharmacist)
* **Problem Solved:** Overburdened rural pharmacists cannot perform manual data entry for hundreds of batches daily.
* **Implementation:**
  * **Gemini Multimodal / Vertex AI Vision:** Pharmacist captures a photo of incoming medicine cartons or blister strips. The vision pipeline automatically extracts: Generic Name, Brand Name, Batch Number, Manufacturing Date, Expiry Date, and Pack Size into structured JSON.
  * **Quick Voice Logging:** Pharmacists can record short voice memos in regional languages (*"Today dispensed 60 packets of ORS and 30 strips of Paracetamol"*) via Cloud Speech-to-Text to update daily consumption.
  * **Offline-First PWA:** Operates locally on IndexedDB/Firebase during rural network blackouts and queues synchronization events until internet connectivity resumes.

### Pillar 2: Dual Early Warning (Climate Signals + IDSP Surveillance)
* **Pre-Surveillance Early Warning (IMD & Google Earth Engine):**
  * Monitors environmental precursors: rainfall spikes, surface water stagnation, and humidity anomalies that drive mosquito breeding.
  * Flags vulnerability 2–3 weeks *before* hospital admissions surge.
* **Epidemiological Integration (IDSP / IHIP):**
  * Ingests weekly district surveillance bulletins.
  * Maps syndromes to essential health commodities through a **Syndromic-to-Drug Matrix (SDM)**:
    * *Acute Diarrhoeal Disease (ADD)* $\rightarrow$ ORS sachets, Zinc 20mg tablets, Normal Saline (0.9% NaCl), Ringer Lactate (RL), Ciprofloxacin/Norfloxacin.
    * *Dengue / Chikungunya (Fever with Rash)* $\rightarrow$ Paracetamol tabs/suspension, IV Fluids, Platelet testing reagents.
    * *Acute Respiratory Infection (ARI)* $\rightarrow$ Amoxicillin, Azithromycin, Salbutamol inhalers, Paracetamol.

### Pillar 3: Latent Demand Forecasting & Dual-Risk Detection
* **Suppressed Demand Correction:** When stock reaches zero, OPD attendance for that illness drops. The Vertex AI model decouples demand from historical dispensing records, estimating true demand based on catchment population, seasonal indexes, and surveillance vectors.
* **Days of Stock Remaining (DSR):**
  $$\text{DSR} = \frac{\text{Usable Physical Stock}}{\text{Predicted Daily Consumption}}$$
* **Expiry Hazard Scoring (FEFO Enforcement):**
  $$\text{Expiring Surplus} = \text{Current Batch Stock} - (\text{Days to Expiry} \times \text{Expected Daily Consumption})$$
  Any positive balance indicates stock that will expire on the shelf unless transferred to a higher-volume facility.

### Pillar 4: Geospatial Redistribution & Transfer Engine
* **Matching Algorithm:** Pairs a donor facility (holding an imminent-expiry surplus) with a recipient facility (facing a projected stock-out).
* **Route & Constraint Optimization (Google Maps Platform):**
  * Evaluates travel distance, transit time, and rural road viability via Google Maps Distance Matrix.
  * Enforces **Cold-Chain Safeguards**: Vaccines (ARV), Anti-Snake Venom (ASV), and Insulin ($2\text{--}8^\circ\text{C}$) are restricted to refrigerated transport channels.
  * Consolidates peer-to-peer transfers into practical multi-stop loops (milk-runs).
* **Human-in-the-Loop Governance:** Every proposed transfer creates a cryptographically auditable dispatch recommendation on the District Health Officer's (DHO) approval desk. No medicine is moved without authorized human sign-off.

### Pillar 5: Autonomous Gemini Executive Copilot
* Daily automated synthesis for District Magistrates (DM), Chief Medical Officers (CMO), and DHOs.
* Generates concise, natural-language executive briefs prioritizing highest-impact interventions, explaining *why* an action is recommended, what clinical risks are averted, and which routes to activate.

### Pillar 6: Citizen Public Medicine Finder (Mobile-First Web Portal)
* **Goal:** Eradicate wasted patient travel and out-of-pocket costs.
* **Design:** Designed like an ATM/Fuel Finder—simple, fast, clean search by medicine name or illness keyword.
* **Citizen-Facing Data:**
  * Geolocation-sorted public health facilities.
  * Clear status indicators: 🟢 In Stock ($>3$ days stock), 🟡 Limited Stock ($1\text{--}3$ days stock), 🔴 Temporarily Out of Stock.
  * Facility working hours, medical officer on duty, and direct navigation links via Google Maps.

---

## 3. Technology Stack Architecture

| Layer | Technology / Service | Specific Role in Aushadh Setu |
| :--- | :--- | :--- |
| **Generative AI & Agents** | **Gemini 1.5 Flash / Pro API, Vertex AI Studio** | • Autonomous DHO Daily Executive Copilot<br>• Clinical rationale generation for redistribution orders |
| **Predictive Modeling** | **Vertex AI (AutoML & Time-Series)** | • 14-day dynamic medicine consumption forecasting<br>• FEFO expiry degradation calculations |
| **Vision & Multimodal** | **Gemini Multimodal / Vertex AI Vision** | • Blister pack, carton, and invoice OCR for batch/expiry extraction |
| **Language & Voice** | **Cloud Speech-to-Text, Translation API** | • Vernacular voice logging for rural pharmacists |
| **Geospatial & Climate** | **Google Maps Platform, Google Earth Engine** | • Maps: Routes API, Distance Matrix, multi-hop logistics<br>• Earth Engine: Satellite rainfall/water vector tracking |
| **Data Engine & Storage** | **BigQuery, Firebase Firestore, Cloud Storage** | • BigQuery: Analytical warehouse for multi-year disease & inventory logs<br>• Firebase: Real-time sync and offline caching |
| **Application Layer** | **Next.js / React, Tailwind CSS, Cloud Run** | • Unified web app hosting DHO Console, Pharmacist Scanner & Citizen Finder |

---

## 4. End-to-End Phased Implementation Plan

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AUSHADH SETU BUILD PHASES                             │
├───────────────┬───────────────────────────────┬─────────────────────────────┤
│ Phase         │ Focus Area                    │ Target Milestone            │
├───────────────┼───────────────────────────────┼─────────────────────────────┤
│ Phase 1       │ Data Models & Ingestion Core  │ Schemas, Datasets, OCR      │
│ Phase 2       │ Predictive & Risk Intelligence│ Forecasting, DSR, FEFO      │
│ Phase 3       │ Logistics & Redistribution    │ Maps Routing, Approval Flow │
│ Phase 4       │ Three Stakeholder Portals     │ DHO, Pharmacist, Citizen    │
│ Phase 5       │ Outbreak Simulation & Pitch   │ Demo Outbreak & CAG Metrics │
└───────────────┴───────────────────────────────┴─────────────────────────────┘
```

### Detailed Phase Breakdown:

#### **Phase 1: Data Foundations & Ingestion Core**
* **Database & Warehouse Setup:**
  * BigQuery dataset containing historical public datasets: National Essential Drugs List (NLEM), District Facility Master, and 52 weeks of synthetic IDSP syndromic data.
  * Firebase Firestore collections: `facilities`, `inventory_batches`, `consumption_logs`, `transfer_requests`, `surveillance_alerts`.
* **Multimodal Extraction Pipeline:**
  * Service endpoint connecting Gemini Multimodal to accept carton/strip photos.
  * Prompt engineering for high-accuracy extraction of Drug Name, Strength, Batch No, MFD, Expiry, and Unit Count.
* **Pharmacist Logging API:**
  * Endpoint for recording daily dispensing and receiving transactions with offline synchronization support.

#### **Phase 2: Predictive & Risk Intelligence Engine**
* **Syndromic-to-Drug Matrix (SDM):**
  * Algorithmic bridge linking weekly case spikes (Dengue, Diarrhoea, Malaria, Typhoid, ARI) to proportional drug consumption multipliers.
* **Consumption Forecasting (Vertex AI):**
  * Time-series model accounting for day-of-week trends, seasonal shifts, local population baselines, and epidemic curves.
* **Dual-Risk Calculator:**
  * DSR (Days of Stock Remaining) monitor flagging stock-outs when $\text{DSR} < \text{Replenishment Lead Time}$.
  * FEFO Expiry Risk calculator flagging batches where shelf life is shorter than projected consumption time.

#### **Phase 3: Redistribution & Geospatial Routing Engine**
* **Rebalancing Optimization:**
  * Linear programming / heuristic matching algorithm: selects optimal Donor PHC (surplus expiry risk) to Recipient PHC (stockout risk).
  * Enforces safety stock buffers: Donor facility never drops below 15 days of emergency reserve.
* **Geospatial Route Feasibility:**
  * Google Maps Distance Matrix integration: sorts viable donor facilities by driving distance and road transit time.
  * Cold-chain rule validation: checks if medicine requires $2\text{--}8^\circ\text{C}$ temperature controls.
* **Human-in-the-Loop Workflow:**
  * State transition machine: `DRAFT` $\rightarrow$ `RECOMMENDED` $\rightarrow$ `APPROVED_BY_DHO` $\rightarrow$ `IN_TRANSIT` $\rightarrow$ `RECEIVED_AND_VERIFIED`.

#### **Phase 4: Stakeholder Portals & AI Copilot**
* **1. DHO Command Dashboard:**
  * District GIS Map with color-coded facility health markers (Green, Amber, Red).
  * Gemini Autonomous Copilot: daily briefing cards summarizing impending stock-outs, expiring batches, and one-click transfer approvals.
* **2. Pharmacist Mobile Web App:**
  * Camera-driven batch intake scanner with instant preview.
  * Low-stock and near-expiry alerts with inbound transfer receipt verification.
* **3. Citizen Public Medicine Finder:**
  * Fast, clean, mobile-optimized search by medicine or condition.
  * Geolocation sorting of nearest facilities, stock status (In Stock / Limited / Out of Stock), and Google Maps turn-by-turn directions.

#### **Phase 5: Outbreak Simulation, Stress Testing & Presentation**
* **Interactive Outbreak Simulation Suite:**
  * A testbench feature allowing evaluators to simulate a 45% monsoon Dengue surge in Taluk North.
  * Live demonstration of the entire reactive chain:
    1. Early weather alert flags vector conditions.
    2. IDSP week 29 confirms syndromic surge.
    3. Vertex AI predicts stock-out of IV Fluids at PHC 4 within 3 days.
    4. System detects 500 expiring IV bags at District Store B.
    5. Google Maps routes the transfer; DHO approves in one click.
    6. Citizen portal updates to assure public availability.
* **Quantifiable Impact Metrics:**
  * Calculated monetary value of expired drugs rescued.
  * Total patient stock-out days averted.
  * Out-of-pocket patient expenses prevented.
