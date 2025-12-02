export enum FieldType {
  TEXT = 'text',
  EMAIL = 'email',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  NUMBER = 'number'
}

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[]; // For select inputs
  placeholder?: string;
}

export interface SubmissionData {
  [key: string]: string;
}

export interface GeminiAnalysis {
  urgency: 'Low' | 'Medium' | 'High';
  category: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  summary: string;
  suggestedAction: string;
  emailDraft: {
    subject: string;
    body: string;
  };
}

export interface SubmissionRecord {
  id: string;
  timestamp: string;
  data: SubmissionData;
  analysis: GeminiAnalysis | null;
  status: 'pending' | 'processed';
}

export enum AppTab {
  BUILDER = 'builder',
  PREVIEW = 'preview',
  SUBMISSIONS = 'submissions',
  INTEGRATION = 'integration'
}