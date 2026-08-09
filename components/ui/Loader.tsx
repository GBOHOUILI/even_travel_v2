export function Loader({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="events-loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
