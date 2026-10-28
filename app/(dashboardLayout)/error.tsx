"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard rendering error:", error);
  }, [error]);

  return (
    <div className="flex min-h-64 flex-col items-center justify-center gap-4">
      <h2 className="text-lg font-semibold">Something went wrong</h2>

      <p className="text-sm text-muted-foreground">
        The dashboard could not be loaded.
      </p>

      <button
        onClick={() => reset()}
        className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
