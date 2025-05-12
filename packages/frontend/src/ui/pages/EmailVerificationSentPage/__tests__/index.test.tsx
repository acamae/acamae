import i18n from '@infrastructure/i18n';
import { render, screen } from '@testing-library/react';
import EmailVerificationSentPage from '@ui/pages/EmailVerificationSentPage';
import React from 'react';
import { I18nextProvider } from 'react-i18next';


import '@testing-library/jest-dom';

describe('EmailVerificationSentPage', () => {
  it('muestra mensaje de verificación enviada', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EmailVerificationSentPage />
      </I18nextProvider>
    );

    expect(screen.getByText(/hemos enviado.*correo/i)).toBeInTheDocument();
  });
});
