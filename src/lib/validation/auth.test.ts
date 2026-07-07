import { AUTH_ERROR_CODES } from '../supabase/auth-error-codes';
import { signInSchema, signUpSchema } from './auth';

const validSignInInput = {
  email: 'test@test.com',
  password: 'Test!100',
};

describe('signInSchema', () => {
  it('pass with valid credentials', () => {
    const input = validSignInInput;

    const result = signInSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
  it('fail on invalid email', () => {
    const input = {
      ...validSignInInput,
      email: 'bad_email_test',
    };

    const result = signInSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.INVALID_EMAIL);
  });
  it('fail on empty password', () => {
    const input = {
      ...validSignInInput,
      password: '',
    };

    const result = signInSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.REQUIRED);
  });
});

const validRegisterInput = {
  email: 'test@test.com',
  password: 'Test!100',
  confirmPassword: 'Test!100',
};

describe('signUpSchema', () => {
  it('pass with valid input', () => {
    const input = validRegisterInput;

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
  it('fail on invalid email', () => {
    const input = {
      ...validRegisterInput,
      email: 'bad_email',
    };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.INVALID_EMAIL);
  });
  it('fail when password is too short', () => {
    const input = { ...validRegisterInput, password: 'T1!a', confirmPassword: 'T1!a' };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.MIN_LENGTH);
  });
  it('fail when password has no letter', () => {
    const input = { ...validRegisterInput, password: '12345678!', confirmPassword: '12345678!' };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.NO_LETTER);
  });
  it('fail when password has no number', () => {
    const input = { ...validRegisterInput, password: 'Testtest!', confirmPassword: 'Testtest!' };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.NO_NUMBER);
  });
  it('fail when password has no special character', () => {
    const input = { ...validRegisterInput, password: 'Test1234', confirmPassword: 'Test1234' };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.NO_SPECIAL);
  });
  it('fail when passwords do not match, error attached to confirmPassword', () => {
    const input = { ...validRegisterInput, confirmPassword: 'Different1!' };

    const result = signUpSchema.safeParse(input);

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(AUTH_ERROR_CODES.NO_MATCH);
  });
});
