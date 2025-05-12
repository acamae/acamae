import i18n from '@infrastructure/i18n';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';


import EmailVerificationExpired from '../index';
import '@testing-library/jest-dom';

describe('EmailVerificationExpired', () => {
  it('muestra mensaje de enlace expirado y enlace para reenviar', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <EmailVerificationExpired />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/enlace.*expirado|expired/i)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /reenviar/i })).toBeInTheDocument();
  });
});
