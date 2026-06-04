'use client';

import { Button, type ButtonProps } from '@/components/shared';

export interface FormSubmitButtonProps extends Omit<ButtonProps, 'type'> {
  isSubmitting?: boolean;
  submitLabel?: string;
  submittingLabel?: string;
}

export function FormSubmitButton({
  isSubmitting = false,
  submitLabel = 'Submit',
  submittingLabel = 'Submitting...',
  ...props
}: FormSubmitButtonProps) {
  return (
    <Button
      type="submit"
      isLoading={isSubmitting}
      disabled={isSubmitting}
      {...props}
    >
      {isSubmitting ? submittingLabel : submitLabel}
    </Button>
  );
}
