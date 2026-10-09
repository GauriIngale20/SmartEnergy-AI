
import os
import sqlite3
from datetime import datetime

import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.linear_model import LinearRegression

from services.bill_parser import parse_bill_file


# --------------------------------------------------
# Application Configuration
# --------------------------------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_DIR = os.path.join(BASE_DIR, "instance")
os.makedirs(DB_DIR, exist_ok=True)

DB_PATH = os.path.join(DB_DIR, "smartenergy.db")

app = Flask(__name__)
CORS(app)
app.config["JSON_SORT_KEYS"] = False
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024


# --------------------------------------------------
# Database Connection
# --------------------------------------------------

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def initialize_db():
    with get_db() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS bills (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                month TEXT NOT NULL,
                units REAL NOT NULL,
                amount REAL NOT NULL,
                due_date TEXT,
                created_at TEXT NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                predicted_units REAL NOT NULL,
                months_ahead INTEGER NOT NULL,
                created_at TEXT NOT NULL
            )
        """)


# --------------------------------------------------
# Bill Helpers
# --------------------------------------------------

def bill_dict(row):
    return {
        "id": row["id"],
        "month": row["month"],
        "units": row["units"],
        "amount": row["amount"],
        "dueDate": row["due_date"],
        "due_date": row["due_date"],
        "created_at": row["created_at"]
    }


def read_bill_payload(data):
    if not isinstance(data, dict):
        raise ValueError("Request body must be a JSON object.")

    month = str(data.get("month", "")).strip()

    if len(month) != 7 or month[4] != "-":
        raise ValueError("Month must use YYYY-MM format.")

    try:
        datetime.strptime(month, "%Y-%m")
        units = float(data.get("units", 0))
        amount = float(data.get("amount", 0))
    except (TypeError, ValueError):
        raise ValueError("Enter a valid month, units and amount.")

    if not np.isfinite(units) or not np.isfinite(amount):
        raise ValueError("Units and amount must be finite numbers.")

    if units <= 0 or amount <= 0:
        raise ValueError(
            "Units and amount must be greater than zero."
        )

    due_date = str(
        data.get("dueDate", data.get("due_date", ""))
    ).strip()

    if due_date:
        try:
            datetime.strptime(due_date, "%Y-%m-%d")
        except ValueError:
            raise ValueError(
                "Due date must use YYYY-MM-DD format."
            )

    return month, units, amount, due_date or None


# --------------------------------------------------
# Home and Health
# --------------------------------------------------

@app.get("/")
def home():
    return jsonify({
        "message": "SmartEnergy AI backend is running",
        "api": "/api/health"
    })


@app.get("/api/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "SmartEnergy AI API"
    })


# --------------------------------------------------
# Get All Bills
# --------------------------------------------------

@app.get("/api/bills")
def get_bills():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM bills ORDER BY month ASC, id ASC"
        ).fetchall()

    return jsonify([bill_dict(row) for row in rows])


# --------------------------------------------------
# Get One Bill
# --------------------------------------------------

@app.get("/api/bills/<int:bill_id>")
def get_bill(bill_id):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM bills WHERE id = ?",
            (bill_id,)
        ).fetchone()

    if row is None:
        return jsonify({"error": "Bill not found"}), 404

    return jsonify(bill_dict(row))


# --------------------------------------------------
# Create Bill
# --------------------------------------------------

@app.post("/api/bills")
def create_bill():
    try:
        month, units, amount, due_date = read_bill_payload(
            request.get_json(silent=True)
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    created_at = datetime.now().isoformat(timespec="seconds")

    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO bills
            (month, units, amount, due_date, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (month, units, amount, due_date, created_at)
        )

        row = conn.execute(
            "SELECT * FROM bills WHERE id = ?",
            (cursor.lastrowid,)
        ).fetchone()

    return jsonify(bill_dict(row)), 201


# --------------------------------------------------
# Update Bill
# --------------------------------------------------

@app.put("/api/bills/<int:bill_id>")
def update_bill(bill_id):
    try:
        month, units, amount, due_date = read_bill_payload(
            request.get_json(silent=True)
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM bills WHERE id = ?",
            (bill_id,)
        ).fetchone()

        if existing is None:
            return jsonify({"error": "Bill not found"}), 404

        conn.execute(
            """
            UPDATE bills
            SET month = ?, units = ?, amount = ?, due_date = ?
            WHERE id = ?
            """,
            (month, units, amount, due_date, bill_id)
        )

        row = conn.execute(
            "SELECT * FROM bills WHERE id = ?",
            (bill_id,)
        ).fetchone()

    return jsonify(bill_dict(row))


# --------------------------------------------------
# Delete Bill
# --------------------------------------------------

@app.delete("/api/bills/<int:bill_id>")
def delete_bill(bill_id):
    with get_db() as conn:
        cursor = conn.execute(
            "DELETE FROM bills WHERE id = ?",
            (bill_id,)
        )

    if cursor.rowcount == 0:
        return jsonify({"error": "Bill not found"}), 404

    return jsonify({
        "message": "Bill deleted",
        "id": bill_id
    })



# --------------------------------------------------
# Upload and Extract Bill Details
# --------------------------------------------------

@app.post("/api/upload-bill")
def upload_bill_file():
    uploaded = request.files.get("file")

    if uploaded is None or not uploaded.filename:
        return jsonify({"error": "Choose a bill file first."}), 400

    allowed = (".csv", ".pdf", ".jpg", ".jpeg", ".png", ".webp")

    if not uploaded.filename.lower().endswith(allowed):
        return jsonify({"error": "Unsupported file type."}), 400

    content = uploaded.read()

    if not content:
        return jsonify({"error": "The selected file is empty."}), 400

    if len(content) > 10 * 1024 * 1024:
        return jsonify({"error": "Maximum upload size is 10 MB."}), 413

    print(f"\nUPLOAD RECEIVED: {uploaded.filename}", flush=True)
    print(f"FILE SIZE: {len(content)} bytes", flush=True)

    try:
        print("Starting bill parser...", flush=True)

        result = parse_bill_file(uploaded.filename, content)

        print(f"PARSER RESULT: {result}", flush=True)

        return jsonify(result)

    except ValueError as exc:
        print(f"PARSER VALIDATION ERROR: {exc}", flush=True)
        app.logger.exception("Bill details could not be extracted")
        return jsonify({"error": str(exc)}), 400

    except Exception as exc:
        print(f"PARSER CRASH: {exc}", flush=True)
        app.logger.exception("Bill parsing failed")
        return jsonify({
            "error": f"Bill processing failed: {str(exc)}"
        }), 500

# --------------------------------------------------
# Predict Future Electricity Consumption
# --------------------------------------------------

@app.post("/api/predict")
def predict_usage():
    data = request.get_json(silent=True) or {}
    bills = data.get("bills", [])
    months_ahead = data.get("months_ahead", 1)

    if not isinstance(bills, list):
        return jsonify({
            "error": "Bills must be provided as a list."
        }), 400

    try:
        months_ahead = int(months_ahead)

        if months_ahead < 1 or months_ahead > 24:
            raise ValueError

    except (TypeError, ValueError):
        return jsonify({
            "error": "months_ahead must be between 1 and 24"
        }), 400

    try:
        clean_bills = []

        for bill in bills:
            if not isinstance(bill, dict):
                continue

            month = str(bill.get("month", "")).strip()
            units = float(bill.get("units", 0))

            if not month or not np.isfinite(units) or units <= 0:
                continue

            clean_bills.append((month, units))

        clean_bills.sort(key=lambda item: item[0])

    except (TypeError, ValueError, AttributeError):
        return jsonify({
            "error": (
                "Each bill must contain a valid month "
                "and positive units."
            )
        }), 400

    if len(clean_bills) < 3:
        return jsonify({
            "error": (
                "Add at least 3 valid monthly bills "
                "to predict usage."
            )
        }), 400

    x = np.arange(len(clean_bills)).reshape(-1, 1)
    y = np.array(
        [item[1] for item in clean_bills],
        dtype=float
    )

    model = LinearRegression().fit(x, y)

    future_x = np.array([
        [len(clean_bills) + months_ahead - 1]
    ])

    predicted_units = max(
        0.0,
        float(model.predict(future_x)[0])
    )

    created_at = datetime.now().isoformat(timespec="seconds")

    with get_db() as conn:
        conn.execute(
            """
            INSERT INTO predictions
            (predicted_units, months_ahead, created_at)
            VALUES (?, ?, ?)
            """,
            (round(predicted_units, 2), months_ahead, created_at)
        )

    return jsonify({
        "predicted_units": round(predicted_units, 2),
        "months_ahead": months_ahead,
        "method": "Linear Regression",
        "history_months": len(clean_bills)
    })


# --------------------------------------------------
# Prediction History
# --------------------------------------------------

@app.get("/api/predictions")
def prediction_history():
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM predictions ORDER BY id DESC"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


# --------------------------------------------------
# Energy Insights
# --------------------------------------------------

@app.get("/api/insights")
def energy_insights():
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT month, units, amount
            FROM bills
            ORDER BY month ASC
            """
        ).fetchall()

    bills = [dict(row) for row in rows]

    if not bills:
        return jsonify({
            "total_bills": 0,
            "total_units": 0,
            "total_amount": 0,
            "average_units": 0,
            "average_amount": 0,
            "highest_usage_month": None,
            "message": "Add electricity bills to see your insights."
        })

    total_units = sum(float(b["units"]) for b in bills)
    total_amount = sum(float(b["amount"]) for b in bills)

    highest = max(
        bills,
        key=lambda bill: float(bill["units"])
    )

    return jsonify({
        "total_bills": len(bills),
        "total_units": round(total_units, 2),
        "total_amount": round(total_amount, 2),
        "average_units": round(total_units / len(bills), 2),
        "average_amount": round(total_amount / len(bills), 2),
        "highest_usage_month": highest["month"],
        "highest_usage_units": highest["units"]
    })


# --------------------------------------------------
# Initialize Database and Start Server
# --------------------------------------------------

initialize_db()

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )

