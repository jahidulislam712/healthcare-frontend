"use client";

import { IPage } from "@/app/types/page.types";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PageForm from "@/components/modules/Admin/PageManagement/PageForm";
import { deletePage, getPages } from "@/services/page.services";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";

export default function PageManagementContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPage, setSelectedPage] = useState<IPage | null>(null);
  const queryClient = useQueryClient();
  const params = { searchTerm, page: pageNumber, limit: 10 };
  
  const { data, isFetching, isError, error } = useQuery({
    queryKey: ["admin-pages", params],
    queryFn: () => getPages(params),
    placeholderData: keepPreviousData,
    staleTime: 60_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePage,
    onSuccess: async () => {
      toast.success("Page deleted.");
      await queryClient.invalidateQueries({ queryKey: ["admin-pages"] });
      await queryClient.invalidateQueries({
        queryKey: ["admin-pages-parent-options"],
      });
    },
    onError: (deleteError) => {
      console.error("Page deletion failed.", deleteError);
      toast.error(deleteError.message || "Unable to delete page.");
    },
  });

  const pages = (data?.data ?? []).filter((item) => !item.isDeleted);
  const meta = data?.meta;

  const handleDelete = (item: IPage) => {
    try {
      toast.warning(`Are you sure you want to delete "${item.title}"?`, {
        action: {
          label: "Delete",
          onClick: () => {
            toast.promise(deleteMutation.mutateAsync(item.id), {
              loading: "Deleting...",
              success: "Deleted successfully.",
              error: (error) => error.message || "Failed to delete",
            });
          },
        },
        cancel: {
          label: "Cancel",
          onClick: () => {},
        },
        duration: 5000,
        position: "bottom-center",
      });
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Pages
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create and manage website pages.
          </p>
        </div>
        <Link className={buttonVariants()} href="/pages/create">
          Add new page
        </Link>
      </header>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          className="sm:max-w-sm"
          value={searchTerm}
          placeholder="Search pages..."
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPageNumber(1);
          }}
        />
        {meta && (
          <p className="text-sm text-muted-foreground">
            {meta.total} page{meta.total === 1 ? "" : "s"}
          </p>
        )}
      </div>

      {isError ? (
        <div
          className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
          role="alert"
        >
          {error.message || "Unable to load pages."}
        </div>
      ) : (
        <>
          <div
            className="overflow-x-auto rounded-md border"
            aria-busy={isFetching}
          >
            <table className="w-full min-w-180 text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Parent</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isFetching && !data ? (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      Loading pages...
                    </td>
                  </tr>
                ) : pages.length ? (
                  pages.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {item.thumbnailMedia?.secureUrl ? (
                            <Image
                              height={40}
                              width={40}
                              src={item.thumbnailMedia.secureUrl}
                              alt={item.title}
                              className="size-10 rounded-lg object-cover border border-border/80 shrink-0"
                            />
                          ) : (
                            <div className="size-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground border border-border/60 shrink-0 text-xs font-bold">
                              {item.title.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-medium truncate">{item.title}</p>
                            {item.status === "PUBLISHED" ? (
                              <Link
                                className="text-xs text-muted-foreground hover:underline truncate block"
                                href={`/${encodeURIComponent(item.slug)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                /{item.slug}
                              </Link>
                            ) : (
                              <p className="text-xs text-muted-foreground truncate">
                                /{item.slug}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-muted px-2 py-1 text-xs">
                          {item.status.replaceAll("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.parent?.title ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {format(new Date(item.updatedAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedPage(item)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={deleteMutation.isPending}
                            onClick={() => handleDelete(item)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-muted-foreground"
                      colSpan={5}
                    >
                      No pages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t py-3 text-sm">
            <span className="text-muted-foreground">
              Page {meta?.page ?? pageNumber} of {meta?.totalPages ?? 0}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={!meta || isFetching || meta.page <= 1}
                onClick={() => setPageNumber((current) => current - 1)}
              >
                Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!meta || isFetching || meta.page >= meta.totalPages}
                onClick={() => setPageNumber((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog
        open={selectedPage !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedPage(null);
        }}
        disablePointerDismissal
      >
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Edit page</DialogTitle>
            <DialogDescription>
              Update page content, publishing, hierarchy, and SEO settings.
            </DialogDescription>
          </DialogHeader>
          {selectedPage && (
            <PageForm
              key={selectedPage.id}
              page={selectedPage}
              onSaved={() => setSelectedPage(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
