import { useState } from "react";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { resetStore } from "../api";

export default function ResetPanel() {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const handleReset = async () => {
    if (!confirm) { setConfirm(true); return; }
    setLoading(true);
    try {
      const res = await resetStore();
      toast.success(res.data.message);
      setConfirm(false);
    } catch {
      toast.error("Reset failed. Is the server running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card border-red-900/40">
      <div className="flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
          <AlertTriangle size={18} className="text-red-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">Reset Vector Store</h3>
          <p className="text-sm text-gray-400 mt-1">
            Clears all indexed code chunks from ChromaDB. Do this before indexing a new project.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleReset}
              disabled={loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                confirm
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-800 hover:bg-gray-700 text-red-400"
              }`}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
              {confirm ? "Confirm Reset" : "Reset Store"}
            </button>
            {confirm && (
              <button
                onClick={() => setConfirm(false)}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
