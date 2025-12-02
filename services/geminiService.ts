import { GoogleGenAI, Type } from "@google/genai";
import { FormField, GeminiAnalysis, SubmissionData, FieldType } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeSubmission = async (
  formData: SubmissionData,
  fields: FormField[]
): Promise<GeminiAnalysis> => {
  const ai = getAiClient();
  
  // Construct a prompt that explains the form context
  const context = fields.map(f => `${f.label}: ${formData[f.id]}`).join('\n');

  const prompt = `
    You are an intelligent form processor. Analyze the following form submission data.
    
    Data:
    ${context}

    Please determine:
    1. Urgency (Low, Medium, High) based on the content.
    2. Category (e.g., Support, Sales, Inquiry, Bug Report).
    3. Sentiment (Positive, Neutral, Negative).
    4. A concise 1-sentence summary.
    5. A suggested next action for the admin.
    6. A professional email response draft to the user (if an email field exists, otherwise generic).
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          urgency: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
          category: { type: Type.STRING },
          sentiment: { type: Type.STRING, enum: ['Positive', 'Neutral', 'Negative'] },
          summary: { type: Type.STRING },
          suggestedAction: { type: Type.STRING },
          emailDraft: {
            type: Type.OBJECT,
            properties: {
              subject: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ['subject', 'body']
          }
        },
        required: ['urgency', 'category', 'sentiment', 'summary', 'suggestedAction', 'emailDraft']
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  
  return JSON.parse(text) as GeminiAnalysis;
};

export const generateAppsScript = async (fields: FormField[]): Promise<string> => {
  const ai = getAiClient();
  
  const fieldNames = fields.map(f => f.label).join(', ');
  
  const prompt = `
    Generate a Google Apps Script code snippet that acts as a webhook receiver (doPost) for a form.
    The form has these fields: ${fieldNames}.
    
    The script should:
    1. Parse the JSON payload from the request.
    2. Append a row to the active Google Sheet with a timestamp and the field values.
    3. Send an email notification to "admin@example.com" containing the form details.
    
    Return ONLY the code, no markdown formatting.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  });

  return response.text || '// Error generating script';
};

export const generateFormFromDescription = async (description: string): Promise<Omit<FormField, 'id'>[]> => {
  const ai = getAiClient();

  const prompt = `
    You are a form builder assistant. Convert the following text description or list of questions into a structured form schema.
    
    Input Text:
    "${description}"
    
    Rules:
    - Detect the label, appropriate field type (text, email, textarea, select, number), and if it seems required.
    - If it's a 'select' type, extract the options.
    - Generate a helpful placeholder.
    - Field types must strictly be one of: 'text', 'email', 'textarea', 'select', 'number'.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            label: { type: Type.STRING },
            type: { type: Type.STRING, enum: ['text', 'email', 'textarea', 'select', 'number'] },
            required: { type: Type.BOOLEAN },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            placeholder: { type: Type.STRING }
          },
          required: ['label', 'type', 'required', 'placeholder']
        }
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  return JSON.parse(text) as Omit<FormField, 'id'>[];
};
