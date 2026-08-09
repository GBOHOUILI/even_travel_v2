import { getPasswordStrength } from "@/features/auth/lib/passwordStrength";

interface PasswordStrengthGaugeProps {
  password: string;
}

export function PasswordStrengthGauge({ password }: PasswordStrengthGaugeProps) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  return (
    <div className="admin-strength-bar">
      <div className="admin-strength-track">
        <div
          className={`admin-strength-fill ${strength.colorClass}`}
          style={{ width: `${strength.widthPercent}%` }}
        />
      </div>
      <span className={`admin-strength-label ${strength.colorClass}`}>{strength.label}</span>
    </div>
  );
}
