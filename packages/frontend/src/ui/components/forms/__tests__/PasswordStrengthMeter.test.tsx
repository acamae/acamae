import { render, screen } from '@testing-library/react';
import React from 'react';

import type { TFunction } from 'i18next';

import PasswordStrengthMeter from '@/ui/components/Forms/PasswordStrengthMeter';
import '@testing-library/jest-dom';

// Mock de la función t para simular i18next
const translations = {
  'register.strength.weak': 'Débil',
  'register.strength.fair': 'Regular',
  'register.strength.good': 'Buena',
  'register.strength.strong': 'Fuerte',
  'register.strength.very_strong': 'Muy fuerte',
};

const mockT = jest.fn((key: string) => {
  return translations[key as keyof typeof translations] || key;
}) as unknown as TFunction;

// Mock de zxcvbn
jest.mock('zxcvbn', () => {
  return jest.fn().mockImplementation((password) => {
    if (!password) return { score: 0 };
    if (password.length < 6) return { score: 0 };
    if (password.length < 8) return { score: 1 };
    if (password.length < 10) return { score: 2 };
    if (password.length < 12) return { score: 3 };
    return { score: 4 };
  });
});

describe('PasswordStrengthMeter', () => {
  it('muestra "Débil" para una contraseña vacía', () => {
    render(<PasswordStrengthMeter password="" t={mockT} />);
    expect(screen.getByText('Débil')).toBeInTheDocument();
  });

  it('muestra "Débil" para una contraseña corta', () => {
    render(<PasswordStrengthMeter password="12345" t={mockT} />);
    expect(screen.getByText('Débil')).toBeInTheDocument();
  });

  it('muestra "Regular" para una contraseña de seguridad media-baja', () => {
    render(<PasswordStrengthMeter password="1234567" t={mockT} />);
    expect(screen.getByText('Regular')).toBeInTheDocument();
  });

  it('muestra "Buena" para una contraseña de seguridad media', () => {
    render(<PasswordStrengthMeter password="123456789" t={mockT} />);
    expect(screen.getByText('Buena')).toBeInTheDocument();
  });

  it('muestra "Fuerte" para una contraseña segura', () => {
    render(<PasswordStrengthMeter password="1234567890A" t={mockT} />);
    expect(screen.getByText('Fuerte')).toBeInTheDocument();
  });

  it('muestra "Muy fuerte" para una contraseña muy segura', () => {
    render(<PasswordStrengthMeter password="1234567890Ab!" t={mockT} />);
    expect(screen.getByText('Muy fuerte')).toBeInTheDocument();
  });

  it('renderiza la barra de progreso con el color correcto', () => {
    render(<PasswordStrengthMeter password="1234567" t={mockT} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveClass('bg-warning');
    expect(progressBar).toHaveStyle('width: 40%');
  });
}); 