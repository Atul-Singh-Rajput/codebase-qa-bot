import ReactMarkdown from "react-markdown";
import { FileCode2, Copy, Check } from "lucide-react";
import { useState } from "react";

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
    </button>
  );
}

export default function AnswerBlock({ question, answer }) {
  return (
    <div className="card space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-[#4f6ef7]/20 flex items-center justify-center shrink-0 mt-0.5">
          <FileCode2 size={14} className="text-[#4f6ef7]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 mb-1">Question</p>
          <p className="text-gray-200 font-medium">{question}</p>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-gray-500">Answer</p>
          <CopyButton text={answer} />
        </div>
        <div className="prose prose-invert prose-sm max-w-none
                        prose-code:bg-gray-800 prose-code:text-[#4f6ef7]
                        prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                        prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700
                        prose-pre:rounded-xl prose-headings:text-gray-200
                        prose-strong:text-white prose-p:text-gray-300
                        prose-li:text-gray-300">
          <ReactMarkdown
            components={{
              pre: ({ children }) => (
                <pre className="overflow-x-auto p-4 bg-gray-800 border border-gray-700 rounded-xl font-mono text-xs leading-relaxed">
                  {children}
                </pre>
              ),
              code: ({ inline, children }) =>
                inline ? (
                  <code className="bg-gray-800 text-[#4f6ef7] px-1.5 py-0.5 rounded font-mono text-xs">
                    {children}
                  </code>
                ) : (
                  <code className="font-mono text-xs text-gray-200">{children}</code>
                ),
            }}
          >
            {answer}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
