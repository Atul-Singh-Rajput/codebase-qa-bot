"""
Run this FIRST before building anything else.
If both tests pass, your setup is ready.

Usage:
    python test_connection.py
"""

from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_huggingface import HuggingFaceEmbeddings
import config

load_dotenv()


def test_llm():
    print("\n🔍 Testing Groq LLM...")
    try:
        llm = ChatGroq(
            model=config.GROQ_MODEL,
            api_key=config.GROQ_API_KEY,
            temperature=0
        )
        response = llm.invoke("Say hello in one line.")
        print(f"✅ LLM Working : {response.content}")
    except Exception as e:
        print(f"❌ LLM Failed  : {e}")


def test_embeddings():
    print("\n🔍 Testing HuggingFace Embeddings (first run downloads model ~200MB)...")
    try:
        embeddings = HuggingFaceEmbeddings(model_name=config.EMBEDDING_MODEL)
        vector = embeddings.embed_query("def hello(): pass")
        print(f"✅ Embeddings Working : Vector length = {len(vector)}")
    except Exception as e:
        print(f"❌ Embeddings Failed  : {e}")


if __name__ == "__main__":
    print("=" * 50)
    print("   CODEBASE Q&A BOT — CONNECTION TEST")
    print("=" * 50)
    test_llm()
    test_embeddings()
    print("\n✅ If both passed, run: uvicorn api.main:app")
    print("=" * 50)