"use client";

import { usePathname } from "next/navigation";

import { WHATSAPP } from "@/constants/config";
import { trackEvent } from "@/lib/analytics";

export function WhatsAppButton() {
  const pathname = usePathname();
  const href = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.defaultMessage)}`;

  return (
    <a
      href={href}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec nous sur WhatsApp"
      onClick={() => trackEvent("whatsapp_click", pathname)}
    >
      <i className="fa-brands fa-whatsapp" aria-hidden="true" />
    </a>
  );
}
