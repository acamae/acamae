import i18n from '@infrastructure/i18n';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';


import EmailAlreadyVerified from '../index';
import '@testing-library/jest-dom';

describe('EmailAlreadyVerified', () => {
  it('muestra el mensaje de cuenta ya verificada', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <EmailAlreadyVerified />
      </I18nextProvider>
    );

    expect(screen.getByText(/ya ha sido verificada|already been verified/i)).toBeInTheDocument();
  });
});
