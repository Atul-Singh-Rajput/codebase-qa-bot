"""
main.py — FastAPI application

Endpoints:
  POST /ingest/local   → index a local folder
  POST /ingest/github  → clone + index a GitHub repo
  POST /ask            → ask a question about the codebase
  DELETE /reset        → clear the vector store
  GET  /health         → check if server is running
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ingestion.loader import load_chunks_from_folder, load_from_github
from ingestion.embedder import chunks_to_documents
from retrieval.vectorstore import store_documents, reset_vectorstore
from retrieval.chain import get_chain

app = FastAPI(
    title="Codebase Q&A Bot",
    description="Ask questions about any Python codebase using RAG + Groq + CodeBERT",
    version="1.0.0"
)

# Allow frontend / Postman access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request Models ────────────────────────────────────────────────────────────

class IngestLocalRequest(BaseModel):
    folder_path: str

    class Config:
        json_schema_extra = {
            "example": {"folder_path": "./my_project"}
        }


class IngestGithubRequest(BaseModel):
    github_url: str

    class Config:
        json_schema_extra = {
            "example": {"github_url": "https://github.com/pallets/flask"}
        }


class QuestionRequest(BaseModel):
    question: str

    class Config:
        json_schema_extra = {
            "example": {"question": "Where is the authentication logic?"}
        }


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health_check():
    """Check if the server is running."""
    return {"status": "✅ running", "model": "Groq llama-3.1-8b", "embeddings": "BAAI"}


@app.post("/ingest/local")
def ingest_local(body: IngestLocalRequest):
    """
    Index all Python files from a local folder path.
    Example: { "folder_path": "./my_project" }
    """
    chunks = load_chunks_from_folder(body.folder_path)

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No Python files found in the specified folder."
        )

    docs = chunks_to_documents(chunks)
    store_documents(docs)

    return {
        "message": f"✅ Successfully indexed {len(docs)} code chunks.",
        "source": body.folder_path,
        "chunks_indexed": len(docs)
    }


@app.post("/ingest/github")
def ingest_github(body: IngestGithubRequest):
    """
    Clone a public GitHub repo and index all Python files.
    Example: { "github_url": "https://github.com/user/repo" }
    """
    try:
        chunks = load_from_github(body.github_url)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to clone repo: {str(e)}"
        )

    if not chunks:
        raise HTTPException(
            status_code=400,
            detail="No Python files found in the repository."
        )

    docs = chunks_to_documents(chunks)
    store_documents(docs)

    return {
        "message": f"✅ Successfully indexed {len(docs)} code chunks from GitHub.",
        "source": body.github_url,
        "chunks_indexed": len(docs)
    }


@app.post("/ask")
def ask_question(body: QuestionRequest):
    """
    Ask any question about the indexed codebase.
    Example: { "question": "Where is JWT token verified?" }
    """
    try:
        chain = get_chain()
        answer = chain.invoke(body.question)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating answer: {str(e)}"
        )

    return {
        "question": body.question,
        "answer": answer
    }


@app.delete("/reset")
def reset():
    """
    Clear the entire vector store.
    Use this before indexing a new repo.
    """
    reset_vectorstore()
    return {"message": "🗑️ Vector store cleared. Ready to index a new codebase."}