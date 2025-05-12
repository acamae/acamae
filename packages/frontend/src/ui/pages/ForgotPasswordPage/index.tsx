import env from '@infrastructure/config/environment';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { validateEmail } from '@/domain/services/validationService';

interface ReCaptcha {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare const grecaptcha: ReCaptcha;

const ForgotPasswordPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldError, setFieldError] = useState<string | null>(null);

  // Actualizar mensajes de error cuando cambia el idioma
  useEffect(() => {
    if (fieldError) {
      // Re-validar para actualizar el mensaje de error en el nuevo idioma
      if (!email.trim()) {
        setFieldError(t('errors.email.required'));
      } else if (!validateEmail(email)) {
        setFieldError(t('errors.email.invalid'));
      }
    }
  }, [i18n.language, email, t, fieldError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setFieldError(null);

    if (!email.trim()) {
      setFieldError(t('errors.email.required'));
      return;
    } else if (!validateEmail(email)) {
      setFieldError(t('errors.email.invalid'));
      return;
    }

    setLoading(true);

    try {
      const token = await grecaptcha.execute(env.REACT_APP_RECAPTCHA_SITE_KEY, {
        action: 'forgot_password',
      });

      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken: token }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errors.password.reset_request'));
      }

      setMessage(t('forgot.success'));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card>
            <Card.Header className="text-center">
              <h2>{t('forgot.title')}</h2>
            </Card.Header>
            <Card.Body>
              {message && (
                <Alert variant="success" role="status" aria-live="polite">
                  {message}
                </Alert>
              )}

              {error && (
                <Alert variant="danger" role="alert" aria-live="polite">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>{t('forgot.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value.trim())}
                    isInvalid={!!fieldError}
                    required
                    autoComplete="email"
                    aria-describedby="emailHelp"
                    autoFocus
                  />
                  <Form.Text id="emailHelp" className="text-muted">
                    {t('forgot.email_help')}
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">{fieldError}</Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} aria-busy={loading}>
                    {loading ? t('forgot.sending') : t('forgot.submit')}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordPage;
