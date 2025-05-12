import React, { useEffect, useState } from 'react';
import zxcvbn from 'zxcvbn';

import type { TFunction } from 'i18next';

interface Props {
  password: string;
  t: TFunction;
}

const PasswordStrengthMeter: React.FC<Props> = ({ password, t }) => {
  const [score, setScore] = useState(0);

  useEffect(() => {
    setScore(password ? zxcvbn(password).score : 0);
  }, [password]);

  const levels = ['weak', 'fair', 'good', 'strong', 'very_strong'];
  const bootstrapColors = ['danger', 'warning', 'info', 'success', 'success'];
  const label = t(`register.strength.${levels[score]}`);

  return (
    <div className="form-text">
      {label}
      <div className="progress mt-1" aria-hidden="true">
        <div
          className={`progress-bar bg-${bootstrapColors[score]}`}
          style={{ width: `${(score + 1) * 20}%` }}
        />
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
