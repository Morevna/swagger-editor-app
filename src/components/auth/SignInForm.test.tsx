import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignInForm from './SignInForm';
import { signInAction } from '@/lib/actions/auth';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('@/lib/actions/auth', () => ({
  signInAction: vi.fn(),
}));

const mockSignInAction = vi.mocked(signInAction);

describe('SignInForm', () => {
  beforeEach(() => {
    mockSignInAction.mockReset();
  });

  it('renders email, password fields and submit button', () => {
    render(<SignInForm />);

    expect(screen.getByLabelText('emailLabel')).toBeInTheDocument();
    expect(screen.getByLabelText('passwordLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'buttonSubmit' })).toBeInTheDocument();
  });

  it('shows validation error on invalid email', async () => {
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'not-an-email');
    await user.type(screen.getByLabelText('passwordLabel'), 'Test!100');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    expect(await screen.findByText('INVALID_EMAIL')).toBeInTheDocument();
    expect(mockSignInAction).not.toHaveBeenCalled();
  });

  it('calls signInAction with correct values on valid submit', async () => {
    mockSignInAction.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'test@test.com');
    await user.type(screen.getByLabelText('passwordLabel'), 'Test!100');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    await waitFor(() => {
      expect(mockSignInAction).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'Test!100',
      });
    });
  });

  it('shows server error when signInAction throws one', async () => {
    mockSignInAction.mockResolvedValue({ error: 'INVALID_CREDENTIALS' });
    const user = userEvent.setup();
    render(<SignInForm />);

    await user.type(screen.getByLabelText('emailLabel'), 'test@test.com');
    await user.type(screen.getByLabelText('passwordLabel'), 'WrongPass1!');
    await user.click(screen.getByRole('button', { name: 'buttonSubmit' }));

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('INVALID_CREDENTIALS');
  });
});
