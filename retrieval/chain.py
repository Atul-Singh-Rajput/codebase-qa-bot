"""
chain.py — LangChain RAG chain using Groq (free LLM)

Flow:
  User Question
       ↓
  Retriever (ChromaDB) → top 5 similar code chunks
       ↓
  format_docs() → attach metadata labels to each chunk
       ↓
  Enriched Prompt → Groq LLM
       ↓
  Structured Answer with 
"""

from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableLambda
from langchain_core.output_parsers import StrOutputParser
from langchain.schema import Document
from retrieval.vectorstore import get_vectorstore
import config


def get_llm() -> ChatGroq:
    return ChatGroq(
        model=config.GROQ_MODEL,
        api_key=config.GROQ_API_KEY,
        temperature=0
    )


def format_docs(docs: list[Document]) -> str:
    """
    Formats retrieved code chunks with their metadata.
    This is critical — without this the LLM won't know
    which file or function each chunk belongs to.
    """
    if not docs:
        return "No relevant code chunks found."

    formatted = []
    for i, doc in enumerate(docs, 1):
        meta = doc.metadata
        block = (
            f"--- Chunk {i} ---\n"
            f"File  : {meta.get('file', 'unknown')}\n"
            f"Type  : {meta.get('type', 'unknown')}\n"
            f"Name  : {meta.get('name', 'unknown')}\n"
            f"Lines : {meta.get('start_line', '?')} - {meta.get('end_line', '?')}\n\n"
            f"Code:\n{doc.page_content}\n"
        )
        formatted.append(block)

    return "\n".join(formatted)


# ── Enriched Prompt ───────────────────────────────────────────────────────────
prompt = ChatPromptTemplate.from_template("""
You are an expert code assistant helping developers understand a codebase.
You will be given retrieved code chunks with metadata (file, function name, line numbers).

STRICT RULES:
1. ALWAYS mention the exact file name where the code lives
2. ALWAYS mention the function or class name
3. ALWAYS mention the line numbers
4. Explain what the code does in plain English
5. If multiple files/functions are relevant, list ALL of them
6. If the answer is not in the context, say exactly:
   "I couldn't find that in the indexed codebase. Try re-indexing or rephrasing."
7. NEVER make up file names, function names, or code that is not in the context

FORMAT YOUR ANSWER LIKE THIS:

---
 Location : <file_path> → <function_or_class_name> (lines X-Y)
 Explanation : <plain English explanation of what this code does>
 Relevant Code :
<paste the most relevant snippet here>
---

If multiple locations are relevant, repeat the block for each one.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RETRIEVED CODE CONTEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{context}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEVELOPER QUESTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{question}
""")


def get_chain():
    """
    Builds and returns the full RAG chain.
    """
    vectorstore = get_vectorstore()

    retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5}
    )

    llm = get_llm()

    chain = (
        {
            "context": retriever | RunnableLambda(format_docs),
            "question": RunnablePassthrough()
        }
        | prompt
        | llm
        | StrOutputParser()
    )

    return chain
