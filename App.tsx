import React, { useState } from 'react';
import { FormField, FieldType, SubmissionRecord, AppTab } from './types';
import { FormBuilder } from './components/FormBuilder';
import { LiveForm } from './components/LiveForm';
import { SubmissionViewer } from './components/SubmissionViewer';
import { IntegrationGuide } from './components/IntegrationGuide';
import { Layout, PenTool, Eye, Database, Code2, Sparkles } from 'lucide-react';

// Default fields for the initial state
const INITIAL_FIELDS: FormField[] = [
  { id: '1', label: 'Full Name', type: FieldType.TEXT, required: true, placeholder: 'John Doe' },
  { id: '2', label: 'Email Address', type: FieldType.EMAIL, required: true, placeholder: 'john@example.com' },
  { id: '3', label: 'Message', type: FieldType.TEXTAREA, required: true, placeholder: 'How can we help you?' }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.PREVIEW);
  const [fields, setFields] = useState<FormField[]>(INITIAL_FIELDS);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);

  const handleSubmission = (data: any, analysis: any) => {
    const newRecord: SubmissionRecord = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      data,
      analysis,
      status: 'processed'
    };
    setSubmissions(prev => [...prev, newRecord]);
  };

  const tabs = [
    { id: AppTab.BUILDER, label: 'Form Builder', icon: PenTool },
    { id: AppTab.PREVIEW, label: 'Live Preview', icon: Eye },
    { id: AppTab.SUBMISSIONS, label: 'Submissions', icon: Database, badge: submissions.length },
    { id: AppTab.INTEGRATION, label: 'Integrate', icon: Code2 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Layout size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">SmartForm</h1>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">With Gemini Intelligence</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all
                    ${activeTab === tab.id 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                >
                  <tab.icon size={16} className={`mr-2 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  {tab.label}
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs
                      ${activeTab === tab.id ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-600'}`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Gemini Notice */}
        <div className="mb-6 flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-indigo-100 rounded-lg text-indigo-700 text-sm">
          <Sparkles size={16} className="shrink-0" />
          <p>
            <strong>AI Powered:</strong> All submissions are analyzed by Gemini to generate summaries, determine urgency, and draft email responses automatically.
          </p>
        </div>

        {activeTab === AppTab.BUILDER && (
          <div className="animate-fade-in">
            <FormBuilder fields={fields} setFields={setFields} />
          </div>
        )}

        {activeTab === AppTab.PREVIEW && (
          <div className="animate-fade-in">
            <LiveForm fields={fields} onSubmissionComplete={handleSubmission} />
          </div>
        )}

        {activeTab === AppTab.SUBMISSIONS && (
          <div className="animate-fade-in">
            <SubmissionViewer submissions={submissions} fields={fields} />
          </div>
        )}

        {activeTab === AppTab.INTEGRATION && (
          <div className="animate-fade-in">
            <IntegrationGuide fields={fields} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;