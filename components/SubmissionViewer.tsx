import React from 'react';
import { SubmissionRecord, FormField } from '../types';
import { FileSpreadsheet, Mail, AlertCircle, Sparkles, ExternalLink } from 'lucide-react';

interface SubmissionViewerProps {
  submissions: SubmissionRecord[];
  fields: FormField[];
}

export const SubmissionViewer: React.FC<SubmissionViewerProps> = ({ submissions, fields }) => {
  if (submissions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
          <FileSpreadsheet size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No Submissions Yet</h3>
        <p className="text-slate-500 max-w-sm text-center mt-2">
          Go to the Preview tab and submit the form. Your data will appear here, processed by Gemini.
        </p>
      </div>
    );
  }

  // Reverse submissions to show newest first
  const reversedSubmissions = [...submissions].reverse();

  return (
    <div className="space-y-8">
      {/* Simulated Google Sheets View */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-[#0f9d58] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-white" size={24} />
            <div>
              <h2 className="font-semibold text-lg">Form_Responses_1</h2>
              <p className="text-xs text-green-100 opacity-90">Simulated Google Sheets Integration</p>
            </div>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded text-xs font-medium">Live Sync</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 whitespace-nowrap">Timestamp</th>
                {fields.map(f => (
                  <th key={f.id} className="px-6 py-3 whitespace-nowrap">{f.label}</th>
                ))}
                <th className="px-6 py-3 whitespace-nowrap bg-indigo-50 text-indigo-700 border-l border-indigo-100">
                  <div className="flex items-center gap-1">
                    <Sparkles size={14} /> AI Analysis
                  </div>
                </th>
                <th className="px-6 py-3 whitespace-nowrap bg-indigo-50 text-indigo-700">Urgency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reversedSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-500 whitespace-nowrap">{new Date(sub.timestamp).toLocaleString()}</td>
                  {fields.map(f => (
                    <td key={f.id} className="px-6 py-3 text-slate-700 max-w-xs truncate">
                      {sub.data[f.id]}
                    </td>
                  ))}
                  <td className="px-6 py-3 text-slate-600 border-l border-slate-100 bg-slate-50/50 max-w-xs truncate" title={sub.analysis?.summary}>
                    {sub.analysis?.summary || 'Processing...'}
                  </td>
                  <td className="px-6 py-3 bg-slate-50/50">
                    {sub.analysis?.urgency && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${sub.analysis.urgency === 'High' ? 'bg-red-100 text-red-800' : 
                          sub.analysis.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {sub.analysis.urgency}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simulated Email Integration */}
      <h3 className="text-xl font-bold text-slate-800 mt-12 flex items-center gap-2">
        <Mail className="text-indigo-600" /> 
        Automated Email Actions
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reversedSubmissions.map((sub) => (
          <div key={sub.id} className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0
                  ${sub.analysis?.sentiment === 'Negative' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-500'}`}>
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 line-clamp-1">{sub.analysis?.emailDraft.subject}</h4>
                  <p className="text-xs text-slate-500">To: {fields.find(f => f.type === 'email') ? sub.data[fields.find(f => f.type === 'email')!.id] : 'User'}</p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Draft</span>
            </div>
            
            <div className="p-5 flex-1 bg-slate-50/50">
              <div className="prose prose-sm prose-slate max-w-none">
                <p className="text-slate-600 whitespace-pre-wrap font-mono text-xs leading-relaxed">
                  {sub.analysis?.emailDraft.body}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white border-t border-slate-100 rounded-b-xl flex justify-between items-center">
              <div className="flex gap-2">
                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-xs font-medium text-slate-600">
                   <AlertCircle size={12} /> {sub.analysis?.category}
                 </span>
              </div>
              <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center gap-1">
                View in Gmail <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};