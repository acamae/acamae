import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';

/**
 * Configuración y recursos de internacionalización
 * En una arquitectura hexagonal, las traducciones son parte de la infraestructura,
 * ya que son un mecanismo específico de UI/presentación para adaptar la aplicación
 * a diferentes idiomas, y no parte del dominio del negocio.
 */

// Recursos de traducción organizados por idioma
const resources = {
  en: { translation: en },
  es: { translation: es },
};

// Inicialización de la instancia i18n
i18n
  .use(LanguageDetector) // Detecta automáticamente el idioma del navegador
  .use(initReactI18next) // Integra i18next con React
  .init({
    resources,
    fallbackLng: 'es', // Idioma por defecto si no se encuentra la traducción
    interpolation: {
      escapeValue: false, // React ya escapa los valores por defecto
    },
    detection: {
      order: ['localStorage', 'navigator'], // Orden de detección: primero localStorage, luego el navegador
      caches: ['localStorage'], // Almacena la preferencia de idioma en localStorage
    },
  });

export default i18n; 