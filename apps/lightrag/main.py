import asyncio
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from core.config import rag
from api.routes import router

async def refresh_rds_tokens():
    import boto3
    import os
    
    aws_region = os.environ.get("AWS_REGION", "us-east-1")
    db_host = os.environ.get("POSTGRES_HOST", "kompany.cluster-cml688qeuggm.us-east-1.rds.amazonaws.com")
    db_port = int(os.environ.get("POSTGRES_PORT", 5432))
    db_user = os.environ.get("POSTGRES_USER", "postgres")
    
    while True:
        try:
            # Refresh every 10 minutes (RDS IAM token is valid for 15 minutes)
            await asyncio.sleep(600)
            logging.info("Refreshing AWS RDS IAM authentication tokens...")
            
            # Try generating a new IAM database authentication token via boto3
            try:
                client = boto3.client('rds', region_name=aws_region)
                auth_token = client.generate_db_auth_token(
                    DBHostname=db_host, 
                    Port=db_port, 
                    DBUsername=db_user, 
                    Region=aws_region
                )
            except Exception as auth_err:
                logging.debug(f"AWS RDS IAM token generation skipped/failed: {auth_err}")
                continue
            
            # Update password in active asyncpg pools
            updated = False
            for storage_name in ["kv_storage", "vector_storage", "doc_status_storage"]:
                storage = getattr(rag, storage_name, None)
                if storage and hasattr(storage, "db") and storage.db:
                    db = storage.db
                    if db.pool and hasattr(db.pool, "_connect_kwargs"):
                        db.pool._connect_kwargs["password"] = auth_token
                        updated = True
            
            if updated:
                logging.info("Successfully updated IAM token in active asyncpg pools.")
                
        except Exception as e:
            logging.error(f"Failed to refresh RDS IAM token: {e}", exc_info=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Postgres tables and connections on startup
    await rag.initialize_storages()
    
    # Start the token refresher background task
    refresher_task = asyncio.create_task(refresh_rds_tokens())
    
    yield
    
    # Cancel refresher on shutdown
    refresher_task.cancel()
    try:
        await refresher_task
    except asyncio.CancelledError:
        pass
        
    # Cleanup on shutdown
    await rag.finalize_storages()

app = FastAPI(title="Company Brain GraphRAG API", lifespan=lifespan)

# Include the endpoints
app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    # Exposing on port 8020
    uvicorn.run("main:app", host="0.0.0.0", port=8020, reload=True)
