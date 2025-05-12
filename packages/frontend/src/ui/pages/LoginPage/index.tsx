import { useAuth } from '@ui/hooks/useAuth';
import React, { useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import LoginForm from '@/ui/components/Forms/LoginForm';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { login, loading, error } = useAuth();

  // This function will be passed to LoginForm to detect login errors
  const handleLoginError = () => {
    setShowForgotPassword(true);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card>
            <Card.Header className="text-center">
              <h2>{t('login.title')}</h2>
            </Card.Header>
            <Card.Body>
              <LoginForm
                onLoginError={handleLoginError}
                login={login}
                loading={loading}
                error={error}
              />
            </Card.Body>
            {showForgotPassword && (
              <Card.Footer className="text-center">
                <Link to="/forgot-password">{t('login.forgot')}</Link>
              </Card.Footer>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
