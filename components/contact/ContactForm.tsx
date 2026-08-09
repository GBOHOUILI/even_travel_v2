"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { CONTACT_INFO } from "@/constants/config";
import {
  CONTACT_SUBJECTS,
  contactSchema,
  type ContactFormValues,
} from "@/features/contact/lib/contactSchema";
import { useToast } from "@/providers/ToastProvider";

/**
 * ⚠️ Pas d'endpoint /contact confirmé côté backend au moment de cette
 * migration (voir audit) — on reproduit donc le comportement d'origine
 * (ouverture du client mail via un lien mailto:, cf. contact.html) plutôt
 * que d'inventer un appel API. À remplacer par un vrai POST via apiClient
 * dès qu'un endpoint est disponible côté backend ; le formulaire (schéma
 * de validation, états de soumission) n'aura pas à changer.
 */
function buildMailtoLink(values: ContactFormValues): string {
  const body = `Nom : ${values.name}\nEmail : ${values.email}\nSujet : ${values.subject}\n\nMessage :\n${values.message}`;

  const params = new URLSearchParams({
    subject: `[Even Travel] ${values.subject} - ${values.name}`,
    body,
  });

  return `mailto:${CONTACT_INFO.email}?${params.toString()}`;
}

export function ContactForm() {
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: undefined, message: "" },
  });

  const onSubmit = handleSubmit((values) => {
    window.location.href = buildMailtoLink(values);
    showToast(
      `Votre client mail va s'ouvrir pour envoyer le message à ${CONTACT_INFO.email}.`,
      "success",
    );
    reset();
  });

  return (
    <form className="contact-form" onSubmit={onSubmit} noValidate>
      <h2>Envoyez-nous un message</h2>

      <div className="contact-form-group">
        <label htmlFor="name">Nom complet</label>
        <input
          id="name"
          type="text"
          placeholder="Votre nom complet"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
        {errors.name && <p className="contact-field-error">{errors.name.message}</p>}
      </div>

      <div className="contact-form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="votre@email.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && <p className="contact-field-error">{errors.email.message}</p>}
      </div>

      <div className="contact-form-group">
        <label htmlFor="subject">Sujet</label>
        <select
          id="subject"
          defaultValue=""
          aria-invalid={!!errors.subject}
          {...register("subject")}
        >
          <option value="" disabled>
            Sélectionnez un sujet
          </option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
        {errors.subject && <p className="contact-field-error">{errors.subject.message}</p>}
      </div>

      <div className="contact-form-group">
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          placeholder="Décrivez votre demande..."
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && <p className="contact-field-error">{errors.message.message}</p>}
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        <i className="fas fa-paper-plane" aria-hidden="true" style={{ marginRight: 8 }} />
        Envoyer le message
      </button>
    </form>
  );
}
