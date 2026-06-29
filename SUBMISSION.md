# Devpost Submission Details: H0 Hackathon

This document compiles all details and copy-paste descriptions needed for the **H0: Hack the Zero Stack** Devpost submission.

---

## 1. Project Overview

*   **Project Title:** Kompany (or Company Brain)
*   **Tagline:** Inductive AI Company Brain with Real-time Interactive Memory Graphs.
*   **GitHub Repository:** `https://github.com/` (replace with your repo URL)

### Architecture Diagram
```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [Next.js Web UI]
        Chat[Chat Interface]
        Upload[File Uploader - FileReader]
        Graph[D3.js Graph Canvas]
    end

    %% API / Gateway Layer
    subgraph Proxy [Next.js API Routes]
        API_Graph[/api/graph proxy]
    end

    %% Agent Layer
    subgraph EVE [EVE Agent Runtime]
        Agent[Induction Agent]
        Tool_Ingest[ingest_event tool]
        Tool_Query[query tool]
    end

    %% Backend Service
    subgraph FastAPI [FastAPI Python Server]
        Route_Ingest[/ingest endpoint]
        Route_Query[/query endpoint]
        Route_Graph[/graph endpoint]
        RAG[LightRAG Engine]
        NetX[NetworkXStorage - graph_chunk_entity_relation.graphml]
    end

    %% Database & Cloud Layer
    subgraph AWS [AWS Database & Cloud Services]
        Aurora[(AWS Aurora PostgreSQL)]
        Vector[pgvector Vector Indexes]
        KV[PGKVStorage - Document Chunks]
        IAM[IAM DB Authentication]
    end

    %% External LLMs
    subgraph AI [OpenAI LLMs & Embeddings]
        GPT[gpt-4o-mini]
        Embed[text-embedding-3-small]
    end

    %% Flows & Connections
    Upload -->|Local MD/TXT read| Chat
    Chat <-->|useEveAgent| Agent
    Graph <-->|D3 Force Poll| API_Graph
    API_Graph <-->|JSON Fetch| Route_Graph

    Agent -->|Execute Tool| Tool_Ingest
    Agent -->|Execute Tool| Tool_Query
    
    Tool_Ingest -->|async POST| Route_Ingest
    Tool_Query -->|POST| Route_Query

    Route_Ingest -->|asyncio.create_task| RAG
    Route_Query -->|aquery| RAG
    Route_Graph -->|Query _graph| NetX

    RAG <-->|Write/Read Triples| NetX
    RAG <-->|Fetch Embeddings| Embed
    RAG <-->|Extract Entities| GPT
    
    RAG <-->|Vector Store| Vector
    RAG <-->|KV Store| KV
    
    FastAPI <-->|SSL + IAM Auth| Aurora
```

---

## 2. Submission Copy-Paste Descriptions

### What it does
**Kompany** is a self-structuring, zero-configuration "Company Brain" built for modern organizations. Instead of maintaining rigid databases, Kompany ingests raw, unstructured documents (Markdown, text, notes) and inductively constructs an interactive **Organizational Memory Graph** in real-time. Judges or users can talk to the agent to query facts, search relations, or drag-and-drop team profiles and product briefs, watching new memory nodes instantly link and cluster on screen.

### How we built it
*   **Frontend (Vercel Stack):** Built using Next.js, React, and CSS. The layout uses a 35/65 split screen: a minimalist, header-free floating chat log on the left, and an interactive SVG force-directed graph canvas powered by `d3-force` on the right.
*   **AI & Knowledge Graph (LightRAG):** Powered by the LightRAG framework for rapid entity-relation extraction and incremental graph updates.
*   **Database (AWS Databases):** Utilizes **AWS Aurora PostgreSQL** (with `pgvector`) for vector embeddings similarity search, combined with local GraphML serialization for high-performance NetworkX graph rendering.
*   **Agent framework:** Orchestrated via the **EVE** framework for multi-agent coordination, tool-bindings, and session management.

### Challenges we ran into
*   **Snapping Canvas & State Closures:** Managing real-time graph polling (10s intervals) without resetting the active D3 simulation nodes. Fixed by migrating to functional React state updates to merge incoming updates with active coordinates.
*   **Entity Resolution Duplication:** Resolving similar but distinct entities (like "Fasihi" vs "Fasihi Studio") during multi-document ingestion. Aligned entity name structures in seed documents to resolve them into unified central nodes.
*   **FastAPI Ingestion Timeouts:** Initial document extractions took over 60 seconds, triggering client gateway timeouts. Converted ingestion routes to execute asynchronously using background threads (`asyncio.create_task`) with immediate status returns.

### Accomplishments we are proud of
*   A premium, Obsidian-style floating UI with grid background overlays and glowing radial lights.
*   Integrating client-side HTML5 `FileReader` with EVE tools so users can drop and ingest any text or markdown files dynamically.
*   Achieving sub-second UI updates on graph polling while running heavy entity extraction on AWS backend clusters.

---

## 3. Recommended Showcase / Demo Flow

1.  **Start fresh:** Boot the application at `http://localhost:3000`. You will see an empty chat state and a small starter graph representing early scraped info.
2.  **Ask a Question:** Ask the brain: `"What is Fasihi?"`
3.  **Upload Documents:** Click the paperclip button and upload Fasihi documents (`docs/studio/about.md`, `team.md`, `products.md`, `clients.md`, `tech_stack.md`).
4.  **Watch the Ingestion:** Note the loader pulse. The backend parses each file, runs entity-relation extraction, and writes nodes (like `Safaricom`, `Next.js`, `Amina`, `Voiant`) to the AWS database.
5.  **Real-time Graph Sync:** Click **Sync Graph** and watch the right-hand canvas dynamically expand, linking Safaricom to FinnPesa, Kenya Airways to Voiant, and Next.js to James.
6.  **Multi-Document Query:** Ask the brain: `"Which Fasihi products use Safaricom integrations, who leads that relationship, and what backend database do they run on?"`
7.  **Interactive Selection:** Hover over or click on any node to view its detailed relationship card.
