# SmartEnergy AI – API Documentation

## 1. Overview

SmartEnergy AI is a web-based electricity bill analysis system that helps users upload and manage electricity bills, analyze consumption, predict future electricity usage, and view consumption insights.

**Backend:** Python, Flask
**Database:** SQLite
**Machine Learning:** Scikit-learn
**Frontend:** React.js and Vite

## 2. Base URL

```text
http://127.0.0.1:5000
```

Start the Flask backend before sending API requests.

## 3. API Endpoints

### 3.1 Home

**Endpoint:** `/`

**Method:** `GET`

Returns the application welcome message or basic application information.

**Example:**

```http
GET /
```

### 3.2 Health Check

**Endpoint:** `/api/health`

**Method:** `GET`

Checks whether the backend API is running.

**Example:**

```http
GET /api/health
```

### 3.3 Get All Bills

**Endpoint:** `/api/bills`

**Method:** `GET`

Retrieves the saved electricity bills from the database.

**Example:**

```http
GET /api/bills
```

### 3.4 Add a Bill

**Endpoint:** `/api/bills`

**Method:** `POST`

Adds a new electricity bill to the database.

**Content-Type:** `application/json`

**Example request:**

```json
{
  "month": "2026-01",
  "units": 180,
  "amount": 1450,
  "dueDate": "2026-01-20"
}
```

The exact field names must match the backend implementation.

### 3.5 Update a Bill

**Endpoint:** `/api/bills/<bill_id>`

**Method:** `PUT`

Updates an existing bill using its bill ID.

**Example:**

```http
PUT /api/bills/1
```

Send the updated bill details in the JSON request body.

### 3.6 Delete a Bill

**Endpoint:** `/api/bills/<bill_id>`

**Method:** `DELETE`

Deletes a saved bill using its ID.

**Example:**

```http
DELETE /api/bills/1
```

### 3.7 Upload an Electricity Bill

**Endpoint:** `/api/upload-bill`

**Method:** `POST`

Uploads an electricity bill file for processing. The backend bill parser may extract bill information from the uploaded file.

**Content-Type:** `multipart/form-data`

**Request:**

Select the bill file using the form-data field expected by the backend.

**Supported formats:** Refer to the formats accepted by the bill parser.

### 3.8 Predict Electricity Consumption

**Endpoint:** `/api/predict`

**Method:** `POST`

Uses the machine learning model to predict electricity consumption based on the input data accepted by the backend.

**Example request:**

```json
{
  "months": [1, 2, 3, 4, 5],
  "units": [180, 195, 210, 205, 230]
}
```

The actual request fields and response depend on the implementation in `backend/app.py`.

### 3.9 Get Prediction History

**Endpoint:** `/api/predictions`

**Method:** `GET`

Retrieves previously saved electricity consumption predictions.

**Example:**

```http
GET /api/predictions
```

### 3.10 Get Consumption Insights

**Endpoint:** `/api/insights`

**Method:** `GET`

Returns available electricity consumption insights and bill analytics.

**Example:**

```http
GET /api/insights
```

## 4. HTTP Status Codes

| Status Code | Description                              |
| ----------- | ---------------------------------------- |
| 200         | Request successful                       |
| 201         | Resource created, if returned by the API |
| 400         | Invalid or missing input                 |
| 404         | Resource or endpoint not found           |
| 500         | Internal server error                    |

Actual status codes depend on the backend implementation.

## 5. Database

The application uses SQLite to store electricity bills and prediction history.

Database location:

```text
backend/instance/smartenergy.db
```

The database is created automatically by the backend when configured to do so.

## 6. Machine Learning

The prediction endpoint uses a Scikit-learn Linear Regression model to estimate future electricity consumption from historical usage data.

Predictions are estimates and may differ from actual consumption.

## 7. Testing the API

The API can be tested using:

* A web browser for GET endpoints.
* Postman for GET, POST, PUT and DELETE requests.
* The React frontend for normal application operations.

Make sure the Flask backend is running before testing the endpoints.

## 8. Notes

* Start the backend before using the frontend.
* Provide valid input data when adding bills or requesting predictions.
* Do not upload confidential electricity bill information to a public repository.
* Confirm endpoint fields and response formats against the current backend source code before integrating external clients.
