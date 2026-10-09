# ⚡ SmartEnergy AI – Electricity Bill Analyzer

SmartEnergy AI is a web-based application that helps users manage electricity bills, analyze monthly consumption, predict future electricity usage, and export bill reports to Excel.

## 🎯 Objectives

* Simplify electricity bill management.
* Extract bill details from uploaded files.
* Analyze electricity consumption and expenses.
* Predict future usage using Machine Learning.
* Generate Excel reports for record keeping.

## ✨ Features

* Upload electricity bills in CSV, PDF, JPG, JPEG, PNG, and WEBP formats.
* Extract available bill details using file parsing and OCR.
* Add, view, update, and delete bill records.
* Calculate total units, total expenses, and average consumption.
* Predict future electricity usage.
* View prediction history and energy insights.
* Export bill records to Excel.

## 🛠️ Technology Stack

| Component        | Technology                      |
| ---------------- | ------------------------------- |
| Frontend         | React.js, Vite                  |
| Backend          | Python, Flask                   |
| Database         | SQLite                          |
| Machine Learning | Scikit-learn, Linear Regression |
| Data Processing  | NumPy                           |
| API              | REST API, JSON                  |
| Excel Export     | SheetJS (`xlsx`)                |
| Bill Processing  | OCR and file parsing            |

## 📂 Project Structure

```text
SmartEnergy_AI/
├── backend/
│   ├── app.py
│   ├── services/
│   │   └── bill_parser.py
│   └── instance/
│       └── smartenergy.db
├── frontend/
│   ├── src/
│   └── package.json
├── data/
├── database/
├── docs/
├── integrations/
├── notebooks/
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Backend Setup

Open PowerShell in the project directory:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python app.py
```

The backend runs at `http://127.0.0.1:5000`.

### 2. Frontend Setup

Open another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

## 🤖 Machine Learning

SmartEnergy AI uses **Linear Regression** to estimate future electricity consumption from historical monthly usage data.

* Requires at least three valid monthly bill records.
* Supports prediction horizons from 1 to 24 months.
* Stores prediction results in the SQLite database.

Predictions are estimates and may differ from actual consumption.

## 🔌 API Endpoints

| Method | Endpoint           | Purpose                    |
| ------ | ------------------ | -------------------------- |
| GET    | `/api/health`      | Check backend status       |
| GET    | `/api/bills`       | Retrieve all bills         |
| POST   | `/api/bills`       | Add a bill                 |
| PUT    | `/api/bills/<id>`  | Update a bill              |
| DELETE | `/api/bills/<id>`  | Delete a bill              |
| POST   | `/api/upload-bill` | Upload and parse a bill    |
| POST   | `/api/predict`     | Predict future consumption |
| GET    | `/api/predictions` | View prediction history    |
| GET    | `/api/insights`    | View energy insights       |

## 🗄️ Database

The application uses SQLite to store electricity bill records and prediction history. The database and required tables are created automatically when the backend initializes.

## 📊 Excel Report

Users can export available electricity bill records into an Excel workbook named `smartenergy-bill-report.xlsx` for convenient offline access and record keeping.

## 🔐 Validation

The backend validates bill months, due dates, numerical values, prediction parameters, and uploaded file types. The maximum upload size is 10 MB.

## 🚀 Future Enhancements

* Advanced anomaly detection and high-consumption alerts.
* Improved prediction models and model evaluation.
* Electricity-saving recommendations.
* PDF report generation.
* Electricity provider integration.
* User authentication and cloud deployment.

These are proposed enhancements and are not claimed as completed features.

## 🎓 Project Purpose

SmartEnergy AI demonstrates the practical application of web development, database management, data analysis, OCR, Excel reporting, and Machine Learning for electricity consumption management.

**SmartEnergy AI — Understand Your Usage, Predict Future Consumption, and Manage Bills Smarter.**
