import { getTranslations } from 'next-intl/server';
import * as z from 'zod';

const t = await getTranslations('authErrors');

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const signUpSchema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(8, t('minLength'))
      .regex(/[a-zA-Z]/, t('noLatter'))
      .regex(/0-9/, t('noNumber'))
      .regex(/[^a-zA-Z0-9]/, t('noSpecial')),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: t('noMatch'),
        path: ['confirmPassword'],
      });
    }
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
