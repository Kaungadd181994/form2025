import React, { useEffect, useState } from 'react';
import { FormField } from '../types';
import { Button } from './Button';
import { generateAppsScript } from '../services/geminiService';
import { Copy, Check, Code2 } from 'lucide-react';

interface IntegrationGuideProps {
  fields: FormField[];
}

export const IntegrationGuide: React.FC<IntegrationGuideProps> = ({ fields }) => {
  const [script, setScript] = useState<string>('Generating script...');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchScript = async () => {
      setLoading(true);
      try {
        const code = await generateAppsScript(fields);
        if (mounted) setScript(code);
      } catch (e) {
        if (mounted) setScript('// Error generating script. Please check API Key.');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchScript();
    return () => { mounted = false; };
  }, [fields]);

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold mb-4">Connect to Google Sheets</h2>
        <p className="text-indigo-100 max-w-2xl leading-relaxed">
          While this app simulates the integration for demonstration, you can make it real! 
          Gemini has generated a custom Google Apps Script based on your current form fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-6">
          <div className="relative pl-8 border-l-2 border-slate-200">
            <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
            <h3 className="font-bold text-slate-900">Step 1</h3>
            <p className="text-sm text-slate-600 mt-1">Open a new Google Sheet.</p>
          </div>
          <div className="relative pl-8 border-l-2 border-slate-200">
             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
            <h3 className="font-bold text-slate-900">Step 2</h3>
            <p className="text-sm text-slate-600 mt-1">Go to Extensions &gt; Apps Script.</p>
          </div>
          <div className="relative pl-8 border-l-2 border-slate-200">
             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
            <h3 className="font-bold text-slate-900">Step 3</h3>
            <p className="text-sm text-slate-600 mt-1">Paste the code on the right into the editor.</p>
          </div>
          <div className="relative pl-8 border-l-2 border-slate-200">
             <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-indigo-600 ring-4 ring-white"></span>
            <h3 className="font-bold text-slate-900">Step 4</h3>
            <p className="text-sm text-slate-600 mt-1">Deploy as a Web App and use the URL as your webhook.</p>
          </div>
        </div>

        <div className="col-span-2">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2 text-slate-400">
                <Code2 size={16} />
                <span className="text-xs font-mono">Code.gs</span>
              </div>
              <button 
                onClick={handleCopy}
                className="flex items-center gap-2 text-xs font-medium text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
            <div className="relative">
              {loading && (
                 <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                 </div>
              )}
              <pre className="p-4 text-sm font-mono text-slate-300 overflow-x-auto h-[400px]">
                <code>{script}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};