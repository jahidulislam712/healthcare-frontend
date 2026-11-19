export const doctorKeys = {
  all: ["admin-doctors"] as const,
  lists: () => [...doctorKeys.all, "list"] as const,
  list: (filters?: Record<string, unknown>) =>
    [...doctorKeys.lists(), filters] as const,
  details: () => [...doctorKeys.all, "detail"] as const,
  detail: (id: string) => [...doctorKeys.details(), id] as const,
};
