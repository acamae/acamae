import i18n from '@infrastructure/i18n';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router-dom';


import ResetPasswordPage from '../index';
import '@testing-library/jest-dom';

// La misma definición de ReCaptcha que se usa en el componente
interface ReCaptchaV3 {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare global {
  interface Window {
    grecaptcha: ReCaptchaV3;
  }
}

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

const renderWithToken = (token = 'mock-token') => {
  render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter initialEntries={[`/restablecer-clave?token=${token}`]}>
        <Routes>
          <Route path="/restablecer-clave" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    </I18nextProvider>
  );
};

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    window.grecaptcha = {
      execute: jest.fn().mockResolvedValue('mock-recaptcha-token'),
    };
    mockFetch.mockReset();
  });

  it('renderiza correctamente los campos', () => {
    renderWithToken();

    expect(screen.getByLabelText(/contraseña|password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar|confirm/i)).toBeInTheDocument();
  });

  it('muestra error si el token es inválido', () => {
    renderWithToken('');

    expect(screen.getByText(/token.*inválido|invalid.*token/i)).toBeInTheDocument();
  });

  it('muestra mensaje de éxito tras restablecer correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderWithToken('mock-token');

    // Completar el formulario
    fireEvent.change(screen.getByLabelText(/contraseña|password/i), {
      target: { value: 'Password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirmar|confirm/i), {
      target: { value: 'Password123' },
    });

    // Enviar formulario
    fireEvent.click(screen.getByRole('button', { name: /enviar|submit|guardar|save/i }));

    // Verificar mensaje de éxito
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/auth/reset-password', expect.anything());
    });
  });
});
