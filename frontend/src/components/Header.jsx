import { useEffect, useState } from "react";
import { Bot, Activity } from "lucide-react";
import { checkHealth } from "../api";

export default function Header() {
  const [status, setStatus] = useState("checking"); // checking | online | offline

  useEffect(() => {
    checkHealth()
      .then(() => setStatus("online"))
      .catch(() => setStatus("offline"));
  }, []);

  const dot = {
    checking: "bg-yellow-400",
    online:   "bg-green-400",
    offline:  "bg-red-500",
  }[status];

  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#4f6ef7]/20 flex items-center justify-center">
            <Bot size={20} className="text-[#4f6ef7]" />
          </div>
          <div>
            <p className="font-semibold text-white leading-none">Codebase Q&A Bot</p>
            <p className="text-xs text-gray-500 mt-0.5">RAG · Groq · ChromaDB</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Activity size={14} className="text-gray-500" />
          <span className="text-gray-400">API</span>
          <span className={`w-2 h-2 rounded-full ${dot} ${status === "online" ? "animate-pulse" : ""}`} />
          <span className="text-gray-400 capitalize">{status}</span>
        </div>
      </div>
    </header>
  );
}
