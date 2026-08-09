import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="admin-login-container">
      <div className="admin-login-logo-section">
        <Image src="/images/logo-001.png" alt="Even Travel Logo" width={200} height={68} priority />
        <h1>Administration</h1>
        <p className="admin-login-subtitle">Accès réservé aux administrateurs</p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="admin-login-back-link">
        <Link href="/">← Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
