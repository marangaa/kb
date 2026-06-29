# Fasihi — The Living Computational Model of an Organization

> "Every software system built for organizations is built around a resource. Money, code, people, customers. But no system models the organization itself as a process rather than a state."

---

## 💡 The Inspiration & Philosophy

Traditional software treats companies as static lists of resources. We have double-entry accounting for money, HRIS for people, and CRMs for customers. But an organization is not a static inventory. An organization is a **living process** made of:
- A shared history of decisions and their consequences (the "why" behind what happened).
- Evolving beliefs about how to operate effectively.
- A network of relationships between people, systems, and concepts.

When people leave or teams shift, this context is lost. Traditional enterprise search tools fail because they only answer *"where is the document?"*, not *"why do we believe this?"* 

We built **Fasihi** to challenge the document-centric paradigm. Our philosophy is rooted in **pure induction**: the system does not enforce rigid schemas or pre-defined forms. Instead, it continuously ingests raw streams of communication and code, dynamically inducing the company's relationships, beliefs, and structure into a living GraphRAG network.

---

## 🛠️ What it Does

Fasihi is a real-time, event-sourced company brain that maps out your organization visually and programmatically:
1. **Interactive Chat Console:** Query the brain about decisions, tech choices, or team responsibilities. Fasihi doesn't just retrieve documents; it reasons across the graph to synthesize answers.
2. **Dynamic Document Ingestor:** A sliding drawer that supports uploading markdown/text files or selecting from pre-baked company guides. As documents are ingested, the graph canvas dynamically spins up clusters of entities.
3. **Live D3 Graph Visualization:** A real-time, force-directed graph canvas that maps out entities (People, Teams, Projects, Decisions) and their semantic relationships (e.g., `uses`, `decided_on`, `belongs_to`) as they are discovered.

---

## ⚙️ How We Built It

We built Fasihi with a highly decoupled, modern, and open stack:

- **Frontend (Next.js & TypeScript):** Designed with premium dark-mode aesthetics, responsive side-drawers, and a custom D3.js force-directed canvas that renders live node clusters and relationship lines.
- **Backend (Python FastAPI):** Built on the LightRAG framework, which uses LLMs to perform schema-less entity and relationship extraction on-the-fly.
- **Database (AWS Aurora PostgreSQL + pgvector):** We rejected proprietary graph/vector databases (like Neo4j or Milvus) to avoid vendor lock-in. Instead, we used a single, open-standard PostgreSQL database to store the knowledge graph and perform vector similarity searches using `pgvector` and recursive SQL CTEs.
- **Durable IAM Token Rotation:** Because AWS RDS IAM database authentication is strictly enforced, our Python backend runs an asynchronous background worker (`refresh_rds_tokens`) that automatically regenerates and updates connection pool tokens every 10 minutes, avoiding credentials expiration.

---

## 🚧 Challenges We Ran Into

- **The 15-Minute AWS Token Limit:** AWS RDS IAM database authentication tokens have a hardcoded 15-minute lifetime. For long-running servers and background ingestion jobs, this causes database connection failures. We solved this by modifying `asyncpg.Pool` connection arguments in-place via an asyncio worker, rotating tokens in the background without severing active connections.
- **Graph Clustering and UI Layouts:** Visualizing hundreds of dynamically induced nodes in a browser can cause rendering lag and visual clutter. We tuned the D3 force-directed parameters (charge strength, link distance) and grouped nodes by entity category to keep the visual map highly readable and performant.

---

## 🏅 Accomplishments That We're Proud Of

- Creating a **pure-induction** learning engine. Seeing Fasihi ingest simple guides and immediately cluster them into visual structures (e.g., grouping Safaricom under partners and identifying our tech stack choices) without any pre-defined templates felt magical.
- A fully secure, production-ready IAM database rotation mechanism that runs seamlessly locally (using AWS CLI profiles) and in production (using Render environment keys).

---

## 📚 What We Learned

- **Systems Thinking:** Exploring Stafford Beer's *Viable System Model (VSM)* and applying it to multi-agent architectures taught us how to model computational organization layers.
- **Semantic Graphs:** We learned that combining vectors and knowledge graphs (GraphRAG) provides significantly better reasoning capabilities than standard document chunk retrieval.

---

## 🔮 What's Next for Fasihi

- **Direct Event Listeners:** Implementing webhooks for Slack, Linear, and GitHub commits so Fasihi is fed automatically by everyday work events instead of manual uploads.
- **Belief Drift Detection:** Training agents to flag when team actions deviate from the company's established core beliefs (e.g., checking if a new service violates the "avoid Kubernetes" belief).
