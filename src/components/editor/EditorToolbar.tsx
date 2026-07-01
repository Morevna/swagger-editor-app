'use client';

import React from 'react';
import { useEditorStore } from '../../stores/editorStore';
import { convertFormat } from '../../lib/editor-utils';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export const EditorToolbar: React.FC = () => {
  const t = useTranslations();
  const { code, language, errors, setCode, setLanguage, setErrors } = useEditorStore();

  const handleConvert = () => {
    const conversion = convertFormat(code, language);
    if (conversion.success) {
      setCode(conversion.result);
      setLanguage(conversion.newLang);
      setErrors([]);
    } else {
      setErrors([t('editor.conversionError') || 'Cannot convert invalid schema']);
    }
  };

  return (
    <div className="flex h-12 items-center justify-between border-b bg-muted/40 p-2">
      <div className="flex items-center gap-2">
        <span className="rounded-sm bg-primary/10 px-2 py-1 font-mono text-xs text-primary uppercase">
          {language}
        </span>
        <Button size="sm" variant="outline" onClick={handleConvert}>
          {language === 'json' ? '→ YAML' : '→ JSON'}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {errors.length > 0 ? (
          <div className="flex items-center gap-1.5 text-destructive">
            <AlertCircle className="size-4 shrink-0" />
            <span className="max-w-[200px] truncate text-xs font-medium">{errors[0]}</span>
          </div>
        ) : (
          <div
            className="
      flex items-center gap-1.5 text-emerald-600
      dark:text-emerald-500
    "
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <span className="text-xs font-medium">Valid</span>
          </div>
        )}
      </div>
    </div>
  );
};
