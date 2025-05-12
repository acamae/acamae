import { useAuth } from '@ui/hooks/useAuth';
import React from 'react';
import { useTranslation } from 'react-i18next';

import LoginForm from '@/ui/components/Forms/LoginForm';

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { login, loading, error } = useAuth();

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center">{t('home.title')}</h1>
      <p className="text-center mb-4">{t('home.description')}</p>
      <div className="mx-auto" style={{ maxWidth: 500 }}>
        <LoginForm login={login} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default HomePage;
