import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 120_000,
});

export const checkHealth = () => api.get("/health");

export const ingestLocal = (folder_path) =>
  api.post("/ingest/local", { folder_path });

export const ingestGithub = (github_url) =>
  api.post("/ingest/github", { github_url });

export const askQuestion = (question) =>
  api.post("/ask", { question });

export const resetStore = () => api.delete("/reset");
