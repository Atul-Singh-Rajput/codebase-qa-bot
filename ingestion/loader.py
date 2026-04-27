import tempfile

import os
import shutil
import git
from ingestion.parser import extract_chunks_from_file
def force_remove_readonly(func, path, excinfo):
    """Fix for Windows/Linux read-only files during rmtree."""
    os.chmod(path, stat.S_IWRITE)
    func(path)

def clone_repo(github_url: str) -> str:
   
    dest = "/temp/temp_repo"
    if os.path.exists(dest):
        shutil.rmtree(dest, onexc=force_remove_readonly)
    print(f"📥 Cloning repo: {github_url}")
    git.Repo.clone_from(github_url, dest)
    print(f"✅ Cloned to {dest}")
    return dest


def load_chunks_from_folder(folder_path: str) -> list[dict]:
    """
    Walks a folder recursively, finds all .py files,
    and extracts code chunks using AST parser.
    """
    all_chunks = []
    py_files = []

    for root, _, files in os.walk(folder_path):
        # Skip hidden folders and common non-source folders
        if any(skip in root for skip in [".git", "__pycache__", ".venv", "venv", "node_modules"]):
            continue
        for file in files:
            if file.endswith(".py"):
                py_files.append(os.path.join(root, file))

    print(f"📂 Found {len(py_files)} Python files")

    for filepath in py_files:
        chunks = extract_chunks_from_file(filepath)
        all_chunks.extend(chunks)

    print(f"🧩 Extracted {len(all_chunks)} code chunks")
    return all_chunks


def load_from_github(github_url: str) -> list[dict]:
    """
    Clones a GitHub repo and loads all Python chunks from it.
    """
    folder = clone_repo(github_url)
    return load_chunks_from_folder(folder)