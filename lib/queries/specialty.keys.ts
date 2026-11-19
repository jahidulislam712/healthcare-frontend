
export const specialtyKeys = {
  all: ["admin-specialties"] as const,

  lists: () => [...specialtyKeys.all, "list"] as const,

  list: (filters?: Record<string, unknown>) =>
    [...specialtyKeys.lists(), filters] as const,

  details: () => [...specialtyKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...specialtyKeys.details(), id] as const,
};
