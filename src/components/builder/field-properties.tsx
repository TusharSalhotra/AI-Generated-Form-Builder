'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Select,
  Button,
} from '@/components/shared';
import type { FormField } from '@/types';

export interface FieldPropertiesProps {
  field?: FormField | null;
  onChange?: (field: FormField) => void;
  onDelete?: () => void;
}

export function FieldProperties({
  field,
  onChange,
  onDelete,
}: FieldPropertiesProps) {
  if (!field) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Field Properties</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--muted-foreground)]">
            Select a field from the canvas to edit its properties.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Field Properties</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          label="Label"
          value={field.label}
          onChange={(e) => onChange?.({ ...field, label: e.target.value })}
        />

        <Input
          label="Placeholder"
          value={field.placeholder || ''}
          onChange={(e) =>
            onChange?.({ ...field, placeholder: e.target.value })
          }
        />

        <Select
          label="Field Type"
          value={field.type}
          options={[
            { value: 'text', label: 'Text Input' },
            { value: 'email', label: 'Email' },
            { value: 'number', label: 'Number' },
            { value: 'textarea', label: 'Text Area' },
            { value: 'select', label: 'Dropdown' },
            { value: 'checkbox', label: 'Checkbox' },
            { value: 'radio', label: 'Radio' },
            { value: 'date', label: 'Date' },
            { value: 'file', label: 'File Upload' },
          ]}
          onChange={(e) =>
            onChange?.({
              ...field,
              type: e.target.value as FormField['type'],
            })
          }
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="required"
            checked={field.required || false}
            onChange={(e) =>
              onChange?.({ ...field, required: e.target.checked })
            }
            className="h-4 w-4 rounded border-[var(--border)]"
          />
          <label
            htmlFor="required"
            className="text-sm text-[var(--foreground)]"
          >
            Required field
          </label>
        </div>

        <div className="pt-4 border-t border-[var(--border)]">
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="w-full"
          >
            Delete Field
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
