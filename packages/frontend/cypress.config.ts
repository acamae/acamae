import { defineConfig } from 'cypress';
import dotenv from 'dotenv';
import env from '@infrastructure/config/environment';

// Cargar variables de entorno según el ambiente
dotenv.config({ path: `.env.${env}` });

export default defineConfig({
  e2e: {
    baseUrl: env.CYPRESS_BASE_URL || 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // Configuración para manejar certificados SSL en desarrollo
      if (env.NODE_ENV === 'development') {
        on('before:browser:launch', (browser, launchOptions) => {
          if (browser.name === 'chrome' || browser.name === 'chromium') {
            launchOptions.args.push('--ignore-certificate-errors');
          }
          return launchOptions;
        });
      }
    },
  },
}); 