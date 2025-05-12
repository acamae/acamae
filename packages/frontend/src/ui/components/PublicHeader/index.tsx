import LanguageSelector from '@ui/components/LanguageSelector';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const PublicHeader: React.FC = () => {
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        {t('app.name')}
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        <LanguageSelector />
        <Link to="/login" className="btn btn-outline-light btn-sm">
          {t('nav.login')}
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">
          {t('nav.register')}
        </Link>
      </div>
    </nav>
  );
};

export default PublicHeader;
