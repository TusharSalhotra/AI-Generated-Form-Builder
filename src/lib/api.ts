import type { FormSchema } from '@/types/form.types';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function createForm(payload: {
  title: string;
  schema: { fields: FormSchema['fields'] };
}): Promise<ApiResponse<unknown>> {
  const response = await fetch('/api/forms', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Unable to create form');
  }

  return json;
}

export async function getForms(): Promise<ApiResponse<unknown>> {
  const response = await fetch('/api/forms');
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Unable to load forms');
  }

  return json;
}

export interface FormVersionResponse {
  id: string;
  formId: string;
  schema: { fields: FormSchema['fields'] };
  label: string;
  createdAt: string;
}

export async function getFormById(id: string): Promise<
  ApiResponse<{
    id: string;
    title: string;
    schema: { fields: FormSchema['fields'] };
    versions?: FormVersionResponse[];
  }>
> {
  const response = await fetch(`/api/forms/${id}`);
  const json = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Unable to load form');
  }

  return json;
}

export async function submitForm(
  id: string,
  values: Record<string, unknown>,
  version = 'A'
): Promise<ApiResponse<unknown>> {
  const response = await fetch(`/api/forms/${id}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values, version }),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Unable to submit form');
  }

  return json;
}

export async function trackAnalytics(payload: {
  formId: string;
  fieldId: string;
  timeSpent: number;
  version?: string;
}): Promise<ApiResponse<unknown>> {
  const response = await fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (!response.ok || !json.success) {
    throw new Error(json.message || 'Unable to track analytics');
  }

  return json;
}
