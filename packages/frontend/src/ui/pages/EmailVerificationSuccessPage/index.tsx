import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const EmailVerificationSuccess: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container text-center mt-5">
      <h1 className="text-success">✅ {t('verification.success.title')}</h1>
      <p className="lead">{t('verification.success.message')}</p>
      <Link to="/login" className="btn btn-primary mt-3">
        {t('verification.success.login')}
      </Link>
    </div>
  );
};

export default EmailVerificationSuccess;
