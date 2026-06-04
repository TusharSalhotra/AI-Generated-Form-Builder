import type { FormSchema } from '@/types/form.types';

export interface DemoForm {
  id: string;
  title: string;
  schema: FormSchema;
  userId: string;
  createdAt: string;
}

export interface DemoFormVersion {
  id: string;
  formId: string;
  schema: FormSchema;
  label: string;
  createdAt: string;
}

const demoSchemaA: FormSchema = {
  id: 'demo-form',
  title: 'Demo Lead Capture Form',
  fields: [
    {
      id: 'full_name',
      name: 'full_name',
      type: 'text',
      label: 'Full name',
      placeholder: 'Enter your full name',
      required: true,
    },
    {
      id: 'email_address',
      name: 'email_address',
      type: 'email',
      label: 'Email address',
      placeholder: 'you@example.com',
      required: true,
    },
    {
      id: 'project_details',
      name: 'project_details',
      type: 'textarea',
      label: 'Project details',
      placeholder: 'Tell us what you want to build',
      required: false,
    },
  ],
};

const demoSchemaB: FormSchema = {
  id: 'demo-form',
  title: 'Demo Lead Capture Form',
  fields: [
    {
      id: 'full_name',
      name: 'full_name',
      type: 'text',
      label: 'Name',
      placeholder: 'Your name',
      required: true,
    },
    {
      id: 'email_address',
      name: 'email_address',
      type: 'email',
      label: 'Work email',
      placeholder: 'name@company.com',
      required: true,
    },
    {
      id: 'budget_range',
      name: 'budget_range',
      type: 'select',
      label: 'Budget range',
      placeholder: 'Select a budget',
      required: true,
      options: ['$1k-$5k', '$5k-$10k', '$10k+'],
    },
  ],
};

export const demoForms: DemoForm[] = [
  {
    id: 'demo-form',
    title: 'Demo Lead Capture Form',
    schema: demoSchemaA,
    userId: 'demo-user',
    createdAt: '2026-06-03T00:00:00.000Z',
  },
];

export const demoFormVersions: DemoFormVersion[] = [
  {
    id: 'demo-form-version-a',
    formId: 'demo-form',
    schema: demoSchemaA,
    label: 'A',
    createdAt: '2026-06-03T00:00:00.000Z',
  },
  {
    id: 'demo-form-version-b',
    formId: 'demo-form',
    schema: demoSchemaB,
    label: 'B',
    createdAt: '2026-06-03T00:00:00.000Z',
  },
];

export function getDemoFormById(id: string) {
  const form = demoForms.find((item) => item.id === id);

  if (!form) return null;

  return {
    ...form,
    versions: demoFormVersions.filter((version) => version.formId === id),
  };
}
