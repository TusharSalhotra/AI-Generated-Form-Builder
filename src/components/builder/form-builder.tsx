'use client';

import { Container } from '@/components/shared';
import { LayoutGrid, MousePointerSquareDashed, SlidersHorizontal } from 'lucide-react';

export interface FormBuilderProps {
  formId?: string;
}

export function FormBuilder({ formId }: Readonly<FormBuilderProps>) {
  return (
    <Container size="xl" className="py-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Left Sidebar - Field Palette */}
        <aside className="xl:col-span-3">
          <FieldPalette />
        </aside>

        {/* Center - Builder Canvas */}
        <main className="xl:col-span-6">
          <BuilderCanvas formId={formId} />
        </main>

        {/* Right Sidebar - Field Properties */}
        <aside className="xl:col-span-3">
          <FieldProperties />
        </aside>
      </div>
    </Container>
  );
}

function FieldPalette() {
  return (
    <div className="gradient-stroke rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300">
          <LayoutGrid size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Form Fields
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Components library
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Drag fields to the canvas to build your form.
      </p>
      {/* Field palette items will be added here */}
    </div>
  );
}

function BuilderCanvas({ formId }: Readonly<{ formId?: string }>) {
  return (
    <div className="gradient-stroke min-h-150 rounded-2xl border-2 border-dashed border-slate-300 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/75">
      <div className="flex h-full flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <MousePointerSquareDashed size={28} />
        </div>
        <p className="max-w-sm text-sm text-slate-600 dark:text-slate-400">
          {formId
            ? `Editing form: ${formId}`
            : 'Drag fields here to start building your form'}
        </p>
      </div>
    </div>
  );
}

function FieldProperties() {
  return (
    <div className="gradient-stroke rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
          <SlidersHorizontal size={18} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Field Properties
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configuration panel
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Select a field to edit its properties.
      </p>
      {/* Field properties form will be added here */}
    </div>
  );
}
