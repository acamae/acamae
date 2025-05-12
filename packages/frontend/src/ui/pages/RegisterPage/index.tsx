import env from '@infrastructure/config/environment';
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { validateEmail, validatePassword, validateUsername } from '@/domain/services/validationService';
import PasswordStrengthMeter from '@/ui/components/Forms/PasswordStrengthMeter';

interface ReCaptcha {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare const grecaptcha: ReCaptcha;

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    username?: string;
    password?: string;
    confirm_password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setFieldErrors({});

    // Validations
    const errors: typeof fieldErrors = {};
    if (!email) {
      errors.email = t('errors.email.required');
    } else if (!validateEmail(email)) {
      errors.email = t('errors.email.invalid');
    }

    if (!username) {
      errors.username = t('errors.username.required');
    } else if (!validateUsername(username)) {
      errors.username = t('errors.username.invalid');
    }

    if (!password) {
      errors.password = t('errors.password.required');
    } else if (!validatePassword(password)) {
      errors.password = t('errors.password.invalid');
    }

    if (!confirmPassword) {
      errors.confirm_password = t('errors.password.confirm_required');
    } else if (password !== confirmPassword) {
      errors.confirm_password = t('errors.password.mismatch');
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      const token = await grecaptcha.execute(env.REACT_APP_RECAPTCHA_SITE_KEY, { action: 'register' });

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          username,
          password,
          recaptchaToken: token,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || t('errors.register.failed'));
      }

      setMessage(t('register.success'));
      setTimeout(() => navigate('/login'), 3000);
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
              <h2>{t('register.title')}</h2>
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
                  <Form.Label>{t('register.email')}</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value.trim())}
                    isInvalid={!!fieldErrors.email}
                    required
                    autoComplete="email"
                    aria-describedby="emailHelp"
                  />
                  <Form.Text id="emailHelp" className="text-muted">
                    {t('register.email_help')}
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">{fieldErrors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="username">
                  <Form.Label>{t('register.username')}</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value.trim())}
                    isInvalid={!!fieldErrors.username}
                    required
                    autoComplete="username"
                    aria-describedby="usernameHelp"
                  />
                  <Form.Text id="usernameHelp" className="text-muted">
                    {t('register.username_help')}
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>{t('register.password')}</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      isInvalid={!!fieldErrors.password}
                      required
                      autoComplete="new-password"
                      aria-describedby="passwordHelp"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(prev => !prev)}
                      aria-label={t('register.toggle_password')}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text id="passwordHelp" className="text-muted">
                    {t('register.password_help')}
                  </Form.Text>
                  <PasswordStrengthMeter password={password} t={t} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>{t('register.confirm_password')}</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      isInvalid={!!fieldErrors.confirm_password}
                      required
                      autoComplete="new-password"
                      aria-describedby="confirmPasswordHelp"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      aria-label={t('register.toggle_password')}
                    >
                      {showConfirmPassword ? '🙈' : '👁️'}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {fieldErrors.confirm_password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Form.Text id="confirmPasswordHelp" className="text-muted">
                    {t('register.confirm_password_help')}
                  </Form.Text>
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={loading} aria-busy={loading}>
                    {loading ? t('register.processing') : t('register.button')}
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

export default RegisterPage;
