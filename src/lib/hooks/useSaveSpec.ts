'use client';

import { useState, useTransition } from 'react';
import { saveSpec } from '../actions/saveSpec';

export default function useSaveSpec(initialValue: string, isAuthenticated: boolean) {
  const [lastSaved, setLastSaved] = useState(initialValue);
  const [isPending, startTransition] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);

  function save(value: string) {
    if (!isAuthenticated || value === lastSaved) return;

    startTransition(async () => {
      const { error } = await saveSpec(value);
      if (error) {
        setSaveError(error);
      } else {
        setSaveError(null);
        setLastSaved(value);
      }
    });
  }

  return { save, isPending, saveError, isDirty: (value: string) => value !== lastSaved };
}
