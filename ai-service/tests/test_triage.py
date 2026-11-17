import pytest

@pytest.mark.asyncio
async def test_case_triage_payroll(client):
    payload = {
        "subject": "Delayed salary payment for October",
        "description": "My monthly salary has not been credited to my bank account. Urgent assistance needed."
    }
    response = await client.post("/ai/v1/cases/triage", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["suggested_category"] == "Payroll & Compensation"
    assert data["suggested_priority"] in ["HIGH", "URGENT"]
    assert data["sentiment"] == "NEGATIVE"
    assert data["suggested_routing"]["department"] == "Finance & Payroll"

@pytest.mark.asyncio
async def test_case_triage_it(client):
    payload = {
        "subject": "Laptop screen flickering",
        "description": "My external monitor and laptop display keep going black during calls."
    }
    response = await client.post("/ai/v1/cases/triage", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["suggested_category"] == "IT Support & Infrastructure"
    assert data["suggested_routing"]["department"] == "IT Infrastructure"
