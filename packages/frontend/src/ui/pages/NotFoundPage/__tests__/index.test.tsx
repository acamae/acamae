import i18n from '@infrastructure/i18n';
import { render, screen } from '@testing-library/react';
import NotFoundPage from '@ui/pages/NotFoundPage';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter } from 'react-router-dom';


import '@testing-library/jest-dom';

describe('NotFoundPage', () => {
  it('muestra el mensaje de página no encontrada y enlace para volver', () => {
    render(
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </I18nextProvider>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveTextContent(/volver|back/i);
  });
});
