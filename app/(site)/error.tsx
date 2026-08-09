"use client";

import { useEffect } from "react";

import { ErrorState } from "@/components/ui/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: "var(--spacing-xl) 0" }}>
      <ErrorState message="Une erreur inattendue est survenue." onRetry={reset} />
    </div>
  );
}
