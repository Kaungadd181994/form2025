import React, { useState } from 'react';
import { FormField, FieldType, SubmissionData } from '../types';
import { Button } from './Button';
import { Send, CheckCircle2 } from 'lucide-react';
import { analyzeSubmission } from '../services/geminiService';

interface LiveFormProps {
  fields: FormField[];
  onSubmissionComplete: (data: SubmissionData, analysis: any) => void;
}

export const LiveForm: React.FC<LiveFormProps> = ({ fields, onSubmissionComplete }) => {
  const [formData, setFormData] = useState<SubmissionData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // 2. Process with Gemini
      const analysis = await analyzeSubmission(formData, fields);

      // 3. Complete
      onSubmissionComplete(formData, analysis);
      setSuccess(true);
      setFormData({});
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to process submission. Please check your API key.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center p-8 bg-slate-50 rounded-lg">
        <p className="text-slate-500">The form has no fields. Go to the Builder tab to add some.</p>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-xl mx-auto p-8 bg-green-50 rounded-xl border border-green-100 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 size={32} />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">Submission Received!</h3>
        <p className="text-green-700">
          Your data has been processed by Gemini, integrated into the dashboard, and an email draft has been prepared.
        </p>
        <Button 
          variant="secondary" 
          className="mt-6"
          onClick={() => setSuccess(false)}
        >
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-slate-200">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Contact Us</h1>
        <p className="text-slate-500 mt-2">Fill out the form below. Our AI agent will process it instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            
            {field.type === FieldType.TEXTAREA ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none min-h-[120px]"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            ) : field.type === FieldType.SELECT ? (
              <select
                 required={field.required}
                 className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                 value={formData[field.id] || ''}
                 onChange={(e) => handleChange(field.id, e.target.value)}
              >
                <option value="">Select an option...</option>
                {field.options && field.options.length > 0 ? (
                  field.options.map((opt, idx) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))
                ) : (
                  <>
                    <option value="Option 1">Option 1</option>
                    <option value="Option 2">Option 2</option>
                  </>
                )}
              </select>
            ) : (
              <input
                type={field.type}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                value={formData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-4 text-lg shadow-indigo-200 shadow-lg"
            isLoading={isSubmitting}
            icon={<Send size={20} />}
          >
            Submit Form
          </Button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Powered by Google Gemini • Secure Processing
          </p>
        </div>
      </form>
    </div>
  );
};
