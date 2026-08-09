import Link from "next/link";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  fallbackHref?: string;
  fallbackLabel?: string;
}

export function ErrorState({
  message = "Impossible de charger les données.",
  onRetry,
  fallbackHref,
  fallbackLabel,
}: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <p>
        {message}{" "}
        {fallbackHref && fallbackLabel && (
          <Link href={fallbackHref} className="error-state__link">
            {fallbackLabel}
          </Link>
        )}
      </p>
      {onRetry && (
        <button type="button" className="btn-secondary" onClick={onRetry}>
          Réessayer
        </button>
      )}
    </div>
  );
}
