import LanguageSelector from '@ui/components/LanguageSelector';
import { useAuth } from '@ui/hooks/useAuth';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';


const PrivateHeader: React.FC = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/dashboard">
        {t('app.name')}
      </Link>

      <div className="ms-auto d-flex align-items-center gap-3">
        <LanguageSelector />
        <Link to="/dashboard" className="btn btn-outline-light btn-sm">
          {t('nav.dashboard')}
        </Link>
        <Link to="/profile" className="btn btn-outline-light btn-sm">
          {t('nav.profile')}
        </Link>
        <Link to="/teams" className="btn btn-outline-light btn-sm">
          {t('nav.teams')}
        </Link>
        <button onClick={handleLogout} className="btn btn-danger btn-sm">
          {t('nav.logout')}
        </button>
      </div>
    </nav>
  );
};

export default PrivateHeader;
