"""
embedder.py — Embedding setup using HuggingFace (free, local)

Uses CodeBERT which is trained specifically on code —
much better than generic text embeddings for this use case.
"""

from langchain_huggingface import HuggingFaceEmbeddings
from langchain.schema import Document
import config


def get_embeddings() -> HuggingFaceEmbeddings:
    """
    Returns a HuggingFace embedding model.
    First run will download the model (~500MB), cached after that.
    """
    return HuggingFaceEmbeddings(
        model_name=config.EMBEDDING_MODEL,
        model_kwargs={"device": "cpu"},   # change to "cuda" if you have GPU
        encode_kwargs={"normalize_embeddings": True}
    )


def chunks_to_documents(chunks: list[dict]) -> list[Document]:
    """
    Converts raw parsed chunks into LangChain Document objects.
    Metadata is preserved so retrieval can return file + function info.
    """
    return [
        Document(
            page_content=chunk["content"],
            metadata=chunk["metadata"]
        )
        for chunk in chunks
    ]