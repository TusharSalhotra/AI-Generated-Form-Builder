'use client';

import type { FormField } from '@/types';
import { useFormStore } from '@/store/useFormStore';
import { Input, Textarea } from '@/components/shared';
import { X } from 'lucide-react';

export function FieldConfigPanel() {
  const selectedField = useFormStore((state) => state.selectedField as FormField | undefined);
  const updateField = useFormStore((state) => state.updateField);
  const setSelectedField = useFormStore((state) => state.setSelectedField);

  if (!selectedField) return null;

  const optionValues = (selectedField.options || []).map((o) => o.value).join(', ');

  const handleChange = (key: string, value: string | boolean) => {
    updateField(selectedField.id, { [key]: value });
  };

  const handleOptionsChange = (value: string) => {
    const options = value
      .split(',')
      .map((option) => option.trim())
      .filter(Boolean)
      .map((option) => ({ label: option, value: option }));

    updateField(selectedField.id, { options });
  };

  return (
    <aside className="max-h-[calc(100vh-80px)] w-full overflow-y-auto lg:w-80">
      <div className="sticky top-0 flex items-center justify-between border-b border-slate-200/80 bg-white/85 p-4 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/85">
        <h3 className="font-semibold text-slate-900 dark:text-white">Field Settings</h3>
        <button
          onClick={() => setSelectedField(null)}
          className="rounded-lg p-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="space-y-6 p-4">
        {/* Field Type Info */}
        <div className="flex items-center gap-3 rounded-xl border border-sky-200 bg-sky-50/90 p-3 dark:border-sky-800 dark:bg-sky-900/30">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-xs font-bold text-sky-600 dark:bg-sky-800 dark:text-sky-200">
            {selectedField.type.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase text-sky-600 dark:text-sky-300">Type</p>
            <p className="text-sm font-medium capitalize text-sky-900 dark:text-sky-100">{selectedField.type}</p>
          </div>
        </div>

        {/* Main Fields */}
        <div className="space-y-4">
          <Input
            label="Label"
            value={selectedField.label}
            onChange={(event) => handleChange('label', event.target.value)}
            hint="The visible label for this field"
          />

          <Input
            label="Name"
            value={selectedField.name ?? ''}
            onChange={(event) => handleChange('name', event.target.value)}
            hint="Field identifier for form submissions"
          />

          <Input
            label="Placeholder"
            value={selectedField.placeholder ?? ''}
            onChange={(event) => handleChange('placeholder', event.target.value)}
            hint="Placeholder text shown in the input"
          />
        </div>

        {/* Checkbox Group */}
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Validation</p>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl border border-slate-300/90 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-600 dark:hover:bg-slate-800"
            onClick={() => handleChange('required', !(selectedField.required ?? false))}
          >
            <input
              id="required"
              type="checkbox"
              checked={selectedField.required ?? false}
              onChange={() => {}}
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-sky-600 focus:ring-sky-500 dark:border-slate-600 dark:focus:ring-sky-400"
            />
            <label htmlFor="required" className="cursor-pointer text-sm font-medium text-slate-900 dark:text-slate-100">
              Required field
            </label>
          </button>
        </div>

        {/* Options Section */}
        {(selectedField.type === 'select' || selectedField.type === 'radio') && (
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Options</p>
            <Textarea
              label="Values"
              value={optionValues}
              onChange={(event) => handleOptionsChange(event.target.value)}
              placeholder="option1, option2, option3"
              hint="Enter each option separated by commas"
            />
          </div>
        )}
      </div>
    </aside>
  );
}
