import pytest

@pytest.mark.asyncio
async def test_rag_query_leave(client):
    payload = {"query": "How many days of annual leave do I get?"}
    response = await client.post("/ai/v1/rag/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "20 days" in data["answer"]
    assert len(data["citations"]) > 0
    assert data["confidence"] > 0.8
    assert data["fallback_used"] is True

@pytest.mark.asyncio
async def test_rag_query_notice(client):
    payload = {"query": "What is the notice period for resignation?"}
    response = await client.post("/ai/v1/rag/query", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "60-day notice" in data["answer"]
    assert len(data["citations"]) > 0
