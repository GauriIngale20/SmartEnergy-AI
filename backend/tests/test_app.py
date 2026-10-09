import sys
from pathlib import Path

import pytest

BACKEND_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(BACKEND_DIR))

import app as backend_app


@pytest.fixture
def client():
    backend_app.app.config["TESTING"] = True

    with backend_app.app.test_client() as test_client:
        yield test_client


def test_home_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200


def test_get_bills_endpoint(client):
    response = client.get("/api/bills")
    assert response.status_code == 200


def test_get_predictions_endpoint(client):
    response = client.get("/api/predictions")
    assert response.status_code == 200


def test_get_insights_endpoint(client):
    response = client.get("/api/insights")
    assert response.status_code == 200


def test_create_bill_rejects_invalid_data(client):
    response = client.post(
        "/api/bills",
        json={
            "month": "invalid",
            "units": 100,
            "amount": 500
        }
    )

    assert response.status_code == 400


def test_create_bill_rejects_zero_units(client):
    response = client.post(
        "/api/bills",
        json={
            "month": "2026-09",
            "units": 0,
            "amount": 500
        }
    )

    assert response.status_code == 400


def test_prediction_rejects_invalid_months_ahead(client):
    response = client.post(
        "/api/predict",
        json={"months_ahead": 0}
    )

    assert response.status_code == 400


def test_prediction_rejects_non_json_request(client):
    response = client.post(
        "/api/predict",
        data="invalid request",
        content_type="text/plain"
    )

    assert response.status_code in (400, 415)