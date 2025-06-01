import path from 'path';

import { config as dotenvConfig } from 'dotenv';

// Cargar variables de entorno desde .env.test
dotenvConfig({ path: path.resolve(__dirname, '.env.test') });

import '@testing-library/jest-dom';
import i18n from '@infrastructure/i18n'; // Importar i18n
import esTranslations from '@infrastructure/i18n/locales/es-ES.json'; // Importar traducciones

// Mock para console.error y console.warn
let consoleErrorSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;

jest.mock('redux-persist', () => ({
  persistReducer: (_config: unknown, reducers: unknown) => reducers,
  persistStore: () => ({ purge: jest.fn(), flush: jest.fn() }),
  createTransform: jest.fn(() => ({})),
}));

beforeAll(async () => {
  // Hacer beforeAll asíncrono
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

  if (!i18n.hasResourceBundle('es', 'translation')) {
    i18n.addResourceBundle('es', 'translation', esTranslations, true, true);
  }

  if (i18n.language !== 'es') {
    await i18n.changeLanguage('es');
  }
});

afterEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

afterAll(() => {
  if (consoleErrorSpy) {
    consoleErrorSpy.mockRestore();
  }
  if (consoleWarnSpy) {
    // Restaurar también console.warn spy
    consoleWarnSpy.mockRestore();
  }
});
