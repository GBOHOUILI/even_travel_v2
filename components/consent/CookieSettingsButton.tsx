"use client";

import { openCookieSettings } from "@/lib/consent";

export function CookieSettingsButton({
  className,
  children = "Gérer mes cookies",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button type="button" className={className} onClick={openCookieSettings}>
      {children}
    </button>
  );
}
