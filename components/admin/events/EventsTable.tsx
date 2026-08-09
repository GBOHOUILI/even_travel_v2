"use client";

import { useState } from "react";

import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { EventFormModal } from "@/components/admin/events/EventFormModal";
import { useDeleteEvent } from "@/features/events/hooks/useDeleteEvent";
import { useEvents } from "@/features/events/hooks/useEvents";
import { ApiError } from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";
import { useToast } from "@/providers/ToastProvider";

export function EventsTable() {
  const { data: events, isLoading } = useEvents();
  const deleteEvent = useDeleteEvent();
  const { showToast } = useToast();

  const [formModal, setFormModal] = useState<{ open: boolean; eventId: string | null }>({
    open: false,
    eventId: null,
  });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteEvent.mutate(pendingDeleteId, {
      onSuccess: () => {
        showToast("Suppression effectuée avec succès !", "success");
        setPendingDeleteId(null);
      },
      onError: (error) => {
        const message =
          error instanceof ApiError ? error.message : "Erreur lors de la suppression.";
        showToast(message, "error");
        setPendingDeleteId(null);
      },
    });
  };

  const handleExport = () => {
    const headers = ["Titre", "Date", "Lieu", "Prix", "Statut"];
    const rows = (events ?? []).map((event) => [
      event.nom,
      event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "",
      event.lieu ?? "",
      event.prix ? `${event.prix.toLocaleString("fr-FR")} FCFA` : "Gratuit",
      event.featured === true ? "Actif" : "Inactif",
    ]);
    exportToCsv("evenements.csv", headers, rows);
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Événements</h1>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => setFormModal({ open: true, eventId: null })}
        >
          <i className="fas fa-plus" aria-hidden="true" /> Ajouter un Événement
        </button>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Liste des Événements</h3>
          <button type="button" className="admin-export-btn" onClick={handleExport}>
            <i className="fas fa-download" aria-hidden="true" /> Exporter CSV
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Titre</th>
              <th>Date</th>
              <th>Lieu</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={6}>Chargement des événements...</td>
              </tr>
            )}
            {!isLoading && (!events || events.length === 0) && (
              <tr>
                <td colSpan={6}>Aucun événement disponible</td>
              </tr>
            )}
            {events?.map((event) => (
              <tr key={event._id}>
                <td>{event.nom}</td>
                <td>{event.date ? new Date(event.date).toLocaleDateString("fr-FR") : "—"}</td>
                <td>{event.lieu}</td>
                <td>{event.prix ? `${event.prix.toLocaleString("fr-FR")} FCFA` : "Gratuit"}</td>
                <td>
                  <StatusBadge
                    active={event.featured === true}
                    activeLabel="Actif"
                    inactiveLabel="Inactif"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn admin-edit-btn"
                    onClick={() => setFormModal({ open: true, eventId: event._id })}
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    className="admin-action-btn admin-delete-btn"
                    onClick={() => setPendingDeleteId(event._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EventFormModal
        open={formModal.open}
        eventId={formModal.eventId}
        onClose={() => setFormModal({ open: false, eventId: null })}
      />

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible."
        isPending={deleteEvent.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
