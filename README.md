# Aushadh Setu (औषध सेतु)
### Outbreak-Aware Medicine Intelligence & Redistribution Grid

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Google AI](https://img.shields.io/badge/Powered%20By-Google%20AI%20%26%20Vertex%20AI-4285F4)](https://cloud.google.com/vertex-ai)

> **Mission:** Preventing public healthcare stock-outs and eliminating expired drug waste across India's PHCs and District Warehouses by connecting disease surveillance (IDSP/IHIP) with real-time inventory rebalancing.

---

## 🚀 Quick Start Guide

### 1. Start Both Backend & Frontend Concurrently:
```bash
cd ~/Desktop/AushadhSetu
npm run dev
```

* **Frontend Web App:** [http://localhost:5173](http://localhost:5173)
* **Backend API Server:** [http://localhost:5001](http://localhost:5001)

### 2. (Optional) Connect Live Gemini 1.5 Flash API Key:
Create a `.env` file in the project root:
```env
PORT=5001
GEMINI_API_KEY=your_google_gemini_api_key_here
```
*(If no API key is provided, the platform automatically activates high-fidelity built-in simulators for Gemini Vision OCR and Copilot, allowing full offline testing without crashes.)*

---

## 🧩 What Has Been Built in Phase 1

1. **Realistic District Dataset (Pune District Pilot):**
   * **1 District Central Warehouse** (Aundh Central Drug Store)
   * **8 Primary Health Centres (PHCs)**: PHC Paud (Mulshi), PHC Shirur, PHC Junnar, PHC Chakan (Khed), PHC Baramati, PHC Bhor, PHC Wagholi (Haveli), PHC Daund.
   * **25 Essential NLEM Medicines**: Full clinical categories (Acute, Chronic NCD, Maternal, and High-Risk 2–8°C Cold Chain items like Anti-Snake Venom and Rabies Vaccine).
   * **Seeded CAG Audit Discrepancies**: Batches nearing expiry at central stores alongside acute shortages at peripheral PHCs.

2. **Multimodal Carton Scanner (Pharmacist Portal):**
   * Instant upload/capture of drug cartons and blister packs.
   * Powered by **Gemini 1.5 Flash Vision** to extract generic name, batch number, manufacturing date, expiry date, pack size, and cold-chain tags directly into structured JSON.
   * One-click verification and addition into the facility's live inventory.

3. **Daily Dispense Logger (Pharmacist Portal):**
   * Fast stock deduction for issued prescriptions.
   * Real-time FEFO (First-Expiry, First-Out) calculation and Days-of-Stock-Remaining (DSR) tracking.

4. **Public Citizen Medicine Finder (Web Portal):**
   * Lightweight, mobile-first search by medicine or condition (e.g., Paracetamol, ORS, Metformin, Snakebite).
   * Geolocation-sorted facility cards with clear status badges (🟢 In Stock, 🟡 Limited, 🔴 Out of Stock).
   * Working clinic hours, phone contact, and direct Google Maps directions.

5. **DHO Executive Command Desk & Outbreak Simulation:**
   * District-wide health overview displaying critical stockouts and rescuable expiry values.
   * Recharts visualization correlating weekly IDSP disease trends (Dengue, Diarrhoea) with rainfall anomalies.
   * Human-in-the-Loop peer-to-peer redistribution queue with one-click approval.
   * Outbreak Stress-Test Laboratory to simulate surges and verify system resilience.
