import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUpForm from './SignUpForm';
import { signUpAction } from '@/lib/actions/auth';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/lib/actions/auth', () => ({
  signUpAction: vi.fn(),
}));

const mockSignUpAction = vi.mocked(signUpAction);

describe('SignUpForm', () => {
  beforeEach(() => {
    mockSignUpAction.mockReset();
  });

  it('renders email, password fields and submit button', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText('emailLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('passwordLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('confirmPasswordLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttonSubmit' })).toBeInTheDocument();
  });

  it('shows validation error on invalid email', async () => {
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'not-an-email');
    await user.type(screen.getByLabelText('passwordLabel'), 'Test!100');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    expect(await screen.findByText('INVALID_EMAIL')).toBeInTheDocument();
    expect(mockSignUpAction).not.toHaveBeenCalled();
  });

  it('calls signUpAction with correct values on valid submit', async () => {
    mockSignUpAction.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'test@test.com');
    await user.type(screen.getByLabelText('passwordLabel'), 'Test!100');
    await user.type(screen.getByLabelText('confirmPasswordLabel'), 'Test!100');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    await waitFor(() => {
      expect(mockSignUpAction).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Test!100',
        confirmPassword: 'Test!100',
      });
    });
  });

  it('shows server error when signUpAction throws one', async () => {
    mockSignUpAction.mockResolvedValue({ error: 'INVALID_CREDENTIALS' });
    const user = userEvent.setup();
    render(<SignUpForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'test@test.com');
    await user.type(screen.getByLabelText('passwordLabel'), 'Test!100');
    await user.type(screen.getByLabelText('confirmPasswordLabel'), 'Test!100');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('INVALID_CREDENTIALS');
  });
});
