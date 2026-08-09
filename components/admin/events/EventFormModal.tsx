"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AdminModal } from "@/components/admin/shared/AdminModal";
import { SimpleArrayField } from "@/components/admin/shared/SimpleArrayField";
import { useEvent } from "@/features/events/hooks/useEvent";
import { useSaveEvent } from "@/features/events/hooks/useSaveEvent";
import { eventToFormValues } from "@/features/events/lib/eventFormMapper";
import {
  EVENT_FORM_DEFAULT_VALUES,
  eventFormSchema,
  type EventFormValues,
} from "@/features/events/lib/eventFormSchema";
import { useToast } from "@/providers/ToastProvider";
import { ApiError } from "@/lib/api";
import { EVENT_CATEGORIES, EVENT_CATEGORY_LABELS, EVENT_DIFFICULTIES } from "@/types/event";

interface EventFormModalProps {
  open: boolean;
  eventId: string | null;
  onClose: () => void;
}

export function EventFormModal({ open, eventId, onClose }: EventFormModalProps) {
  const { showToast } = useToast();
  const isEditing = !!eventId;
  const { data: existingEvent } = useEvent(eventId ?? "", { enabled: open && isEditing });
  const saveEvent = useSaveEvent(eventId ?? undefined);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: EVENT_FORM_DEFAULT_VALUES,
  });

  const itineraireArray = useFieldArray({ control, name: "itineraire" });

  // Réinitialise le formulaire à l'ouverture : vide pour un ajout, ou
  // pré-rempli dès que l'événement édité est chargé.
  useEffect(() => {
    if (!open) return;
    if (isEditing && existingEvent) {
      reset(eventToFormValues(existingEvent));
    } else if (!isEditing) {
      reset(EVENT_FORM_DEFAULT_VALUES);
    }
  }, [open, isEditing, existingEvent, reset]);

  const onSubmit = handleSubmit((values) => {
    saveEvent.mutate(values, {
      onSuccess: () => {
        showToast(`Événement ${isEditing ? "modifié" : "ajouté"} avec succès !`, "success");
        onClose();
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de l'enregistrement.";
        showToast(message, "error");
      },
    });
  });

  return (
    <AdminModal
      open={open}
      title={isEditing ? "Modifier l'Événement" : "Ajouter un Événement"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Générales</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventNom">Nom de l&apos;événement *</label>
              <input id="eventNom" type="text" aria-invalid={!!errors.nom} {...register("nom")} />
              {errors.nom && <p className="admin-field-error">{errors.nom.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventCategorie">Catégorie *</label>
              <select
                id="eventCategorie"
                aria-invalid={!!errors.categorie}
                {...register("categorie")}
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {EVENT_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="eventDescription">Description courte *</label>
            <textarea
              id="eventDescription"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <p className="admin-field-error">{errors.description.message}</p>
            )}
          </div>
          <div className="admin-form-group">
            <label htmlFor="eventDescriptionLongue">Description longue</label>
            <textarea id="eventDescriptionLongue" {...register("descriptionLongue")} />
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Dates et Lieu</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventDate">Date de début *</label>
              <input
                id="eventDate"
                type="datetime-local"
                aria-invalid={!!errors.date}
                {...register("date")}
              />
              {errors.date && <p className="admin-field-error">{errors.date.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventDateFin">Date de fin</label>
              <input id="eventDateFin" type="datetime-local" {...register("dateFin")} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventDuree">Durée (jours) *</label>
              <input id="eventDuree" type="number" min={1} {...register("duree")} />
              {errors.duree && <p className="admin-field-error">{errors.duree.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventLieu">Lieu *</label>
              <input
                id="eventLieu"
                type="text"
                aria-invalid={!!errors.lieu}
                {...register("lieu")}
              />
              {errors.lieu && <p className="admin-field-error">{errors.lieu.message}</p>}
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Tarifs et Capacité</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventPrix">Prix (FCFA) *</label>
              <input id="eventPrix" type="number" min={0} step={1000} {...register("prix")} />
              {errors.prix && <p className="admin-field-error">{errors.prix.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventPlacesTotales">Places totales *</label>
              <input id="eventPlacesTotales" type="number" min={1} {...register("placesTotales")} />
              {errors.placesTotales && (
                <p className="admin-field-error">{errors.placesTotales.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Configuration du Groupe</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventTailleGroupeMin">Taille groupe min</label>
              <input
                id="eventTailleGroupeMin"
                type="number"
                min={1}
                {...register("tailleGroupeMin")}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventTailleGroupeMax">Taille groupe max</label>
              <input
                id="eventTailleGroupeMax"
                type="number"
                min={1}
                {...register("tailleGroupeMax")}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="eventDifficulte">Difficulté</label>
              <select id="eventDifficulte" {...register("difficulte")}>
                {EVENT_DIFFICULTIES.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventLangues">Langues parlées</label>
              <input
                id="eventLangues"
                type="text"
                placeholder="Français, Anglais..."
                {...register("langues")}
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Services Inclus</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="servicesInclus"
            itemLabel="Service"
            addLabel="Ajouter un service inclus"
            placeholder="Ex: Hébergement inclus"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Services Non Inclus</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="servicesNonInclus"
            itemLabel="Service non inclus"
            addLabel="Ajouter un service non inclus"
            placeholder="Ex: Billets d'avion"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Moments Forts</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="momentsForts"
            itemLabel="Moment fort"
            addLabel="Ajouter un moment fort"
            placeholder="Ex: Cérémonie traditionnelle"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Itinéraire</h3>
          <div className="admin-form-array">
            {itineraireArray.fields.map((field, index) => (
              <div key={field.id} className="admin-array-item">
                <div className="admin-array-header">
                  <strong>Jour {index + 1}</strong>
                  {itineraireArray.fields.length > 1 && (
                    <button
                      type="button"
                      className="admin-remove-array-item"
                      onClick={() => itineraireArray.remove(index)}
                      aria-label={`Supprimer le jour ${index + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="admin-form-group">
                  <label>Titre du jour</label>
                  <input
                    type="text"
                    placeholder="Ex: Arrivée et découverte"
                    {...register(`itineraire.${index}.titre`)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    placeholder="Description détaillée de la journée"
                    {...register(`itineraire.${index}.description`)}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Activités (séparées par des virgules)</label>
                  <input
                    type="text"
                    placeholder="Visite, Repas, Découverte..."
                    {...register(`itineraire.${index}.activites`)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-add-array-btn"
            onClick={() => itineraireArray.append({ titre: "", description: "", activites: "" })}
          >
            + Ajouter un jour
          </button>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Pratiques</h3>
          <div className="admin-form-group">
            <label htmlFor="eventInformationsPratiques">
              Informations à connaître avant de partir
            </label>
            <textarea
              id="eventInformationsPratiques"
              placeholder="Tenue vestimentaire, vaccinations, recommandations..."
              {...register("informationsPratiques")}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="eventRecommandations">Recommandations supplémentaires</label>
            <textarea
              id="eventRecommandations"
              placeholder="Conseils pour profiter au maximum de l'événement"
              {...register("recommandations")}
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Options</h3>
          <div className="admin-form-row">
            <div className="admin-form-group admin-checkbox-group">
              <label htmlFor="eventFeatured">
                <input id="eventFeatured" type="checkbox" {...register("featured")} /> Mettre en
                vedette
              </label>
            </div>
            <div className="admin-form-group">
              <label htmlFor="eventImage">Image principale</label>
              <input id="eventImage" type="file" accept="image/*" {...register("image")} />
            </div>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="admin-cancel-modal-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            className="admin-save-btn"
            disabled={isSubmitting || saveEvent.isPending}
          >
            {saveEvent.isPending ? "Enregistrement..." : "Enregistrer l'Événement"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
