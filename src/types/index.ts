/**
 * Base types for SmartForm AI
 * This file exports all shared TypeScript types and interfaces
 */

export interface FormField {
  id: string;
  name: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: FieldOption[];
}

export type FieldType =
  | 'text'
  | 'email'
  | 'number'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'date'
  | 'file';

export interface FieldOption {
  label: string;
  value: string;
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email';
  value?: string | number;
  message: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FormResponse {
  id: string;
  formId: string;
  data: Record<string, unknown>;
  submittedAt: Date;
}
