import env from '@infrastructure/config/environment';
import api from '@shared/services/axiosService';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { validatePassword } from '@/domain/services/validationService';
import PasswordStrengthMeter from '@/ui/components/Forms/PasswordStrengthMeter';


interface ReCaptchaV3 {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

declare const grecaptcha: ReCaptchaV3;

const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    password?: string;
    confirm_password?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setFieldErrors({});

    // Validaciones
    const errors: typeof fieldErrors = {};
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
      const recaptchaToken = await grecaptcha.execute(env.REACT_APP_RECAPTCHA_SITE_KEY, {
        action: 'reset_password',
      });

      await api.post('/auth/reset-password', {
        token,
        password,
        recaptchaToken,
      });

      setMessage(t('reset.success'));
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t('errors.unknown'));
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{t('reset.invalid_token')}</div>
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: 500 }}>
      <h1 className="mb-4 text-center">{t('reset.title')}</h1>

      {message && (
        <div className="alert alert-success" role="status" aria-live="polite">
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert" aria-live="polite">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            {t('reset.password')}
          </label>
          <div className={`input-group ${fieldErrors.password ? 'is-invalid' : ''}`}>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              aria-describedby="passwordError"
              aria-invalid={!!fieldErrors.password}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={t('register.toggle_password')}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div id="passwordHelp" className="form-text">
            {t('register.password_help')}
          </div>
          <PasswordStrengthMeter password={password} t={t} />

          {fieldErrors.password && (
            <div id="passwordError" className="invalid-feedback" role="alert" aria-live="polite">
              {fieldErrors.password}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            {t('reset.confirm_password')}
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className={`form-control ${fieldErrors.confirm_password ? 'is-invalid' : ''}`}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            aria-describedby="confirmPasswordError"
            aria-invalid={!!fieldErrors.confirm_password}
          />
          <div id="confirmPasswordHelp" className="form-text">
            {t('register.confirm_password_help')}
          </div>
          {fieldErrors.confirm_password && (
            <div
              id="confirmPasswordError"
              className="invalid-feedback"
              role="alert"
              aria-live="polite"
            >
              {fieldErrors.confirm_password}
            </div>
          )}
        </div>

        <button
          className="btn btn-primary w-100"
          type="submit"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? t('reset.saving') : t('reset.submit')}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
