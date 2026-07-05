'use server';

import { createClient } from '@/lib/supabase/server';
import { AUTH_ERROR_CODES, type AuthErrorCode } from '@/lib/validation/auth-error-codes';
import {
  signInSchema,
  signUpSchema,
  type SignInFormValues,
  type SignUpFormValues,
} from '@/lib/validation/auth';
import { redirect } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';

type ActionResult = { error?: AuthErrorCode } | void;

export async function signInAction(values: SignInFormValues): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(values);
  if (!parsed.success) {
    return { error: AUTH_ERROR_CODES.INVALID_CREDENTIALS };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: AUTH_ERROR_CODES.INVALID_CREDENTIALS };
  }

  const locale = await getLocale();
  redirect({ href: '/', locale });
}

export async function signUpAction(values: SignUpFormValues): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(values);
  if (!parsed.success) {
    return { error: AUTH_ERROR_CODES.SIGNUP_FAILED };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.code === 'email_exists') {
      return { error: AUTH_ERROR_CODES.EMAIL_TAKEN };
    }
    return { error: AUTH_ERROR_CODES.SIGNUP_FAILED };
  }

  const locale = await getLocale();
  redirect({ href: '/', locale });
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const locale = await getLocale();
  redirect({ href: '/', locale });
}
