import type { FormSchema } from '@/types/form.types';

export const templates: { id: string; title: string; schema: FormSchema }[] = [
  {
    id: 'contact-form',
    title: 'Contact Form',
    schema: {
      id: 'contact-form',
      title: 'Contact Form',
      fields: [
        {
          id: 'name',
          name: 'name',
          type: 'text',
          label: 'Name',
          placeholder: 'Enter your name',
          required: true,
        },
        {
          id: 'email',
          name: 'email',
          type: 'email',
          label: 'Email',
          placeholder: 'Enter your email',
          required: true,
        },
        {
          id: 'message',
          name: 'message',
          type: 'textarea',
          label: 'Message',
          placeholder: 'Enter your message',
          required: false,
        },
      ],
    },
  },
  {
    id: 'survey-form',
    title: 'Survey Form',
    schema: {
      id: 'survey-form',
      title: 'Survey Form',
      fields: [
        {
          id: 'question',
          name: 'question',
          type: 'text',
          label: 'Question',
          placeholder: 'Enter your question',
          required: true,
        },
        {
          id: 'rating',
          name: 'rating',
          type: 'select',
          label: 'Rating',
          placeholder: 'Choose a rating',
          required: true,
          options: ['1', '2', '3', '4', '5'],
        },
      ],
    },
  },
  {
    id: 'healthcare-form',
    title: 'Healthcare Form',
    schema: {
      id: 'healthcare-form',
      title: 'Healthcare Form',
      fields: [
        {
          id: 'patient-name',
          name: 'patientName',
          type: 'text',
          label: 'Patient Name',
          placeholder: 'Enter patient name',
          required: true,
        },
        {
          id: 'age',
          name: 'age',
          type: 'number',
          label: 'Age',
          placeholder: 'Enter age',
          required: true,
        },
        {
          id: 'symptoms',
          name: 'symptoms',
          type: 'textarea',
          label: 'Symptoms',
          placeholder: 'Describe symptoms',
          required: false,
        },
      ],
    },
  },
];
