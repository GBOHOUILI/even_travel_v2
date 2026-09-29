import { CookieBanner } from "@/components/consent/CookieBanner";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
      <CookieBanner />
      <PageViewTracker />
    </>
  );
}
