'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormStore } from '@/store/useFormStore';
import type { FormField } from '@/types';
import type { Field as ApiField } from '@/types/form.types';
import { Button, Card } from '@/components/shared';
import { FieldConfigPanel } from '@/components/builder/FieldConfigPanel';
import { templates } from '@/lib/templates';
import { createForm } from '@/lib/api';
import { Plus, Zap, Sparkles, Download, Layout, Mail, ListChecks, Lightbulb } from 'lucide-react';

interface SortableFieldProps {
  field: FormField;
  isSelected: boolean;
  onSelect: (field: FormField) => void;
}

function SortableField({ field, isSelected, onSelect }: SortableFieldProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: field.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  const getFieldIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail size={16} />;
      case 'select':
        return <ListChecks size={16} />;
      default:
        return <Layout size={16} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSelect(field)}
      className={`w-full cursor-pointer rounded-xl border border-slate-300/90 bg-white/90 p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md dark:border-slate-600 dark:bg-slate-900/80 ${
        isSelected
          ? 'border-cyan-500 ring-2 ring-cyan-500 dark:border-cyan-400'
          : 'hover:border-slate-400 dark:hover:border-slate-500'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {getFieldIcon(field.type)}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{field.label}</p>
            {field.required && (
              <p className="text-xs text-red-500">Required</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 capitalize">
            {field.type}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function BuilderPage() {
  const router = useRouter();
  const [authStatus, setAuthStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const { formSchema, addField, reorderFields, selectedField, setSelectedField, setFormSchema } = useFormStore();
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [currentFormId, setCurrentFormId] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuccess, setAiSuccess] = useState<string | null>(null);
  const [optimizeLoading, setOptimizeLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const [optimizeError, setOptimizeError] = useState<string | null>(null);
  const [optimizeSuccess, setOptimizeSuccess] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [optimizedFields, setOptimizedFields] = useState<FormField[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/auth/me', { credentials: 'same-origin' })
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setAuthStatus(j?.user ? 'authenticated' : 'unauthenticated');
      })
      .catch(() => {
        if (!mounted) return;
        setAuthStatus('unauthenticated');
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentFormId) {
      setShareUrl(`${window.location.origin}/form/${currentFormId}`);
    }
  }, [currentFormId]);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/login');
    }
  }, [authStatus, router]);

  if (authStatus === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (authStatus === 'unauthenticated') return null;

  const handleSaveForm = async () => {
    setSaving(true);
    setSaveMessage(null);

    try {
      const prepared: ApiField[] = formSchema.map((f) => ({
        id: f.id,
        name: (f as any).name ?? `field_${f.id}`,
        type: f.type as ApiField['type'],
        label: f.label,
        placeholder: f.placeholder ?? undefined,
        required: !!f.required,
        options: f.options ? f.options.map((o) => o.value) : undefined,
      }));

      const response = await createForm({
        title: 'My Form',
        schema: { fields: prepared as any },
      });

      const formId = (response.data as any)?.id;
      if (typeof formId === 'string') {
        setCurrentFormId(formId);
      }

      setCurrentFormId(formId);
      setSaveMessage(response.message || 'Form saved successfully');
    } catch (error) {
      setSaveMessage(String(error));
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyMessage('Link copied to clipboard!');
      window.setTimeout(() => setCopyMessage(null), 3000);
    } catch (error) {
      setCopyMessage('Unable to copy link');
      window.setTimeout(() => setCopyMessage(null), 3000);
    }
  };

  const handleShareClick = () => {
    if (!currentFormId) {
      setCopyMessage('Save the form first to generate a share link.');
      window.setTimeout(() => setCopyMessage(null), 3000);
      return;
    }

    setShareUrl(`${window.location.origin}/form/${currentFormId}`);
    setCopyMessage('Share link generated below.');
    window.setTimeout(() => setCopyMessage(null), 3000);
  };

  const handleAddField = (type: 'text' | 'email' | 'select') => {
    const newField = {
      id: Date.now().toString(),
      name: `field_${Date.now()}`,
      type,
      label: 'New Field',
      required: false,
    } as FormField & { name: string };
    addField(newField);
  };

  const normalizeTemplateFields = (fields: typeof templates[number]['schema']['fields']) => {
    return fields.map((field) => ({
      ...field,
      options:
        field.options?.map((option) => ({ label: option, value: option })) ?? undefined,
    })) as unknown as FormField[];
  };

  const handleLoadTemplate = (templateId: string) => {
    const template = templates.find((item) => item.id === templateId);
    if (!template) return;

    setFormSchema(normalizeTemplateFields(template.schema.fields));
    setSelectedField(null);
  };

  const handleGenerateForm = async () => {
    if (!aiPrompt.trim()) {
      setAiError('Please enter a prompt.');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiSuccess(null);

    try {
      const response = await fetch('/api/ai/generate-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to generate form schema');
      }

      const generatedFields = Array.isArray(result.data?.fields)
        ? result.data.fields.map((field: any, index: number) => ({
            id: field.id || `field_${Date.now()}_${index}`,
            name: field.name || `field_${Date.now()}_${index}`,
            type: ['text', 'email', 'number', 'textarea', 'select'].includes(field.type)
              ? field.type
              : 'text',
            label: field.label || 'Untitled Field',
            placeholder: field.placeholder ?? undefined,
            required: Boolean(field.required),
            options: Array.isArray(field.options)
              ? field.options.map((option: any) => ({ label: String(option), value: String(option) }))
              : undefined,
          }))
        : [];

      if (generatedFields.length === 0) {
        throw new Error('Generated schema did not include any fields.');
      }

      setFormSchema(generatedFields);
      setSelectedField(null);
      setAiSuccess('✓ Form generated successfully');
    } catch (error) {
      setAiError(String(error));
      setFormSchema([]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleOptimize = async () => {
    if (!currentFormId) {
      setOptimizeError('Save the form first to optimize it.');
      return;
    }

    setOptimizeLoading(true);
    setOptimizeError(null);
    setOptimizeSuccess(null);

    try {
      const response = await fetch('/api/ai/optimize-form', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: currentFormId }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Unable to optimize form');
      }

      const suggestions = Array.isArray(result.data?.suggestions)
        ? result.data.suggestions
        : [];

      const optimized = Array.isArray(result.data?.optimizedFields)
        ? result.data.optimizedFields.map((field: any, index: number) => ({
            id: field.id || `field_${Date.now()}_${index}`,
            name: field.name || `field_${Date.now()}_${index}`,
            type: ['text', 'email', 'number', 'textarea', 'select'].includes(field.type)
              ? field.type
              : 'text',
            label: field.label || 'Untitled Field',
            placeholder: field.placeholder ?? undefined,
            required: Boolean(field.required),
            options: Array.isArray(field.options)
              ? field.options.map((option: any) => ({ label: String(option), value: String(option) }))
              : undefined,
          }))
        : [];

      if (suggestions.length === 0 && optimized.length === 0) {
        throw new Error('AI returned no optimization suggestions.');
      }

      setAiSuggestions(suggestions);
      setOptimizedFields(optimized);
      setOptimizeSuccess('✓ Optimization ready. Review suggestions and apply changes.');
    } catch (error) {
      setOptimizeError(String(error));
    } finally {
      setOptimizeLoading(false);
    }
  };

  const applyOptimization = async () => {
    if (!currentFormId) {
      setOptimizeError('No saved form available to apply optimization.');
      return;
    }

    if (optimizedFields.length === 0) {
      setOptimizeError('No optimized fields to apply.');
      return;
    }

    setApplyLoading(true);
    setOptimizeError(null);
    setOptimizeSuccess(null);

    try {
      setFormSchema(optimizedFields);
      setSelectedField(null);

      const response = await fetch(`/api/forms/${currentFormId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schema: { fields: optimizedFields } }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to save optimized form');
      }

      setOptimizeSuccess('✓ Optimized form applied and saved successfully.');
    } catch (error) {
      setOptimizeError(String(error));
    } finally {
      setApplyLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = formSchema.findIndex((field) => field.id === active.id);
    const newIndex = formSchema.findIndex((field) => field.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const newOrder = arrayMove(formSchema, oldIndex, newIndex);
    reorderFields(newOrder);
  };

  return (
    <div className="min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto flex flex-col lg:flex-row max-w-[1600px] gap-6 items-start">
        {/* Sidebar */}
        <aside className="w-full lg:w-72 space-y-4 flex-shrink-0">
          {/* Add Fields Card */}
          <Card className="p-6 gradient-stroke">
            <div className="flex items-center gap-2 mb-4">
              <Plus size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Fields</h3>
            </div>
            <div className="space-y-2">
              <Button
                onClick={() => handleAddField('text')}
                className="w-full justify-start"
                size="md"
                variant="outline"
              >
                <Plus size={16} />
                Text Input
              </Button>
              <Button
                onClick={() => handleAddField('email')}
                className="w-full justify-start"
                size="md"
                variant="outline"
              >
                <Mail size={16} />
                Email Field
              </Button>
              <Button
                onClick={() => handleAddField('select')}
                className="w-full justify-start"
                size="md"
                variant="outline"
              >
                <ListChecks size={16} />
                Select Field
              </Button>
            </div>
          </Card>

          {/* Templates Card */}
          <Card className="p-6 gradient-stroke">
            <div className="flex items-center gap-2 mb-4">
              <Layout size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Templates</h3>
            </div>
            <div className="space-y-2">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  onClick={() => handleLoadTemplate(template.id)}
                  className="w-full justify-start text-left"
                  size="md"
                  variant="ghost"
                >
                  <span className="truncate text-sm">{template.title}</span>
                </Button>
              ))}
            </div>
          </Card>

          {/* AI Generator Card */}
          <Card className="p-6 gradient-stroke">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Generate with AI</h3>
            </div>
            <textarea
              value={aiPrompt}
              onChange={(event) => setAiPrompt(event.target.value)}
              placeholder="Describe the form you want..."
              className="mb-3 w-full resize-none rounded-xl border border-slate-300/90 bg-white/90 px-3.5 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:border-slate-600 dark:bg-slate-900/85 dark:text-slate-50 dark:placeholder:text-slate-400"
              rows={4}
            />
            {aiError && (
              <div className="mb-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-3 py-2 text-xs text-red-700 dark:text-red-200">
                {aiError}
              </div>
            )}
            {aiSuccess && (
              <div className="mb-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
                {aiSuccess}
              </div>
            )}
            <Button
              onClick={handleGenerateForm}
              disabled={aiLoading}
              isLoading={aiLoading}
              className="w-full"
              variant="ai"
              size="md"
            >
              <Sparkles size={16} />
              Generate
            </Button>
          </Card>

          {/* Optimize Card */}
          <Card className="p-6 gradient-stroke">
            <div className="flex items-center gap-2 mb-4">
              <Zap size={20} className="text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Optimize</h3>
            </div>
            <Button
              onClick={handleOptimize}
              disabled={optimizeLoading || !currentFormId}
              isLoading={optimizeLoading}
              className="w-full"
              variant="secondary"
              size="md"
            >
              <Lightbulb size={16} />
              {optimizeLoading ? 'Optimizing...' : 'Run AI Optimization'}
            </Button>
            {optimizeError && (
              <div className="mt-3 rounded-lg border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/30 px-3 py-2 text-xs text-red-700 dark:text-red-200">
                {optimizeError}
              </div>
            )}
            {optimizeSuccess && (
              <div className="mt-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
                {optimizeSuccess}
              </div>
            )}
            {aiSuggestions.length > 0 && (
              <div className="mt-3 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 p-3">
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">Suggestions:</p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  {aiSuggestions.slice(0, 3).map((s, i) => (
                    <li key={i}>• {s}</li>
                  ))}
                </ul>
                <Button
                  onClick={applyOptimization}
                  disabled={applyLoading}
                  isLoading={applyLoading}
                  className="w-full mt-3"
                  variant="success"
                  size="md"
                >
                  Apply Changes
                </Button>
              </div>
            )}
          </Card>

          {/* Save Card */}
          <Card className="p-6 border-blue-300/80 bg-blue-50/90 dark:border-blue-700 dark:bg-blue-900/20">
            <div className="flex items-center gap-2 mb-4">
              <Download size={20} className="text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Publish</h3>
            </div>
            <Button
              onClick={handleSaveForm}
              disabled={saving || formSchema.length === 0}
              isLoading={saving}
              className="w-full"
              variant="success"
              size="md"
            >
              {saving ? 'Saving...' : 'Save Form'}
            </Button>
            {saveMessage && (
              <div className="mt-3 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-200">
                {saveMessage}
              </div>
            )}
          </Card>

          <Card className="p-6 border-slate-300/80 bg-slate-50/90 dark:border-slate-700 dark:bg-slate-900/85">
            <div className="flex items-center gap-2 mb-4">
              <Layout size={20} className="text-slate-700 dark:text-slate-200" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Share this form</h3>
            </div>
            {currentFormId ? (
              <>
                <div className="mb-3">
                  <Button type="button" onClick={handleShareClick} className="w-full mb-3" variant="ai" size="md">
                    Share Form
                  </Button>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Shareable link</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 rounded-xl border border-slate-300/90 bg-white/90 px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-50"
                    />
                    <Button type="button" onClick={handleCopyLink} size="sm" variant="secondary">
                      Copy
                    </Button>
                  </div>
                </div>
                {copyMessage && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-300">{copyMessage}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Save the form to generate a public share link.
              </p>
            )}
          </Card>
        </aside>

        {/* Main Canvas */}
        <section className="w-full lg:flex-1 space-y-6">
          {/* Canvas Header */}
          <Card className="p-6 gradient-stroke">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Form Builder</h1>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {formSchema.length} {formSchema.length === 1 ? 'field' : 'fields'}
                </p>
              </div>
            </div>
          </Card>

          {/* Canvas */}
          <Card className="min-h-[500px] p-6 gradient-stroke">
            {formSchema.length === 0 ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/90 px-6 py-12 text-center dark:border-slate-600 dark:bg-slate-900/80">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800">
                  <Layout size={32} className="text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white">No fields yet</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-xs">
                  Start building by adding fields from the left sidebar or generating a form with AI.
                </p>
              </div>
            ) : (
              <DndContext onDragEnd={handleDragEnd}>
                <SortableContext items={formSchema.map((field) => field.id)}>
                  <div className="space-y-3">
                    {formSchema.map((field) => (
                      <SortableField
                        key={field.id}
                        field={field}
                        isSelected={selectedField?.id === field.id}
                        onSelect={setSelectedField}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </Card>
        </section>

        {/* Config Panel */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <FieldConfigPanel />
        </div>
      </div>
    </div>
  );
}
