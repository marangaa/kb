# Devpost Submission Details: H0 Hackathon

This document compiles all details and copy-paste descriptions needed for the **H0: Hack the Zero Stack** Devpost submission.

---

## 1. Project Overview

*   **Project Title:** Kompany (or Company Brain)
*   **Tagline:** Inductive AI Company Brain with Real-time Interactive Memory Graphs.
*   **GitHub Repository:** `https://github.com/` (replace with your repo URL)

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
2.  **Ask a Question:** Ask the brain: `"What is Fasihi and what products do we build?"`
3.  **Upload Documents:** Click the paperclip button on the left of the input bar and upload `docs/studio/team.md` (or `about.md`).
4.  **Watch the Ingestion:** Point out the loader pulse. The backend will parse the uploaded file, run entity-relation extraction, and add nodes like `Richard (Studio Lead)`, `Sarah (Engineering Lead)`, and `Nairobi` to the database.
5.  **Real-time Graph Sync:** Watch the right-hand canvas automatically update and link the new nodes to the central `Fasihi` node!
6.  **Interactive Selection:** Hover over or click on any node to view its detailed relationship card.
