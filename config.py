from dotenv import load_dotenv
import os

load_dotenv()

# ── Groq (Free LLM) ──────────────────────────────────────
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = "llama-3.1-8b-instant"  # free + fast

# ── Embeddings (Local, No API Key Needed) ────────────────
# CodeBERT: code-aware embeddings (best for this project)
EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

# Lightweight alternative if codebert is slow on your machine:
# EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5"

# ── Vector Store ─────────────────────────────────────────
CHROMA_DB_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_store")