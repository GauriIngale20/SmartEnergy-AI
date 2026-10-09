@'
# SmartEnergy AI - Project Overview

## 1. Introduction

SmartEnergy AI is a web-based electricity bill analyzer that helps users
manage electricity bills, understand energy consumption, and estimate
future electricity usage.

The application combines web development, data processing, database
management, OCR-based bill extraction, and machine learning.

## 2. Problem Statement

Manually maintaining electricity bills and comparing monthly consumption
can be time-consuming. Users may find it difficult to identify changes
in usage or estimate their future electricity requirements.

SmartEnergy AI aims to simplify these activities through a centralized
web application.

## 3. Objectives

- Manage monthly electricity bill records.
- Upload and process supported electricity bill files.
- Analyze electricity units and bill expenses.
- Predict future consumption using Linear Regression.
- Maintain prediction history.
- Export bill records to Excel.

## 4. Main Features

### Bill Management
Users can add, view, update, and delete electricity bill records.

### Bill Upload
The application accepts supported CSV, PDF, and image files for
bill processing. Extraction results may require manual verification.

### Energy Insights
The backend calculates total bills, total units, total expenses,
average usage, average bill amount, and the highest-usage month.

### Consumption Prediction
Linear Regression estimates future electricity consumption from
historical monthly usage. At least three valid bill records are required.

### Excel Export
Users can export available bill records to an Excel workbook.

## 5. Technology Stack

- Frontend: React.js and Vite
- Backend: Python and Flask
- Database: SQLite
- Machine Learning: Scikit-learn Linear Regression
- Numerical Processing: NumPy
- API Communication: REST API and JSON
- Excel Export: SheetJS (xlsx)
- Bill Processing: File parsing and OCR

## 6. System Workflow

1. The user opens the web application.
2. The user adds bill details or uploads a supported bill.
3. The backend validates and processes the submitted information.
4. Bill records are stored in the SQLite database.
5. The backend calculates energy insights or predicts consumption.
6. Results are returned to the frontend.
7. The user can export available bill records to Excel.

## 7. Database

The application creates two SQLite tables:

- bills: stores month, units, amount, due date, and creation time.
- predictions: stores predicted units, prediction period, and creation time.

The default database file is created under backend/instance/.

## 8. Current Limitations

- Prediction quality depends on historical data.
- OCR may not extract every field correctly from every bill.
- Predictions are estimates and are not guaranteed future usage.
- Advanced alerts, PDF reports, and external provider integrations
  require separate implementation.

## 9. Future Scope

- Consumption anomaly detection.
- High-usage alerts and bill reminders.
- Improved forecasting models.
- Electricity-saving recommendations.
- PDF report generation.
- Secure user accounts and cloud deployment.

## 10. Conclusion

SmartEnergy AI demonstrates how web technologies, databases, data
analysis, OCR, Excel reporting, and machine learning can be combined
to support electricity bill management and consumption analysis.
'@ | Set-Content .\docs\project_overview.md