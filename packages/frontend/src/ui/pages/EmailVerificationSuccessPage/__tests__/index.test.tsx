import i18n from '@infrastructure/i18n';
import { render, screen } from '@testing-library/react';
import EmailVerificationSuccess from '@ui/pages/EmailVerificationSuccessPage';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';


import '@testing-library/jest-dom';

describe('EmailVerificationSuccess', () => {
  it('muestra mensaje de verificación exitosa y enlace para continuar', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <EmailVerificationSuccess />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/verificado.*correctamente|success/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });
});
