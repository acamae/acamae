import { useForm } from '@ui/hooks/useForm';
import { useToast } from '@ui/hooks/useToast';
import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { validateEmail, validatePassword } from '@/domain/services/validationService';

const LoginForm: React.FC<{
  redirectTo?: string;
  onLoginError?: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}> = ({
  redirectTo = '/dashboard',
  onLoginError,
  login,
  loading,
  error: externalError,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);

  const { values, errors, touched, handleChange, handleSubmit } = useForm<{
    email: string;
    password: string;
  }>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => {
      const errors: Partial<{ email: string; password: string }> = {};
      if (!validateEmail(values.email)) {
        errors.email = t('errors.email.invalid');
      }
      if (!validatePassword(values.password)) {
        errors.password = t('errors.password.invalid');
      }
      return errors;
    },
    onSubmit: async values => {
      try {
        const success = await login(values.email, values.password);
        if (success) {
          toast.success(t('login.success'), t('login.welcome'));
          navigate(redirectTo);
        } else {
          toast.error(t('errors.session.start'), t('login.failed'));
          if (onLoginError) {
            onLoginError();
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
        toast.error(t('errors.session.start'), t('login.failed'));

        // Notificar al componente padre que hubo un error de inicio de sesión
        if (onLoginError) {
          onLoginError();
        }
      }
    },
  });

  // Mostrar error externo si existe
  if (externalError) {
    toast.error(externalError, t('login.failed'));
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="email">
        <Form.Label>{t('login.email')}</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          isInvalid={touched.email && !!errors.email}
        />
        <Form.Text className="text-muted">{t('login.email_help')}</Form.Text>
        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="password">
        <Form.Label>{t('login.password')}</Form.Label>
        <InputGroup>
          <Form.Control
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={values.password}
            onChange={handleChange}
            isInvalid={touched.password && !!errors.password}
          />
          <Button
            variant="outline-secondary"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={t(showPassword ? 'login.toggle_password' : 'login.toggle_password')}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </Button>
          <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
        </InputGroup>
        <Form.Text className="text-muted">{t('login.password_help')}</Form.Text>
      </Form.Group>

      <div className="d-grid">
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? t('login.accessing') : t('login.button')}
        </Button>
      </div>
    </Form>
  );
};

export default LoginForm;
