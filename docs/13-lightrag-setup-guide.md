# 13 — LightRAG Setup & Integration Guide

> **How do we deploy and configure the LightRAG engine to serve as the mathematical backbone of our Company Brain, while storing everything in Aurora PostgreSQL?**

---

This document outlines the setup process for **LightRAG** based on the official repository constraints, specifically tailored for our "Shared Database" architecture with `eve` and Aurora PostgreSQL.

## 1. Deployment Architecture

LightRAG must run as a standalone API service alongside our TypeScript `eve` framework. 

There are two recommended ways to deploy the LightRAG server:

### Option A: Docker Compose (Recommended for Local Dev)
LightRAG provides a native Docker Compose setup which is ideal for spinning up the API alongside a local Postgres container for testing.
```bash
git clone https://github.com/HKUDS/LightRAG.git
cd LightRAG
cp env.example .env 
# Configure .env with LLM keys and Postgres URIs
docker compose up
```

### Option B: Native Python (Using `uv`)
For a more bare-metal deployment, LightRAG recommends using `uv` for fast package management.
```bash
uv tool install "lightrag-hku[api]"
cp env.example .env
lightrag-server
```

## 2. PostgreSQL Configuration

LightRAG recently introduced **PostgreSQL as an all-in-one storage solution** (as of v1.0.3+). This perfectly matches our constraints. We do not need a separate vector database or graph database; Postgres handles everything.

You must configure LightRAG to use the three Postgres storage adapters:
1. **`PGVectorStorage`**: Uses the `pgvector` extension. This will store the raw chunks and embeddings extracted from Slack/Linear.
2. **`PGKVStorage`**: Uses Postgres `JSONB` columns. This stores the schema-less metadata and document structures (the pure induction layer).
3. **`NetworkXStorage`**: Due to a strict limitation where **AWS Aurora PostgreSQL does not support the Apache AGE extension**, we cannot use `PGGraphStorage`. Instead, we fallback to NetworkX, which stores the physical graph map locally in the workspace directory as a `.graphml` file, while Postgres continues to handle all heavy vector operations.

*Prerequisite: Your Aurora Postgres instance MUST have the `pgvector` extension enabled.*

## 3. Integrating with `eve`

Once the LightRAG server is running (defaulting to `0.0.0.0`), it exposes a REST API. We will bridge the Node.js `eve` agents to this API.

### The Ingestion Flow
1. **Eve Captures Event:** A Slack webhook triggers an `eve` agent.
2. **Drop to Inbox:** `eve` saves the raw payload to an `events_inbox` table in Postgres.
3. **Trigger LightRAG:** `eve` makes an HTTP POST request to the LightRAG API's `/insert` endpoint with the new text. LightRAG runs the LLM extraction and atomically updates the Graph and Vector tables in Postgres.

### The Retrieval Flow (GraphRAG)
When an `eve` agent needs to recall complex memory:
1. It calls a custom tool `query_organizational_memory`.
2. This tool sends an HTTP POST to LightRAG's `/query` endpoint.
3. LightRAG performs its **Dual-Level Retrieval**: 
   - Low-level: Exact keyword/vector matching.
   - High-level: Multi-hop graph traversal.
4. LightRAG returns the synthesized context, which `eve` injects into its working memory to complete the OODA loop.

---

### Next Steps for Implementation
If you are setting up the instance, please ensure:
1. The Postgres database has `CREATE EXTENSION vector;` executed.
2. The LightRAG `.env` is configured to point its storage backends entirely to the Postgres URI.
3. Let me know when the server is up, and I will write the `eve` adapter in TypeScript to begin pushing the Slack/Linear seed data into it!
