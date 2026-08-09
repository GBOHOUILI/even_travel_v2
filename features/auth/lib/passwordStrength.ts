export interface PasswordStrengthLevel {
  label: string;
  colorClass: string;
  widthPercent: number;
}

const STRENGTH_LEVELS: PasswordStrengthLevel[] = [
  { label: "", colorClass: "", widthPercent: 0 },
  { label: "Très faible", colorClass: "admin-strength-very-weak", widthPercent: 20 },
  { label: "Faible", colorClass: "admin-strength-weak", widthPercent: 40 },
  { label: "Moyen", colorClass: "admin-strength-medium", widthPercent: 60 },
  { label: "Fort", colorClass: "admin-strength-strong", widthPercent: 80 },
  { label: "Très fort", colorClass: "admin-strength-very-strong", widthPercent: 100 },
];

/** Même barème que admin-settings.html d'origine (score sur 5). */
export function getPasswordStrength(password: string): PasswordStrengthLevel {
  const fallback = STRENGTH_LEVELS[0]!;
  if (!password) return fallback;

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return STRENGTH_LEVELS[score] ?? fallback;
}
