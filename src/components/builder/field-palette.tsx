'use client';

import {
  Type,
  Mail,
  Hash,
  AlignLeft,
  ListChecks,
  CheckSquare,
  Circle,
  Calendar,
  Upload,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared';
import type { FieldType } from '@/types';

interface PaletteItem {
  type: FieldType;
  label: string;
  icon: React.ReactNode;
}

const FIELD_TYPES: PaletteItem[] = [
  { type: 'text', label: 'Text Input', icon: <Type className="h-4 w-4" /> },
  { type: 'email', label: 'Email', icon: <Mail className="h-4 w-4" /> },
  { type: 'number', label: 'Number', icon: <Hash className="h-4 w-4" /> },
  {
    type: 'textarea',
    label: 'Text Area',
    icon: <AlignLeft className="h-4 w-4" />,
  },
  {
    type: 'select',
    label: 'Dropdown',
    icon: <ListChecks className="h-4 w-4" />,
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: <CheckSquare className="h-4 w-4" />,
  },
  { type: 'radio', label: 'Radio', icon: <Circle className="h-4 w-4" /> },
  {
    type: 'date',
    label: 'Date Picker',
    icon: <Calendar className="h-4 w-4" />,
  },
  { type: 'file', label: 'File Upload', icon: <Upload className="h-4 w-4" /> },
];

export function FieldPalette() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Form Fields</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {FIELD_TYPES.map((field) => (
          <PaletteFieldItem key={field.type} {...field} />
        ))}
      </CardContent>
    </Card>
  );
}

function PaletteFieldItem({ type, label, icon }: PaletteItem) {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--secondary)]"
      draggable
      data-field-type={type}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--secondary)] text-[var(--muted-foreground)]">
        {icon}
      </span>
      <span className="font-medium text-[var(--foreground)]">{label}</span>
    </button>
  );
}
