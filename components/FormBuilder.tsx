import React, { useState } from 'react';
import { FormField, FieldType } from '../types';
import { Button } from './Button';
import { Input } from './Input';
import { Trash2, Plus, GripVertical, Sparkles, X } from 'lucide-react';
import { generateFormFromDescription } from '../services/geminiService';

interface FormBuilderProps {
  fields: FormField[];
  setFields: React.Dispatch<React.SetStateAction<FormField[]>>;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ fields, setFields }) => {
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      label: 'New Field',
      type: FieldType.TEXT,
      required: false,
      placeholder: ''
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleAiImport = async () => {
    if (!importText.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedFields = await generateFormFromDescription(importText);
      const newFields: FormField[] = generatedFields.map(f => ({
        ...f,
        id: crypto.randomUUID(),
        type: f.type as FieldType // Ensure type cast
      }));
      setFields(newFields);
      setShowImportModal(false);
      setImportText('');
    } catch (error) {
      console.error("Failed to generate form", error);
      alert("Failed to generate form from text. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200 relative">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Form Builder</h2>
          <p className="text-slate-500 text-sm">Design manually or import from text.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setShowImportModal(true)}
            icon={<Sparkles size={16} className="text-indigo-600" />}
          >
            AI Import
          </Button>
          <Button onClick={addField} icon={<Plus size={16} />}>Add Field</Button>
        </div>
      </div>

      <div className="space-y-4">
        {fields.length === 0 && (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <p className="text-slate-500">No fields yet. Click "AI Import" to paste your Google Form content!</p>
          </div>
        )}
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex gap-4 items-start p-4 bg-slate-50 rounded-lg border border-slate-200 group transition-colors hover:border-indigo-300">
            <div className="mt-3 text-slate-400 cursor-grab active:cursor-grabbing">
              <GripVertical size={20} />
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5">
                <Input 
                  label="Field Label" 
                  value={field.label} 
                  onChange={(e) => updateField(field.id, { label: e.target.value })}
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select 
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={field.type}
                  onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                >
                  <option value={FieldType.TEXT}>Text</option>
                  <option value={FieldType.EMAIL}>Email</option>
                  <option value={FieldType.TEXTAREA}>Long Text</option>
                  <option value={FieldType.NUMBER}>Number</option>
                  <option value={FieldType.SELECT}>Select Dropdown</option>
                </select>
              </div>

              <div className="md:col-span-3">
                 <Input 
                  label="Placeholder" 
                  value={field.placeholder || ''} 
                  onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                />
              </div>

              <div className="md:col-span-1 flex items-center pt-6">
                <label className="flex items-center space-x-2 text-sm text-slate-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={field.required} 
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Req.</span>
                </label>
              </div>

              {/* Options editor for Select types */}
              {field.type === FieldType.SELECT && (
                <div className="md:col-span-12">
                   <label className="block text-sm font-medium text-slate-700 mb-1">Options (comma separated)</label>
                   <input
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    value={field.options?.join(', ') || ''}
                    placeholder="Option 1, Option 2, Option 3"
                    onChange={(e) => updateField(field.id, { options: e.target.value.split(',').map(s => s.trim()) })}
                   />
                </div>
              )}
            </div>

            <button 
              onClick={() => removeField(field.id)}
              className="mt-2 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* AI Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" />
                Import from Description
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600">
                Paste the text from your Google Form or simply describe the form you want (e.g., "Registration form with name, email, diet preference dropdown").
              </p>
              <textarea 
                className="w-full h-40 px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm resize-none"
                placeholder="Paste questions here..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
              />
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowImportModal(false)}>Cancel</Button>
              <Button 
                onClick={handleAiImport} 
                disabled={!importText.trim()}
                isLoading={isGenerating}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {isGenerating ? 'Analyzing...' : 'Generate Form'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
