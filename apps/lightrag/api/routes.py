import asyncio
from fastapi import APIRouter, HTTPException
from core.config import rag
from api.schemas import IngestPayload, QueryPayload
from lightrag import QueryParam

router = APIRouter()

@router.post("/ingest")
async def ingest_event(payload: IngestPayload):
    """
    Called by the `eve` framework when a new event arrives.
    We append the metadata to the text so the LLM extracts it correctly into the Knowledge Graph.
    """
    formatted_text = f"[Source: {payload.source}]\n{payload.content}\n[Metadata: {payload.metadata}]"
    
    async def run_insert():
        try:
            await rag.ainsert(formatted_text)
        except Exception as e:
            import logging
            logging.error(f"Background ingest failed: {e}", exc_info=True)
            
    asyncio.create_task(run_insert())
    return {"status": "success", "message": "Event ingestion started in the background."}

@router.post("/query")
async def query_brain(payload: QueryPayload):
    """
    Called by the `eve` framework when it needs to recall memory using Graph RAG.
    """
    try:
        param = QueryParam(mode=payload.mode)
        result = await rag.aquery(payload.query, param=param)
        return {"answer": result}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/graph")
async def get_graph():
    try:
        g = rag.chunk_entity_relation_graph._graph
        nodes = []
        for node, data in g.nodes(data=True):
            nodes.append({
                "id": str(node),
                "label": str(node),
                "type": data.get("entity_type", "unknown"),
                "description": data.get("description", "")
            })
        edges = []
        for u, v, data in g.edges(data=True):
            edges.append({
                "source": str(u),
                "target": str(v),
                "description": data.get("description", ""),
                "keywords": data.get("keywords", ""),
                "weight": data.get("weight", 1.0)
            })
        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
