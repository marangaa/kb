# 12 — GraphRAG Engine Integration

> **How does the system dynamically cluster and traverse organizational knowledge without re-inventing the mathematical primitives?**

---

While the concept of "Pure Induction" dictates that we do not manually write TypeScript schemas for knowledge nodes (e.g., `Employee`, `Decision`, `Project`), we still need a highly optimized engine to execute the mathematical clustering, graph exploration, and vector similarities. Building this engine from scratch is an anti-pattern. 

We utilize an open-source **GraphRAG Engine** to handle the mathematical heavy lifting of schema-less knowledge extraction.

## The Constraints

The engine must conform to three rigid architectural constraints:
1. **Database:** Must support AWS Aurora PostgreSQL (specifically leveraging `pgvector` for embeddings and standard relational/JSONB capabilities for graph topology). It cannot rely on proprietary or disjointed databases (e.g., Neo4j, Milvus).
2. **Incremental Ingestion:** The engine must support rapid, incremental updates. The system observes the organization in real-time (Slack messages, Linear issues). Re-computing massive global community summaries (batch processing) on every new event is computationally unviable.
3. **Pure Induction:** The engine must support schema-less entity extraction using LLMs.

---

## The Selected Engine: LightRAG (or Fast-GraphRAG)

After evaluating Microsoft GraphRAG, Neo4j GraphRAG, LlamaIndex, and others, **LightRAG** and **Fast-GraphRAG** emerge as the only viable engines that meet all constraints.

- **Microsoft GraphRAG** is heavily penalized because its core design relies on batch-centric hierarchical community summarization, making incremental updates for streaming events prohibitively slow and expensive.
- **Neo4j GraphRAG** violates the Postgres database constraint.

**LightRAG** operates efficiently on incremental data by deferring complex reasoning to query time, utilizing a dual-level retrieval paradigm (local entity matching + high-level thematic expansion). 

Crucially, LightRAG natively supports PostgreSQL:
- `PGVectorStorage`: Chunk embeddings stored via `pgvector`.
- `PGKVStorage`: Schema-less raw documents stored in `JSONB`.
- **`NetworkXStorage` (Fallback for Graph)**: While LightRAG supports `PGGraphStorage`, it requires the **Apache AGE** extension. Because managed AWS Aurora PostgreSQL strictly prohibits the Apache AGE extension, the knowledge graph (nodes and edges) is stored using NetworkX (local GraphML files), while all vectors and chunks remain in Postgres.

---

## The Architecture: Bridging Node.js (`eve`) and Python (GraphRAG)

Because the leading GraphRAG engines are Python-native and the core organizational substrate (`eve`) is Node.js/TypeScript, we enforce a **Shared Database Pattern** centered on Aurora PostgreSQL.

### 1. Continuous Observation (`eve` / TypeScript)
The `eve` agents act as the sensory organs of the system. They maintain durable sessions, ingesting webhooks and streams from Slack, Linear, and Notion. `eve` does not perform the heavy induction; it simply records the raw, unstructured event into an `events_inbox` table in Postgres.

### 2. Pure Induction Engine (GraphRAG / Python)
A lightweight background Python worker listens to the `events_inbox` table. As new events arrive, the LightRAG engine:
1. Prompts the LLM to dynamically extract schema-less entities and relationships from the text.
2. Converts these into vector embeddings.
3. Atomically upserts the nodes, edges, and vectors back into Aurora Postgres.

### 3. Retrieval and Reasoning
When an `eve` agent needs to orient itself or answer a complex question, it invokes the GraphRAG Python engine via a standard REST or Model Context Protocol (MCP) tool. The GraphRAG engine performs the dual-level semantic + structural traversal over the Postgres data, returning a dense, contextually synthesized answer back to the `eve` reasoning loop.

This decoupled architecture perfectly insulates the TypeScript application layer from the heavy mathematical Python layer, while keeping all state transactionally safe inside a single Aurora Postgres instance.
