import { logWebVitalsReport } from '@shared/utils/webVitals';
import App from '@ui/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@infrastructure/i18n';

// Importar estilos globales si es necesario
// import '@shared/styles/global.scss';

const container = document.getElementById('root');

if (!container) {
  throw new Error('No se encontró el elemento con id "root" en el DOM.');
}

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Llamar a la función después de un breve retraso
setTimeout(logWebVitalsReport, 1000);
