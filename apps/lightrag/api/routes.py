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
    try:
        await rag.ainsert(formatted_text)
        return {"status": "success", "message": "Event ingested and graph updated."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/query")
async def query_brain(payload: QueryPayload):
    """
    Called by the `eve` framework when it needs to recall memory using Graph RAG.
    """
    try:
        param = QueryParam(mode=payload.mode)
        result = await rag.aquery(payload.query, param_or_dict=param)
        return {"answer": result}
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
