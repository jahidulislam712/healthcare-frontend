export default function DashboardLoading() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-label="Loading dashboard content"
    >
      <div className="h-8 w-48 animate-pulse rounded bg-muted" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-xl border bg-muted/40"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-xl border bg-muted/40" />
    </div>
  );
}
