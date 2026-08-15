"use client";

import Image from "next/image";
import Link from "next/link";

import { NAV_LINKS } from "@/constants/config";

import { useMobileMenu } from "./useMobileMenu";

export function Navbar() {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <>
      <div
        className={`nav-overlay ${isOpen ? "active" : ""}`}
        onClick={close}
        aria-hidden={!isOpen}
      />

      <header>
        <nav>
          <Link href="/" className="logo" aria-label="Even Travel — Accueil">
            <Image
              src="/images/logo-01.png"
              alt="Even Travel Logo"
              width={180}
              height={62}
              priority
            />
          </Link>

          <ul className={`nav-links ${isOpen ? "active" : ""}`} id="navLinks">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={close}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`hamburger ${isOpen ? "active" : ""}`}
            id="hamburger"
            aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isOpen}
            aria-controls="navLinks"
            onClick={toggle}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
      </header>
    </>
  );
}
