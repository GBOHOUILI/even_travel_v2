import type { ReactNode } from "react";

import { CONTACT_INFO } from "@/constants/config";

interface InfoRow {
  icon: string;
  title: string;
  content: ReactNode;
}

export function ContactInfo() {
  const rows: InfoRow[] = [
    { icon: "fa-map-marker-alt", title: "Adresse", content: CONTACT_INFO.address },
    { icon: "fa-envelope", title: "Email", content: CONTACT_INFO.email },
    { icon: "fa-phone", title: "Téléphone", content: CONTACT_INFO.phone },
    {
      icon: "fa-clock",
      title: "Heures d'ouverture",
      content: (
        <>
          <strong>Lundi au Vendredi :</strong> 9h00 - 19h00
          <br />
          <strong>Samedi :</strong> 9h00 - 12h00
        </>
      ),
    },
  ];

  return (
    <div className="contact-info">
      <h2>Informations de contact</h2>
      {rows.map((row) => (
        <div key={row.title} className="contact-info-item">
          <div className="contact-info-icon">
            <i className={`fas ${row.icon}`} aria-hidden="true" />
          </div>
          <div className="contact-info-content">
            <h3>{row.title}</h3>
            <p>{row.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
