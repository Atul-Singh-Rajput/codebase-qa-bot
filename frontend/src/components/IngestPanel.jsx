import { useState } from "react";
import { FolderOpen, GitBranch, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { ingestLocal, ingestGithub } from "../api";

function Result({ data }) {
  if (!data) return null;
  return (
    <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
      <CheckCircle2 size={18} className="text-green-400 mt-0.5 shrink-0" />
      <div className="text-sm">
        <p className="text-green-300 font-medium">{data.message}</p>
        <p className="text-gray-400 mt-1">
          Source: <span className="text-gray-300 font-mono text-xs">{data.source}</span>
        </p>
        <p className="text-gray-400">
          Chunks indexed: <span className="text-white font-semibold">{data.chunks_indexed}</span>
        </p>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? "bg-[#4f6ef7]/20 text-[#4f6ef7] border border-[#4f6ef7]/40"
          : "text-gray-400 hover:text-gray-200 hover:bg-gray-800"
      }`}
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

export default function IngestPanel({ onIngested }) {
  const [tab, setTab] = useState("github");
  const [localPath, setLocalPath] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res =
        tab === "local"
          ? await ingestLocal(localPath)
          : await ingestGithub(githubUrl);

      setResult(res.data);
      toast.success(`Indexed ${res.data.chunks_indexed} chunks!`);
      onIngested?.();
    } catch (err) {
      const msg = err.response?.data?.detail || "Ingestion failed. Check the server.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-1">Index a Codebase</h2>
      <p className="text-sm text-gray-400 mb-5">
        Point to a local folder or a public GitHub repo to start indexing.
      </p>

      <div className="flex gap-2 mb-5">
        <TabButton
          active={tab === "github"}
          onClick={() => { setTab("github"); setResult(null); setError(null); }}
          icon={GitBranch}
          label="GitHub Repo"
        />
        <TabButton
          active={tab === "local"}
          onClick={() => { setTab("local"); setResult(null); setError(null); }}
          icon={FolderOpen}
          label="Local Folder"
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {tab === "github" ? (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">GitHub URL</label>
            <input
              className="input font-mono text-sm"
              placeholder="https://github.com/tiangolo/fastapi"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Folder Path</label>
            <input
              className="input font-mono text-sm"
              placeholder="./my_project  or  /absolute/path/to/project"
              value={localPath}
              onChange={(e) => setLocalPath(e.target.value)}
              required
            />
          </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <><Loader2 size={16} className="animate-spin" /> Indexing…</>
          ) : (
            <>{tab === "github" ? <GitBranch size={16} /> : <FolderOpen size={16} />} Index Codebase</>
          )}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-3">
          <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <Result data={result} />
    </div>
  );
}
