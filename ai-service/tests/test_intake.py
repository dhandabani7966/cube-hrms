import pytest

@pytest.mark.asyncio
async def test_resume_parse(client):
    payload = {
        "raw_text": "Alex Mercer, Senior Fullstack Engineer. Email: alex.mercer@example.com. Phone: +1-555-0199. 5 years of experience in React, TypeScript, Node.js, and PostgreSQL."
    }
    response = await client.post("/ai/v1/resume/parse", json=payload)
    assert response.status_code == 200
    data = response.json()
    profile = data["candidate_profile"]
    assert profile["email"] == "alex.mercer@example.com"
    assert "React" in profile["skills"]
    assert "TypeScript" in profile["skills"]
    assert profile["experience_years"] == 5.0
