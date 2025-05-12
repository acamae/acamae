import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EmailVerificationSentPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mt-5">
      <div className="alert alert-info text-center">
        <h1 className="mb-3">{t('verification.sent.title')}</h1>
        <p className="mb-4">{t('verification.sent.message')}</p>
        <Link to="/" className="btn btn-outline-primary">
          {t('common.back_home')}
        </Link>
      </div>
    </div>
  );
};

export default EmailVerificationSentPage;
