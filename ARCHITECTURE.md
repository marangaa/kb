# Kompany System Architecture

This document contains the core system architecture diagram for **Kompany (Company Brain)**.

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
