import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EmailAlreadyVerified: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <div className="alert alert-success text-center">
        <h1 className="mb-3">{t('verification.already.title')}</h1>
        <p className="mb-4">{t('verification.already.message')}</p>
        <Link to="/" className="btn btn-outline-primary">
          {t('common.back_home')}
        </Link>
      </div>
    </div>
  );
};

export default EmailAlreadyVerified;
