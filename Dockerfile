FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Step 1 — Install CPU-only torch first (much smaller)
RUN pip install --no-cache-dir --timeout=1000 \
    torch==2.4.0+cpu \
    --extra-index-url https://download.pytorch.org/whl/cpu

# Step 2 — Install everything else
RUN pip install --no-cache-dir --timeout=1000 -r requirements.txt
RUN python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('BAAI/bge-small-en-v1.5')"
COPY . .

EXPOSE 8000

CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]