import { apiClient } from "@/lib/api";
import type { ContactFormValues } from "@/features/contact/lib/contactSchema";

interface ContactResponse {
  status: string;
  data: { message: string };
}

export const contactApi = {
  /**
   * Route publique (pas de cookie nécessaire) — voir backend
   * `POST /api/v1/contact` (contactController.js / contactRoutes.js).
   * Le backend envoie l'email via emailService (nodemailer/Brevo) au lieu
   * d'ouvrir le client mail de l'utilisateur.
   */
  send: async (values: ContactFormValues) => {
    const { data } = await apiClient.post<ContactResponse>("/contact", values);
    return data.data;
  },
};
