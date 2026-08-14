"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  CONTACT_SUBJECTS,
  contactSchema,
  type ContactFormValues,
} from "@/features/contact/lib/contactSchema";
import { useSendContactMessage } from "@/features/contact/hooks/useSendContactMessage";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";

export function ContactForm() {
  const { showToast } = useToast();
  const sendMessage = useSendContactMessage();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: undefined, message: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await sendMessage.mutateAsync(values);
      showToast("Votre message a bien été envoyé, nous vous répondrons rapidement.", "success");
      reset();
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "L'envoi du message a échoué. Réessayez.";
      showToast(message, "error");
    }
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
