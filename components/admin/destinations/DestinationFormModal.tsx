"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { AdminModal } from "@/components/admin/shared/AdminModal";
import { SimpleArrayField } from "@/components/admin/shared/SimpleArrayField";
import { useDestination } from "@/features/destinations/hooks/useDestination";
import { useSaveDestination } from "@/features/destinations/hooks/useSaveDestination";
import { destinationToFormValues } from "@/features/destinations/lib/destinationFormMapper";
import {
  DESTINATION_FORM_DEFAULT_VALUES,
  destinationFormSchema,
  type DestinationFormValues,
} from "@/features/destinations/lib/destinationFormSchema";
import { ApiError } from "@/lib/api";
import { useToast } from "@/providers/ToastProvider";
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORY_LABELS } from "@/types/destination";

interface DestinationFormModalProps {
  open: boolean;
  destinationId: string | null;
  onClose: () => void;
}

export function DestinationFormModal({ open, destinationId, onClose }: DestinationFormModalProps) {
  const { showToast } = useToast();
  const isEditing = !!destinationId;
  const { data: existingDestination } = useDestination(destinationId ?? "", {
    enabled: open && isEditing,
  });
  const saveDestination = useSaveDestination(destinationId ?? undefined);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: DESTINATION_FORM_DEFAULT_VALUES,
  });

  const datesArray = useFieldArray({ control, name: "datesDisponibles" });

  useEffect(() => {
    if (!open) return;
    if (isEditing && existingDestination) {
      reset(destinationToFormValues(existingDestination));
    } else if (!isEditing) {
      reset(DESTINATION_FORM_DEFAULT_VALUES);
    }
  }, [open, isEditing, existingDestination, reset]);

  const onSubmit = handleSubmit((values) => {
    saveDestination.mutate(values, {
      onSuccess: () => {
        showToast(`Destination ${isEditing ? "modifiée" : "ajoutée"} avec succès !`, "success");
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
      title={isEditing ? "Modifier la Destination" : "Ajouter une Destination"}
      onClose={onClose}
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Générales</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationTitre">Titre *</label>
              <input
                id="destinationTitre"
                type="text"
                aria-invalid={!!errors.titre}
                {...register("titre")}
              />
              {errors.titre && <p className="admin-field-error">{errors.titre.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationCategorie">Catégorie *</label>
              <select id="destinationCategorie" {...register("categorie")}>
                {DESTINATION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {DESTINATION_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="destinationDescription">Description *</label>
            <textarea
              id="destinationDescription"
              aria-invalid={!!errors.description}
              {...register("description")}
            />
            {errors.description && (
              <p className="admin-field-error">{errors.description.message}</p>
            )}
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationLocalisation">Localisation *</label>
              <input
                id="destinationLocalisation"
                type="text"
                aria-invalid={!!errors.localisation}
                {...register("localisation")}
              />
              {errors.localisation && (
                <p className="admin-field-error">{errors.localisation.message}</p>
              )}
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationPrix">Prix (FCFA) *</label>
              <input id="destinationPrix" type="number" min={0} step={1000} {...register("prix")} />
              {errors.prix && <p className="admin-field-error">{errors.prix.message}</p>}
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Dates Disponibles</h3>
          <div className="admin-form-array">
            {datesArray.fields.map((field, index) => (
              <div key={field.id} className="admin-array-item">
                <div className="admin-array-header">
                  <strong>Période {index + 1}</strong>
                  {datesArray.fields.length > 1 && (
                    <button
                      type="button"
                      className="admin-remove-array-item"
                      onClick={() => datesArray.remove(index)}
                      aria-label={`Supprimer la période ${index + 1}`}
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Date de début</label>
                    <input type="date" {...register(`datesDisponibles.${index}.debut`)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Date de fin</label>
                    <input type="date" {...register(`datesDisponibles.${index}.fin`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="admin-add-array-btn"
            onClick={() => datesArray.append({ debut: "", fin: "" })}
          >
            + Ajouter une période
          </button>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Géographiques</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationPays">Pays *</label>
              <input
                id="destinationPays"
                type="text"
                aria-invalid={!!errors.pays}
                {...register("pays")}
              />
              {errors.pays && <p className="admin-field-error">{errors.pays.message}</p>}
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationRegion">Région</label>
              <input id="destinationRegion" type="text" {...register("region")} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationClimat">Climat</label>
              <input id="destinationClimat" type="text" {...register("climat")} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationFuseauHoraire">Fuseau horaire</label>
              <input id="destinationFuseauHoraire" type="text" {...register("fuseauHoraire")} />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations Climatiques</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationTemperatureMin">Température min (°C)</label>
              <input id="destinationTemperatureMin" type="number" {...register("temperatureMin")} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationTemperatureMax">Température max (°C)</label>
              <input id="destinationTemperatureMax" type="number" {...register("temperatureMax")} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationDevise">Devise</label>
              <input id="destinationDevise" type="text" {...register("devise")} />
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationMeilleurePeriode">Meilleure période</label>
              <input
                id="destinationMeilleurePeriode"
                type="text"
                {...register("meilleurePeriode")}
              />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationBudgetJournalier">Budget journalier</label>
              <input
                id="destinationBudgetJournalier"
                type="text"
                {...register("budgetJournalier")}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="destinationAeroport">Aéroport principal</label>
              <input id="destinationAeroport" type="text" {...register("aeroport")} />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Langues parlées</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="langues"
            itemLabel="Langue"
            addLabel="Ajouter une langue"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Sites à visiter</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="sitesVisiter"
            itemLabel="Site"
            addLabel="Ajouter un site"
            placeholder="Ex: Musée Honmè"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Spécialités gastronomiques</h3>
          <SimpleArrayField
            control={control}
            register={register}
            name="gastronomie"
            itemLabel="Spécialité"
            addLabel="Ajouter une spécialité"
            placeholder="Ex: Akassa"
          />
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Informations détaillées</h3>
          <div className="admin-form-group">
            <label htmlFor="destinationDescriptionLongue">Description longue</label>
            <textarea
              id="destinationDescriptionLongue"
              rows={6}
              placeholder="Description détaillée de la destination..."
              {...register("descriptionLongue")}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="destinationExperiencesCulturelles">Expériences culturelles</label>
            <textarea
              id="destinationExperiencesCulturelles"
              rows={4}
              placeholder="Décrivez les expériences culturelles uniques..."
              {...register("experiencesCulturelles")}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="destinationInformationsPratiques">Informations pratiques</label>
            <textarea
              id="destinationInformationsPratiques"
              rows={4}
              placeholder="Informations pratiques pour les voyageurs..."
              {...register("informationsPratiques")}
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Optimisation SEO</h3>
          <div className="admin-form-group">
            <label htmlFor="destinationMetaDescription">Meta description</label>
            <textarea
              id="destinationMetaDescription"
              rows={3}
              placeholder="Description pour les moteurs de recherche..."
              {...register("metaDescription")}
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="destinationMotsCles">Mots-clés (séparés par des virgules)</label>
            <input
              id="destinationMotsCles"
              type="text"
              placeholder="voyage, culture, afrique, bénin..."
              {...register("motsCles")}
            />
          </div>
        </div>

        <div className="admin-form-section">
          <h3 className="admin-section-title-small">Options</h3>
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label htmlFor="destinationPlacesDisponibles">Places disponibles *</label>
              <input
                id="destinationPlacesDisponibles"
                type="number"
                min={1}
                {...register("placesDisponibles")}
              />
              {errors.placesDisponibles && (
                <p className="admin-field-error">{errors.placesDisponibles.message}</p>
              )}
            </div>
            <div className="admin-form-group admin-checkbox-group">
              <label htmlFor="destinationFeatured">
                <input id="destinationFeatured" type="checkbox" {...register("featured")} /> Mettre
                en vedette
              </label>
            </div>
          </div>
          <div className="admin-form-group">
            <label htmlFor="destinationImages">Images (max 5, formats: JPG, PNG, WebP)</label>
            <input
              id="destinationImages"
              type="file"
              accept="image/*"
              multiple
              {...register("images")}
            />
            <small>Maintenez Ctrl pour sélectionner plusieurs images</small>
          </div>
        </div>

        <div className="admin-modal-actions">
          <button type="button" className="admin-cancel-modal-btn" onClick={onClose}>
            Annuler
          </button>
          <button
            type="submit"
            className="admin-save-btn"
            disabled={isSubmitting || saveDestination.isPending}
          >
            {saveDestination.isPending ? "Enregistrement..." : "Enregistrer la Destination"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
