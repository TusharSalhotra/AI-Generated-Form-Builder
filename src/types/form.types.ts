/**
 * SmartForm AI form schema types
 * Core schema shape used by renderer, builder, AI layer, and backend APIs.
 */

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'file';

export interface FieldValidation {
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

export interface FieldConditional {
  dependsOn: string;
  value: string | number | boolean;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: FieldValidation;
  conditional?: FieldConditional;
  step?: number;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: Field[];
}

export interface FormSubmission {
  formId: string;
  values: Record<string, unknown>;
  timeSpent?: number;
}

export interface FieldAnalytics {
  fieldId: string;
  impressions: number;
  dropOff: number;
  avgTime: number;
}
