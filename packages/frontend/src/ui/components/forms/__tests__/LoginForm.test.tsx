import i18n from '@infrastructure/i18n';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';

import LoginForm from '@/ui/components/Forms/LoginForm';
import '@testing-library/jest-dom';

const mockLogin = jest.fn();
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginForm', () => {
  const defaultProps = {
    redirectTo: '/dashboard',
    onLoginError: jest.fn(),
    login: mockLogin,
    loading: false,
    error: null,
  };

  const setup = (props = {}) =>
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <LoginForm {...defaultProps} {...props} />
        </MemoryRouter>
      </I18nextProvider>
    );

  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockImplementation(async (email, _password) => {
      if (email === 'fail@example.com') {
        return false;
      }
      return true;
    });
  });

  it('renderiza los campos y el botón', () => {
    setup();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /button/i })).toBeInTheDocument();
  });

  it('muestra errores si los campos están vacíos', async () => {
    setup();
    fireEvent.click(screen.getByRole('button', { name: /button/i }));
    expect(await screen.findAllByText(/invalid/i)).toHaveLength(2);
  });

  it('permite mostrar/ocultar contraseña', () => {
    setup();
    const passwordInput = screen.getByLabelText(/password/i);
    const toggleButton = screen.getByRole('button', { name: /toggle/i });

    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('envía el formulario correctamente y navega al dashboard', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /button/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', '12345678');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('muestra error si el login falla', async () => {
    setup();

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'fail@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: '12345678' },
    });

    fireEvent.click(screen.getByRole('button', { name: /button/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
      expect(defaultProps.onLoginError).toHaveBeenCalled();
    });
  });

  it('muestra el error externo cuando se proporciona', () => {
    setup({ error: 'Error externo de prueba' });
    expect(screen.getByText('Error externo de prueba')).toBeInTheDocument();
  });

  it('muestra el botón de carga cuando loading es true', () => {
    setup({ loading: true });
    expect(screen.getByText(/accessing/i)).toBeInTheDocument();
  });
}); 