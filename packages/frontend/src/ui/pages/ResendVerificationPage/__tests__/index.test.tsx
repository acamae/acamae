import i18n from '@infrastructure/i18n';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';


import ResendVerificationPage from '../index';
import '@testing-library/jest-dom';

// Mock de fetch global
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('ResendVerificationPage', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('renderiza el formulario correctamente', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <ResendVerificationPage />
      </I18nextProvider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla la petición', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'USER_NOT_FOUND' }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <ResendVerificationPage />
      </I18nextProvider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveClass('alert-danger');
    });
  });

  it('muestra mensaje de éxito si el email se envía correctamente', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(
      <I18nextProvider i18n={i18n}>
        <ResendVerificationPage />
      </I18nextProvider>
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveClass('alert-success');
    });
  });
});
