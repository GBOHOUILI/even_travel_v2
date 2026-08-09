"use client";

interface ConfirmDeleteModalProps {
  open: boolean;
  message: string;
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({
  open,
  message,
  isPending,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="admin-modal show" role="alertdialog" aria-modal="true">
      <div className="admin-modal-content admin-modal-content-small">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Confirmation</h2>
          <button type="button" className="admin-close-btn" onClick={onCancel} aria-label="Fermer">
            ×
          </button>
        </div>
        <p>{message}</p>
        <div className="admin-modal-actions">
          <button
            type="button"
            className="admin-cancel-modal-btn"
            onClick={onCancel}
            disabled={isPending}
          >
            Annuler
          </button>
          <button
            type="button"
            className="admin-save-btn admin-danger-btn"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>
    </div>
  );
}
