import type { ButtonHTMLAttributes } from "react";

import clsx from "clsx";

type ButtonVariant = "primary" | "secondary" | "events" | "plain";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  events: "events-button",
  plain: "",
};

/**
 * Bouton générique. Les classes CSS (btn-primary, btn-secondary...)
 * reprennent exactement le design d'origine défini dans globals.css.
 */
export function Button({ variant = "plain", className, ...props }: ButtonProps) {
  return <button className={clsx(VARIANT_CLASS[variant], className)} {...props} />;
}
