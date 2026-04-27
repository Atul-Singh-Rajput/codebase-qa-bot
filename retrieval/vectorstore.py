"""
vectorstore.py — ChromaDB setup (free, local vector store)

Handles storing and retrieving embedded code chunks.
Data persists on disk so you don't re-embed on every run.
"""

from langchain_community.vectorstores import Chroma
from langchain.schema import Document
from ingestion.embedder import get_embeddings
import config


def get_vectorstore() -> Chroma:
    """
    Returns an existing ChromaDB vectorstore from disk.
    Use this for querying after ingestion is done.
    """
    return Chroma(
        persist_directory=config.CHROMA_DB_PATH,
        embedding_function=get_embeddings()
    )


def store_documents(documents: list[Document]) -> Chroma:
    """
    Embeds and stores a list of Documents into ChromaDB.
    Persists to disk automatically.
    """
    embeddings = get_embeddings()
    vectorstore = Chroma.from_documents(
        documents=documents,
        embedding=embeddings,
        persist_directory=config.CHROMA_DB_PATH
    )
    print(f"✅ Stored {len(documents)} chunks in ChromaDB at {config.CHROMA_DB_PATH}")
    return vectorstore


def reset_vectorstore():
    """
    Clears the ChromaDB store completely.
    Useful when re-indexing a new repo.
    """
    import shutil
    import os
    if os.path.exists(config.CHROMA_DB_PATH):
        shutil.rmtree(config.CHROMA_DB_PATH)
        print(f"🗑️  Cleared ChromaDB at {config.CHROMA_DB_PATH}")