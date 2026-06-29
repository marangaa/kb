# 14 — LightRAG API Contract

> **This document defines the REST API contract exposed by the LightRAG Python worker for the `eve` TypeScript framework.**

## Base URL
`http://localhost:8020`

## 1. Ingest Event
Used by `eve` to push raw, unstructured data (Slack messages, Linear tickets) into the Company Brain. The GraphRAG engine will dynamically extract entities and relationships and cluster them into Postgres.

**Request:** `POST /ingest`
**Content-Type:** `application/json`

```json
{
  "source": "slack",
  "content": "We need to drop the DynamoDB migration and move fully to Aurora Postgres. The latency is killing us.",
  "metadata": {
    "channel": "engineering",
    "author": "Alice"
  }
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Event ingested and graph updated."
}
```

---

## 2. Query Memory (Graph RAG)
Used by `eve` agents (via a defined tool) to recall complex, multi-hop context from the organization's memory.

**Request:** `POST /query`
**Content-Type:** `application/json`

```json
{
  "query": "Why did we decide to drop DynamoDB, and who suggested it?",
  "mode": "hybrid" 
}
```
*(Modes: `naive` (vector only), `local` (entity specific), `global` (community themes), `hybrid` (vector + graph traversal).*

**Response:** `200 OK`
```json
{
  "answer": "According to the engineering channel logs, Alice suggested dropping DynamoDB and moving fully to Aurora Postgres due to latency issues."
}
```
