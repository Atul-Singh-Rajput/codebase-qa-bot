import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { MessageSquare, Database } from "lucide-react";
import Header from "./components/Header";
import IngestPanel from "./components/IngestPanel";
import AskPanel from "./components/AskPanel";
import ResetPanel from "./components/ResetPanel";

const TABS = [
  { id: "ask",    label: "Ask",    icon: MessageSquare },
  { id: "ingest", label: "Ingest", icon: Database },
];

export default function App() {
  const [tab, setTab] = useState("ask");
  const [indexed, setIndexed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1f2937", color: "#f9fafb", border: "1px solid #374151" },
        }}
      />
      <Header />

      <div className="max-w-5xl mx-auto w-full px-6 py-8 flex-1 flex flex-col gap-8">
        {/* Hero */}
        <div>
          <h1 className="text-3xl font-bold text-white">
            Ask your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4f6ef7] to-purple-400">
              codebase
            </span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Index any Python project, then ask questions in plain English. Powered by RAG + Groq + ChromaDB.
          </p>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? "bg-[#4f6ef7] text-white shadow"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {tab === "ask" && <AskPanel indexed={indexed} />}
          {tab === "ingest" && (
            <div className="space-y-6">
              <IngestPanel onIngested={() => setIndexed(true)} />
              <ResetPanel />
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-xs text-gray-600 pb-4">
          Codebase Q&A Bot · LangChain · Groq llama-3.1-8b · BAAI/bge-small-en · ChromaDB
        </footer>
      </div>
    </div>
  );
}
