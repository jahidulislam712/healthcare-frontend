export function SidebarSkeleton() {
  return (
    <aside
      aria-label="Loading dashboard navigation"
      role="status"
      className="hidden h-screen w-64 shrink-0 flex-col border-r md:flex"
    >
      <div className="flex h-16 items-center border-b px-6">
        <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="flex-1 space-y-6 p-4">
        {Array.from({ length: 3 }).map((_, section) => (
          <div key={section} className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-muted" />

            {Array.from({ length: 4 }).map((_, item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-lg p-2"
              >
                <div className="h-4 w-4 animate-pulse rounded bg-muted" />
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t p-4">
        <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
        <div className="space-y-2">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </aside>
  );
}

export function NavbarSkeleton() {
  return (
    <div
      aria-label="Loading dashboard navbar"
      role="status"
      className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6"
    >
      <div className="h-5 w-32 animate-pulse rounded bg-muted" />
      <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
    </div>
  );
}
