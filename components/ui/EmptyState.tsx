import type { ReactNode } from "react";

interface EmptyStateProps {
  message: ReactNode;
  title?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ message, title, icon, action, className }: EmptyStateProps) {
  return (
    <div className={className ? `empty-state ${className}` : "empty-state"} role="status">
      {icon && <div className="empty-icon">{icon}</div>}
      {title && <h3>{title}</h3>}
      {typeof message === "string" ? <p>{message}</p> : message}
      {action}
    </div>
  );
}
