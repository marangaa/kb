# System Testing & Verification Guide

This guide provides step-by-step instructions to test and verify the entire **Kompany (Company Brain)** system, including the FastAPI backend, the Next.js frontend, database connectivity, and the GraphRAG pipeline.

---

## 1. System Verification & Health Checks

### Check Backend FastAPI Health
Verify that the Python FastAPI backend is running and listening on port `8020`:
```bash
curl http://127.0.0.1:8020/
```
*Expected Response:* A JSON payload indicating that the server is online or standard Swagger/API docs info.

### Check Graph serialization Endpoint
Verify that the LightRAG Graph storage is loaded and serving nodes:
```bash
curl http://127.0.0.1:8020/graph
```
*Expected Response:* A JSON object containing `"nodes"` and `"edges"` arrays.

### Check Next.js Frontend
Open your browser to:
`http://localhost:3000`
*Expected Result:* The split-screen dashboard loads showing a transparent floating chat interface on the left and the empty/initial SVG memory graph on the right.

---

## 2. Programmatic API Testing

You can interact with the Company Brain directly using `curl` to test its core functions.

### A. Ingest a New Document
To ingest new text into the memory graph programmatically:
```bash
curl -X POST http://127.0.0.1:8020/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "source": "manual-test",
    "content": "Fasihi has a newly established design laboratory in Mombasa, Kenya, led by James.",
    "metadata": {"author": "Richard", "created_at": "2026-06-29"}
  }'
```
*Expected Response:* `{"status": "success", "message": "Event ingestion started in the background."}`.

### B. Query the RAG Engine
To query the Company Brain memory using GraphRAG (hybrid query mode is default):
```bash
curl -X POST http://127.0.0.1:8020/query \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Where is Fasihi'\''s design laboratory and who leads it?",
    "mode": "hybrid"
  }'
```
*Expected Response:* A JSON payload containing the extracted answer.

---

## 3. Manual Interactive Demo Flow (Devpost Showcase)

Use this structured script to record your video demo or showcase the system's live capabilities to judges.

### Step 1: Start Clean
1. Clear the graph using the reset instructions in `walkthrough.md` if you want a blank canvas.
2. Load `http://localhost:3000`. You should see an empty chat state.

### Step 2: Establish the Foundation (Ingest about.md)
1. Click the paperclip attachment icon next to the chat text bar.
2. Select `docs/studio/about.md` and upload it.
3. The chat log will show that the document is being processed. 
4. Click the **Sync Graph** button in the top-right corner of the canvas.
5. *Verify:* You will see nodes representing `Fasihi`, `Nairobi`, `Kenya`, and `East Africa` pop up and link together!

### Step 3: Expand the Graph (Ingest team.md)
1. Click the paperclip icon and upload `docs/studio/team.md`.
2. Wait a few seconds for extraction to complete, then click **Sync Graph** again.
3. *Verify:* New nodes for `Richard`, `Sarah`, `James`, and `Amina` will appear, cleanly linked to the central `Fasihi` node!

### Step 4: Inject Capabilities (Ingest products.md)
1. Upload `docs/studio/products.md` via the uploader.
2. Sync the graph.
3. *Verify:* Product nodes like `Voiant`, `Resonate`, `Qualra`, and `FinnPesa` will appear. 
4. Notice that `Sarah` automatically connects to `Voiant` because the document noted her leadership on the voice suite.

### Step 5: Query the Brain
In the chat input bar, ask the brain:
> `"Who is James and what is he working on in Nairobi?"`

*Expected Answer:* The brain will reason across the ingested `team.md` and `about.md` nodes and return a markdown-formatted response explaining that James is a Frontend Engineer in Nairobi leading visual design systems, React layout implementation, and SVG visualizations.

---

## 4. Troubleshooting

*   **Nodes don't appear on upload:** Check the terminal running `main.py` in `apps/lightrag/`. Heavy entity extraction models can take 10-15 seconds to run. Wait a moment and click **Sync Graph** again.
*   **Database Errors:** Ensure your AWS region, credentials, and host parameters are correctly defined in `apps/lightrag/.env`.
