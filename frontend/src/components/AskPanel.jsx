import { useState } from "react";
import { Send, Loader2, Trash2, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { askQuestion } from "../api";
import AnswerBlock from "./AnswerBlock";

const SUGGESTIONS = [
  "Where is the authentication logic?",
  "Which functions call the database?",
  "How does the retry logic work?",
  "Where are API keys used?",
  "What does the main entry point do?",
];

export default function AskPanel() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const submit = async (q) => {
    const text = (q || question).trim();
    if (!text) return;
    setLoading(true);
    setQuestion("");
    try {
      const res = await askQuestion(text);
      setHistory((prev) => [{ question: res.data.question, answer: res.data.answer }, ...prev]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to get an answer. Is the codebase indexed?";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="space-y-5">
      {/* Input */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-1">Ask a Question</h2>
        <p className="text-sm text-gray-400 mb-5">
          Ask anything about the indexed codebase. Press <kbd className="px-1.5 py-0.5 bg-gray-800 rounded text-xs">Enter</kbd> to send.
        </p>

        <div className="flex gap-3">
          <textarea
            className="input resize-none text-sm flex-1"
            rows={3}
            placeholder="Where is the JWT token verified?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKey}
            disabled={loading}
          />
          <button
            className="btn-primary self-end"
            onClick={() => submit()}
            disabled={loading || !question.trim()}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2 flex items-center gap-1.5">
            <Sparkles size={12} /> Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => submit(s)}
                disabled={loading}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700
                           hover:border-[#4f6ef7]/50 text-gray-400 hover:text-gray-200
                           rounded-full transition-all disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{history.length} answer{history.length > 1 ? "s" : ""}</p>
            <button
              onClick={() => setHistory([])}
              className="btn-ghost text-xs text-red-400 hover:text-red-300"
            >
              <Trash2 size={13} /> Clear
            </button>
          </div>
          {history.map((item, i) => (
            <AnswerBlock key={i} question={item.question} answer={item.answer} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 && !loading && (
        <div className="text-center py-16 text-gray-600">
          <Sparkles size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Index a codebase first, then ask away.</p>
        </div>
      )}
    </div>
  );
}
