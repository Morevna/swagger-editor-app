'use client';

import { SignUpFormValues, signUpSchema } from '@/lib/validation/auth';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { signUpAction } from '@/lib/actions/auth';

function SignUpForm() {
  const tErr = useTranslations('authErrors');
  const t = useTranslations('signUpForm');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    setFormError(null);
    const result = await signUpAction(values);
    if (result?.error) {
      setFormError(tErr(result.error));
    }
    setIsSubmitting(false);
  };

  return (
    <Card
      className="
        w-full
        sm:max-w-md
      "
    >
      <CardHeader>
        <CardTitle>{t('cardTitle')}</CardTitle>
        <CardDescription>{t('cardDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="sign-in-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="email-input">{t('emailLabel')}</FieldLabel>
                  <Input
                    {...field}
                    type="email"
                    id="email-input"
                    aria-invalid={fieldState.invalid}
                    placeholder={t('emailPlaceholder')}
                    autoComplete="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[{ message: tErr(fieldState.error?.message ?? '') }]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password-input">{t('passwordLabel')}</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="password-input"
                      aria-invalid={fieldState.invalid}
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="current-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[{ message: tErr(fieldState.error?.message ?? '') }]} />
                    )}
                  </Field>
                );
              }}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirm-password-input">{t('passwordLabel')}</FieldLabel>
                    <Input
                      {...field}
                      type="password"
                      id="confirm-password-input"
                      aria-invalid={fieldState.invalid}
                      placeholder={t('passwordPlaceholder')}
                      autoComplete="current-password"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[{ message: tErr(fieldState.error?.message ?? '') }]} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          {formError && (
            <p role="alert" className="mt-4 text-sm text-destructive">
              {formError}
            </p>
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button type="submit" form="sign-in-form" disabled={isSubmitting}>
            {t('buttonSubmit')}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;
