import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EmailVerificationExpired: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">{t('verification.expired.title')}</h1>
      <p className="mb-4">{t('verification.expired.message')}</p>

      <Link to="/resend-verification" className="btn btn-primary">
        {t('verification.expired.resend')}
      </Link>
    </div>
  );
};

export default EmailVerificationExpired;
