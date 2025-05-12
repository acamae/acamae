import api from '@shared/services/axiosService';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ResendVerificationPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [identifier, setIdentifier] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');
  const [message, setMessage] = useState('');

  // Actualizar mensajes cuando cambia el idioma
  useEffect(() => {
    if (status === 'success') {
      setMessage(t('verification.resend.success'));
    } else if (status === 'error' && message) {
      setMessage(t(`errors.${message}`, { defaultValue: t('errors.unknown') }));
    }
  }, [i18n.language, status, message, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/resend-verification', { identifier });
      setStatus('success');
      setMessage(t('verification.resend.success'));
    } catch (err: unknown) {
      setStatus('error');
      const errorKey = err instanceof Error ? err.message : 'UNKNOWN';
      setMessage(errorKey); // Guardamos la clave del error para poder traducirla cuando cambie el idioma
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6} xl={5}>
          <Card>
            <Card.Header className="text-center">
              <h2>{t('verification.resend.title')}</h2>
            </Card.Header>
            <Card.Body>
              {status !== 'idle' && (
                <Alert variant={status === 'success' ? 'success' : 'danger'}>{message}</Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="identifier">
                  <Form.Label>{t('verification.resend.label')}</Form.Label>
                  <Form.Control
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value.trim())}
                    required
                    autoFocus
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit" disabled={status === 'loading'}>
                    {status === 'loading'
                      ? t('verification.resend.loading')
                      : t('verification.resend.button')}
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

export default ResendVerificationPage;
