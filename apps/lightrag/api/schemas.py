from pydantic import BaseModel
from typing import Dict, Any

class IngestPayload(BaseModel):
    source: str # e.g. "slack", "linear"
    content: str
    metadata: Dict[str, Any] = {}

class QueryPayload(BaseModel):
    query: str
    mode: str = "hybrid" # naive, local, global, hybrid
