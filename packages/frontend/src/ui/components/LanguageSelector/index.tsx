import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language ? i18n.language.split('-')[0] : 'es';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = e.target.value;
    i18n.changeLanguage(selectedLang);
    localStorage.setItem('i18nextLng', selectedLang);
  };

  return (
    <div className="d-flex align-items-center">
      <label htmlFor="lang-select" className="visually-hidden">
        {t('language.selector_label')}
      </label>
      <select
        id="lang-select"
        name="language"
        className="form-select form-select-sm w-auto ms-2"
        value={currentLang}
        onChange={handleChange}
        aria-label={t('language.selector_label')}
      >
        <option value="es">{t('language.es')}</option>
        <option value="en">{t('language.en')}</option>
      </select>
    </div>
  );
};

export default LanguageSelector;
