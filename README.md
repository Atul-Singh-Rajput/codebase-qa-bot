# Codebase Q&A Bot

Ask questions about any Python codebase in plain English.
Built with **LangChain + Groq (free) + CodeBERT (free) + ChromaDB + FastAPI**.

---

## How It Works

```
GitHub Repo / Local Folder
        ↓
AST Parser → splits code by functions & classes (not tokens)
        ↓
CodeBERT Embeddings → code-aware vectors (runs locally)
        ↓
ChromaDB → stores vectors + metadata (file, function, lines)
        ↓
FastAPI Endpoint → receives your question
        ↓
Groq LLM (Llama 3.1) → answers with file + function + line numbers
```

---

## Project Structure

```
codebase-qa-bot/
├── ingestion/
│   ├── parser.py        # AST-based code chunker
│   ├── embedder.py      # CodeBERT embeddings
│   └── loader.py        # Walk folder or clone GitHub repo
├── retrieval/
│   ├── vectorstore.py   # ChromaDB setup
│   └── chain.py         # LangChain RAG chain
├── api/
│   └── main.py          # FastAPI routes
├── config.py            # Model config
├── test_connection.py   # Verify setup before building
├── .env.example         # Environment variables template
└── requirements.txt
```

---

## Setup

### 1. Clone & Create Virtual Environment
```bash
git clone <your-repo>
cd codebase-qa-bot
python -m venv venv
source venv/Scripts/activate   # Windows
# source venv/bin/activate     # Mac/Linux
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Set Up Environment Variables
```bash
cp .env.example .env
# Edit .env and add your free Groq API key
```

Get your **free** Groq API key at  https://console.groq.com (no credit card needed)

### 4. Test Your Connection
```bash
python test_connection.py
```
Both must pass before proceeding.

### 5. Run the Server
```bash
uvicorn api.main:app --reload
```

Open  http://127.0.0.1:8000/docs for Swagger UI

---

##  API Endpoints

### Index a local folder
```bash
POST /ingest/local
{ "folder_path": "./my_project" }
```

### Index a GitHub repo
```bash
POST /ingest/github
{ "github_url": "https://github.com/tiangolo/fastapi" }
```

### Ask a question
```bash
POST /ask
{ "question": "Where is the authentication logic?" }
```

### Reset vector store
```bash
DELETE /reset
```

---

## Example Questions

| Question | What the bot returns |
|---|---|
| Where is JWT token verified? | File + function + line numbers |
| How does the retry logic work? | Plain English explanation + code |
| Which functions call the database? | All DB-related functions across files |
| What does `process_payload()` do? | Summary of the function |
| Where are API keys used? | All files referencing credentials |

---

## Free Stack Used

| Component | Tool | Cost |
|---|---|---|
| LLM | Groq (Llama 3.1 8B) | Free |
| Embeddings | CodeBERT (HuggingFace) | Free |
| Vector DB | ChromaDB | Free |
| API | FastAPI | Free |

---

## Built With

- [LangChain](https://python.langchain.com/)
- [Groq](https://console.groq.com/)
- [HuggingFace Sentence Transformers](https://huggingface.co/)
- [ChromaDB](https://www.trychroma.com/)
- [FastAPI](https://fastapi.tiangolo.com/)


## Built With Love By
- [Atul Singh](https://www.linkedin.com/in/atulsingh2001)
