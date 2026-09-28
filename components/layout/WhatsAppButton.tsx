import { WHATSAPP } from "@/constants/config";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP.number}?text=${encodeURIComponent(WHATSAPP.defaultMessage)}`;

  return (
    <a
      href={href}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter avec nous sur WhatsApp"
    >
      <i className="fa-brands fa-whatsapp" aria-hidden="true" />
    </a>
  );
}
