import * as z from 'zod';
import { AUTH_ERROR_CODES } from './auth-error-codes';

export const signInSchema = z.object({
  email: z.email(AUTH_ERROR_CODES.INVALID_EMAIL),
  password: z.string().min(1, AUTH_ERROR_CODES.REQUIRED),
});

export const signUpSchema = z
  .object({
    email: z.email(AUTH_ERROR_CODES.INVALID_EMAIL),
    password: z
      .string()
      .min(8, AUTH_ERROR_CODES.MIN_LENGTH)
      .regex(/[a-zA-Z]/, AUTH_ERROR_CODES.NO_LETTER)
      .regex(/[0-9]/, AUTH_ERROR_CODES.NO_NUMBER)
      .regex(/[^a-zA-Z0-9]/, AUTH_ERROR_CODES.NO_SPECIAL),
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: AUTH_ERROR_CODES.NO_MATCH,
        path: ['confirmPassword'],
      });
    }
  });

export type SignInFormValues = z.infer<typeof signInSchema>;
export type SignUpFormValues = z.infer<typeof signUpSchema>;
