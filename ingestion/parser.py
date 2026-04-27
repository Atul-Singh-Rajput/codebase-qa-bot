"""
parser.py — AST-based code chunker

Instead of splitting code by token count (like normal RAG),
this splits by logical units: functions and classes.

Each chunk includes enriched metadata so the LLM knows
exactly where in the codebase the answer came from.
"""

import ast
import os


def enrich_chunk(chunk: dict) -> dict:
    """
    Prepends a human-readable header to each code chunk.
    This helps the embedding model understand both the
    meaning AND the syntax of the code.
    """
    meta = chunk["metadata"]
    header = (
        f"File: {meta['file']}\n"
        f"Type: {meta['type']}\n"
        f"Name: {meta['name']}\n"
        f"Lines: {meta.get('start_line', '?')} to {meta.get('end_line', '?')}\n\n"
        f"Code:\n"
    )
    chunk["content"] = header + chunk["content"]
    return chunk


def extract_chunks_from_file(filepath: str) -> list[dict]:
    """
    Reads a Python file and extracts chunks at the function/class level
    using Python's built-in AST parser.

    Falls back to whole-file chunking if the file has syntax errors.
    """
    with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
        source = f.read()

    # Skip empty files
    if not source.strip():
        return []

    chunks = []

    try:
        tree = ast.parse(source)
    except SyntaxError:
        # Fallback: treat entire file as one chunk
        chunks.append({
            "content": source,
            "metadata": {
                "file": filepath,
                "type": "module",
                "name": os.path.basename(filepath),
                "start_line": 1,
                "end_line": len(source.splitlines())
            }
        })
        return [enrich_chunk(c) for c in chunks]

    lines = source.splitlines()

    for node in ast.walk(tree):
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef, ast.ClassDef)):
            start = node.lineno - 1
            end = node.end_lineno
            snippet = "\n".join(lines[start:end])

            node_type = (
                "function"
                if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef))
                else "class"
            )

            chunks.append({
                "content": snippet,
                "metadata": {
                    "file": filepath,
                    "type": node_type,
                    "name": node.name,
                    "start_line": node.lineno,
                    "end_line": node.end_lineno
                }
            })

    # If no functions/classes found, chunk whole file
    if not chunks:
        chunks.append({
            "content": source,
            "metadata": {
                "file": filepath,
                "type": "module",
                "name": os.path.basename(filepath),
                "start_line": 1,
                "end_line": len(lines)
            }
        })

    return [enrich_chunk(c) for c in chunks]