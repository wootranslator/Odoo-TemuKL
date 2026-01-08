import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  fileName: string;
  language: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ fileName, language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm mb-6 flex flex-col h-full">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <span className="text-xs font-mono bg-gray-200 text-gray-700 px-2 py-1 rounded">{language}</span>
            <span className="text-sm font-medium text-gray-700 font-mono">{fileName}</span>
        </div>
        <button 
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-500 hover:text-gray-700"
            title="Copy code"
        >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="relative flex-grow bg-[#1e1e1e] overflow-auto custom-scrollbar">
        <pre className="text-sm font-mono text-gray-300 p-4 leading-relaxed min-w-full">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};