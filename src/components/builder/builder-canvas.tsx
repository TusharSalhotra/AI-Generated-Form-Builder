'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/shared';
import type { FormField } from '@/types';

export interface BuilderCanvasProps {
  fields?: FormField[];
  onFieldSelect?: (fieldId: string) => void;
  onFieldsChange?: (fields: FormField[]) => void;
}

export function BuilderCanvas({
  fields = [],
  onFieldSelect,
  onFieldsChange: _onFieldsChange,
}: BuilderCanvasProps) {
  const isEmpty = fields.length === 0;

  return (
    <Card className="min-h-[600px]">
      <CardHeader className="border-b border-[var(--border)]">
        <CardTitle className="text-sm">Form Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {isEmpty ? (
          <EmptyCanvas />
        ) : (
          <div className="space-y-4">
            {fields.map((field) => (
              <CanvasField
                key={field.id}
                field={field}
                onSelect={() => onFieldSelect?.(field.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyCanvas() {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[var(--border)] p-8 text-center">
      <div className="mb-4 rounded-full bg-[var(--secondary)] p-4">
        <svg
          className="h-8 w-8 text-[var(--muted-foreground)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <h3 className="mb-2 text-lg font-medium text-[var(--foreground)]">
        Start building your form
      </h3>
      <p className="max-w-sm text-sm text-[var(--muted-foreground)]">
        Drag and drop fields from the left panel to create your form, or use AI
        to generate one automatically.
      </p>
    </div>
  );
}

interface CanvasFieldProps {
  field: FormField;
  onSelect: () => void;
}

function CanvasField({ field, onSelect }: CanvasFieldProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full rounded-lg border border-[var(--border)] bg-[var(--card)] p-4 text-left transition-colors hover:border-[var(--color-primary-500)] hover:bg-[var(--secondary)]"
    >
      <p className="text-sm font-medium text-[var(--foreground)]">
        {field.label}
      </p>
      <p className="mt-1 text-xs text-[var(--muted-foreground)]">
        Type: {field.type}
      </p>
    </button>
  );
}
