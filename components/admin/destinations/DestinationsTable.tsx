"use client";

import { useMemo, useState } from "react";

import { DestinationFormModal } from "@/components/admin/destinations/DestinationFormModal";
import { ConfirmDeleteModal } from "@/components/admin/shared/ConfirmDeleteModal";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { useDeleteDestination } from "@/features/destinations/hooks/useDeleteDestination";
import { useDestinations } from "@/features/destinations/hooks/useDestinations";
import { ApiError } from "@/lib/api";
import { exportToCsv } from "@/lib/exportCsv";
import { useToast } from "@/providers/ToastProvider";
import { DESTINATION_CATEGORIES, DESTINATION_CATEGORY_LABELS } from "@/types/destination";

const ITEMS_PER_PAGE = 10;

export function DestinationsTable() {
  const { data: destinations, isLoading } = useDestinations();
  const deleteDestination = useDeleteDestination();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [formModal, setFormModal] = useState<{ open: boolean; destinationId: string | null }>({
    open: false,
    destinationId: null,
  });
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (destinations ?? []).filter((d) => {
      const matchesSearch =
        !term ||
        d.titre.toLowerCase().includes(term) ||
        d.localisation.toLowerCase().includes(term) ||
        (d.categorie ?? "").toLowerCase().includes(term);
      const matchesCategory = categoryFilter === "all" || d.categorie === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [destinations, search, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const confirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteDestination.mutate(pendingDeleteId, {
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
    const headers = ["Titre", "Localisation", "Prix", "Catégorie", "Statut"];
    const rows = filtered.map((destination) => [
      destination.titre,
      destination.localisation,
      destination.prix ? `${destination.prix.toLocaleString("fr-FR")} FCFA` : "Gratuit",
      destination.categorie
        ? ((DESTINATION_CATEGORY_LABELS as Record<string, string>)[destination.categorie] ??
          destination.categorie)
        : "",
      destination.featured === true ? "En vedette" : "Standard",
    ]);
    exportToCsv("destinations.csv", headers, rows);
  };

  return (
    <>
      <div className="admin-section-header">
        <h1 className="admin-section-title">Gestion des Destinations</h1>
        <button
          type="button"
          className="admin-add-btn"
          onClick={() => setFormModal({ open: true, destinationId: null })}
        >
          <i className="fas fa-plus" aria-hidden="true" /> Ajouter une Destination
        </button>
      </div>

      <div className="admin-search-box">
        <input
          type="text"
          placeholder="Rechercher une destination..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button type="button" aria-label="Rechercher">
          <i className="fas fa-search" aria-hidden="true" />
        </button>
      </div>

      <div className="admin-data-table">
        <div className="admin-table-header">
          <h3 className="admin-table-title">Liste des Destinations</h3>
          <div className="admin-table-header-actions">
            <div className="admin-filter-options">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="all">Toutes les catégories</option>
                {DESTINATION_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {DESTINATION_CATEGORY_LABELS[cat]}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="admin-export-btn" onClick={handleExport}>
              <i className="fas fa-download" aria-hidden="true" /> Exporter CSV
            </button>
          </div>
        </div>
        {/* Wrapper scrollable : évite que le tableau (6 colonnes) ne casse
            la largeur de la page ou ne soit tronqué sur mobile/tablette. */}
        <div className="admin-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Titre</th>
                <th>Localisation</th>
                <th>Prix</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6}>Chargement des destinations...</td>
                </tr>
              )}
              {!isLoading && paginated.length === 0 && (
                <tr>
                  <td colSpan={6}>Aucune destination disponible</td>
                </tr>
              )}
              {paginated.map((destination) => (
                <tr key={destination._id}>
                  <td>{destination.titre}</td>
                  <td>{destination.localisation}</td>
                  <td>
                    {destination.prix
                      ? `${destination.prix.toLocaleString("fr-FR")} FCFA`
                      : "Gratuit"}
                  </td>
                  <td>{destination.categorie}</td>
                  <td>
                    <StatusBadge
                      active={destination.featured === true}
                      activeLabel="En vedette"
                      inactiveLabel="Standard"
                    />
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-action-btn admin-edit-btn"
                      onClick={() => setFormModal({ open: true, destinationId: destination._id })}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn admin-delete-btn"
                      onClick={() => setPendingDeleteId(destination._id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                className={`admin-page-btn ${p === currentPage ? "active" : ""}`}
                onClick={() => setPage(p)}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <DestinationFormModal
        open={formModal.open}
        destinationId={formModal.destinationId}
        onClose={() => setFormModal({ open: false, destinationId: null })}
      />

      <ConfirmDeleteModal
        open={!!pendingDeleteId}
        message="Êtes-vous sûr de vouloir supprimer cette destination ? Cette action est irréversible."
        isPending={deleteDestination.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </>
  );
}
