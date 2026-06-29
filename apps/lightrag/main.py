from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.config import rag
from api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Postgres tables and connections on startup
    await rag.initialize_storages()
    yield
    # Cleanup on shutdown
    await rag.finalize_storages()

app = FastAPI(title="Company Brain GraphRAG API", lifespan=lifespan)

# Include the endpoints
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # Exposing on port 8020
    uvicorn.run("main:app", host="0.0.0.0", port=8020, reload=True)
