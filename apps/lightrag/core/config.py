import os
import boto3
from lightrag import LightRAG
from lightrag.llm.openai import gpt_4o_mini_complete, openai_embed
from lightrag.utils import EmbeddingFunc

WORKING_DIR = os.environ.get("LIGHTRAG_WORKSPACE", "./rag_workspace")
if not os.path.exists(WORKING_DIR):
    os.makedirs(WORKING_DIR)

# --- Database Authentication ---
# If a static password/token is provided (e.g. pasted into .env during local dev), use it.
# Otherwise, dynamically generate the IAM token using boto3 (e.g. in Production).
db_password = os.environ.get("POSTGRES_PASSWORD")
aws_region = os.environ.get("AWS_REGION", "us-east-1")
db_host = os.environ.get("POSTGRES_HOST", "kompany.cluster-cml688qeuggm.us-east-1.rds.amazonaws.com")
db_port = int(os.environ.get("POSTGRES_PORT", 5432))
db_user = os.environ.get("POSTGRES_USER", "postgres")

if not db_password:
    try:
        import logging
        key_id = os.environ.get("AWS_ACCESS_KEY_ID", "")
        masked_key = f"{key_id[:5]}...{key_id[-4:]}" if len(key_id) > 8 else "None"
        logging.info(f"Generating dynamic RDS IAM token using AWS Access Key: {masked_key}")
        
        client = boto3.client('rds', region_name=aws_region)
        auth_token = client.generate_db_auth_token(
            DBHostname=db_host, 
            Port=db_port, 
            DBUsername=db_user, 
            Region=aws_region
        )
        os.environ["POSTGRES_PASSWORD"] = auth_token
    except Exception as e:
        import logging
        logging.error("AWS RDS IAM Token Generation Failed: AWS credentials are expired or missing.")
        raise RuntimeError(
            "AWS credentials expired or missing. Please run 'aws sso login' in your terminal."
        ) from e

# AWS Aurora IAM auth requires SSL
os.environ["POSTGRES_SSL_MODE"] = "require"

# --- Initialize LightRAG ---
rag = LightRAG(
    working_dir=WORKING_DIR,
    llm_model_func=gpt_4o_mini_complete,
    embedding_func=EmbeddingFunc(
        embedding_dim=1536,
        max_token_size=8192,
        func=openai_embed,
        model_name="openai_text_embedding_3_small"
    ),
    kv_storage="PGKVStorage",
    vector_storage="PGVectorStorage",
    graph_storage="NetworkXStorage",
    doc_status_storage="PGDocStatusStorage"
)
