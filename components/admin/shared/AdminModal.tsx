"use client";

import type { ReactNode } from "react";

interface AdminModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export function AdminModal({ open, title, onClose, children }: AdminModalProps) {
  if (!open) return null;

  return (
    <div className="admin-modal show" role="dialog" aria-modal="true" aria-label={title}>
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{title}</h2>
          <button type="button" className="admin-close-btn" onClick={onClose} aria-label="Fermer">
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
