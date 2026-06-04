/**
 * Zustand Global Form Store
 * Manages form schema and selected field state
 * Used by: Form Builder, Field Properties, Form Renderer
 */

import { create } from 'zustand';
import { FormField } from '@/types';

/**
 * Form Store State Interface
 * Defines all state properties and actions
 */
interface FormStore {
  // STATE
  formSchema: FormField[];
  selectedField: FormField | null;

  // ACTIONS - Form Schema Management
  setFormSchema: (schema: FormField[]) => void;
  addField: (field: FormField) => void;
  updateField: (fieldId: string, updates: Partial<FormField>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (newOrder: FormField[]) => void;

  // ACTIONS - Selected Field Management
  setSelectedField: (field: FormField | null) => void;

  // ACTIONS - Utility
  resetStore: () => void;
}

/**
 * Default initial state
 */
const initialState = {
  formSchema: [] as FormField[],
  selectedField: null as FormField | null,
};

/**
 * Zustand Store
 * Manages global form builder state with immutable updates
 */
export const useFormStore = create<FormStore>((set) => ({
  // INITIAL STATE
  ...initialState,

  // FORM SCHEMA ACTIONS
  /**
   * Replace entire form schema
   * Useful for: loading saved forms, resetting builder
   */
  setFormSchema: (schema: FormField[]) => {
    set({ formSchema: schema });
  },

  /**
   * Add a new field to form schema
   * Appends field to end of form
   */
  addField: (field: FormField) => {
    set((state) => ({
      formSchema: [...state.formSchema, field],
      selectedField: field, // Auto-select newly added field
    }));
  },

  /**
   * Update an existing field
   * Supports partial updates using shallow merge
   */
  updateField: (fieldId: string, updates: Partial<FormField>) => {
    set((state) => ({
      formSchema: state.formSchema.map((field: FormField) =>
        field.id === fieldId ? { ...field, ...updates } : field
      ),
      // Update selectedField if we're updating it
      selectedField:
        state.selectedField?.id === fieldId
          ? { ...state.selectedField, ...updates }
          : state.selectedField,
    }));
  },

  /**
   * Delete a field from form schema by ID
   * If deleted field was selected, deselect it
   */
  deleteField: (fieldId: string) => {
    set((state) => ({
      formSchema: state.formSchema.filter(
        (field: FormField) => field.id !== fieldId
      ),
      selectedField:
        state.selectedField?.id === fieldId ? null : state.selectedField,
    }));
  },

  /**
   * Reorder fields in form schema
   * Useful for: drag-and-drop functionality
   */
  reorderFields: (newOrder: FormField[]) => {
    set({ formSchema: newOrder });
  },

  // SELECTED FIELD ACTIONS
  /**
   * Set or clear the currently selected field
   * Triggers property editor UI updates
   */
  setSelectedField: (field: FormField | null) => {
    set({ selectedField: field });
  },

  // UTILITY ACTIONS
  /**
   * Reset store to initial state
   * Useful for: creating new forms, clearing builder
   */
  resetStore: () => {
    set(initialState);
  },
}));

/**
 * USAGE EXAMPLES:
 *
 * // In a component:
 * const { formSchema, selectedField, addField } = useFormStore();
 *
 * // Add a new field:
 * addField({
 *   id: 'field-1',
 *   type: 'text',
 *   label: 'First Name',
 *   required: true,
 * });
 *
 * // Update a field:
 * updateField('field-1', { label: 'Full Name', required: false });
 *
 * // Select a field for editing:
 * setSelectedField(formSchema[0]);
 *
 * // Delete a field:
 * deleteField('field-1');
 */
