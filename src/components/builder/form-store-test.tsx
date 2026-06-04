/**
 * Form Store Test Component
 * Temporary component to verify Zustand store functionality
 * DELETE THIS after verifying store works correctly
 */

'use client';

import { useFormStore } from '@/store';
import { FormField } from '@/types';
import { useState } from 'react';

export function FormStoreTest() {
  const {
    formSchema,
    selectedField,
    addField,
    updateField,
    deleteField,
    setSelectedField,
    resetStore,
  } = useFormStore();

  const [newFieldLabel, setNewFieldLabel] = useState('');
  const [fieldType, setFieldType] = useState<
    'text' | 'email' | 'textarea' | 'select'
  >('text');

  const handleAddField = () => {
    if (!newFieldLabel.trim()) return;

    const field: FormField = {
      id: `field-${Date.now()}`,
      name: `field_${Date.now()}`,
      type: fieldType,
      label: newFieldLabel,
      required: false,
    };

    addField(field);
    setNewFieldLabel('');
  };

  const handleUpdateFieldLabel = (fieldId: string) => {
    const newLabel = prompt('Enter new label:');
    if (newLabel) {
      updateField(fieldId, { label: newLabel });
    }
  };

  const handleToggleRequired = (fieldId: string) => {
    const field = formSchema.find((f) => f.id === fieldId);
    if (field) {
      updateField(fieldId, { required: !field.required });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <h2 className="text-lg font-bold text-blue-900 mb-2">
          Form Store Test
        </h2>
        <p className="text-sm text-blue-700">
          This component tests Zustand store. Delete after verification.
        </p>
      </div>

      {/* Add Field Section */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-800">Add New Field</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Field label..."
            value={newFieldLabel}
            onChange={(e) => setNewFieldLabel(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddField()}
            className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={fieldType}
            onChange={(e) =>
              setFieldType(
                e.target.value as 'text' | 'email' | 'textarea' | 'select'
              )
            }
            className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
            <option value="select">Select</option>
          </select>
          <button
            onClick={handleAddField}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Add Field
          </button>
        </div>
      </div>

      {/* Form Schema Display */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">
            Form Schema ({formSchema.length})
          </h3>
          <button
            onClick={resetStore}
            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
          >
            Reset Store
          </button>
        </div>

        {formSchema.length === 0 ? (
          <p className="text-gray-400 text-sm italic">
            No fields yet. Add one above.
          </p>
        ) : (
          <div className="space-y-2">
            {formSchema.map((field) => (
              <div
                key={field.id}
                onClick={() => setSelectedField(field)}
                className={`p-3 border rounded cursor-pointer transition ${
                  selectedField?.id === field.id
                    ? 'bg-blue-50 border-blue-500 border-2'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{field.label}</p>
                    <p className="text-xs text-gray-500">
                      ID: {field.id} | Type: {field.type}
                    </p>
                    <p className="text-xs text-gray-500">
                      Required:{' '}
                      <span className="font-semibold">
                        {field.required ? 'Yes' : 'No'}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRequired(field.id);
                      }}
                      className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition"
                    >
                      Toggle Required
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUpdateFieldLabel(field.id);
                      }}
                      className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(field.id);
                      }}
                      className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Field Display */}
      <div className="bg-white border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-800">
          Selected Field (for editing)
        </h3>
        {selectedField ? (
          <div className="bg-green-50 border border-green-300 rounded p-3 space-y-2">
            <p>
              <span className="font-semibold">Label:</span>{' '}
              {selectedField.label}
            </p>
            <p>
              <span className="font-semibold">Type:</span> {selectedField.type}
            </p>
            <p>
              <span className="font-semibold">ID:</span> {selectedField.id}
            </p>
            <p>
              <span className="font-semibold">Required:</span>{' '}
              {selectedField.required ? 'Yes' : 'No'}
            </p>
            <button
              onClick={() => setSelectedField(null)}
              className="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Deselect
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">
            Click on a field to select it for editing.
          </p>
        )}
      </div>

      {/* Store State JSON */}
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs space-y-2">
        <p className="text-gray-400">Store State (JSON):</p>
        <pre className="overflow-auto max-h-48">
          {JSON.stringify(
            {
              formSchema,
              selectedField,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
}
