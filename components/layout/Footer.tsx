import Image from "next/image";

import { CONTACT_INFO, SOCIAL_LINKS } from "@/constants/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <Image src="/images/logo-01.png" alt="Even Travel Logo" width={180} height={62} />
          </div>
          <p className="footer-text">
            Explorez l&apos;Afrique à travers des événements et destinations inoubliables.
          </p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Réservations</h3>
          <p className="footer-text">{CONTACT_INFO.address}</p>
          <p className="footer-text">{CONTACT_INFO.email}</p>
          <p className="footer-text">{CONTACT_INFO.phone}</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Horaires d&apos;ouverture</h3>
          <p className="footer-text">{CONTACT_INFO.hours.weekdays}</p>
          <p className="footer-text">{CONTACT_INFO.hours.saturday}</p>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Suivez-nous</h3>
          <div className="social-icons">
            <a
              href={SOCIAL_LINKS.instagram}
              className="social-icon"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.facebook}
              className="social-icon"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook-f" aria-hidden="true" />
            </a>
            <a
              href={SOCIAL_LINKS.tiktok}
              className="social-icon"
              aria-label="TikTok"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-tiktok" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {year} Even Travel. Tous droits réservés.</p>

        <p className="footer-credit">
          Conçu et développé par{" "}
          <a href="https://zerotoone-ten.vercel.app/" target="_blank" rel="noopener noreferrer">
            Zero To One
          </a>
        </p>
      </div>
    </footer>
  );
}
