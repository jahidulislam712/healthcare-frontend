"use client";

import { useState, useRef, DragEvent } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedia,
  uploadMediaFiles,
  updateMediaAsset,
  deleteMediaAsset,
} from "@/services/media.services";
import { IMediaAsset } from "@/app/types/media.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Search,
  UploadCloud,
  LayoutGrid,
  List as ListIcon,
  Trash2,
  Copy,
  Check,
  Edit2,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAsset, setSelectedAsset] = useState<IMediaAsset | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Edit fields for selected asset
  const [editAltText, setEditAltText] = useState("");
  const [editCaption, setEditCaption] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const params = {
    searchTerm,
    page: pageNumber,
    limit: 12,
    sortBy: "createdAt",
    sortOrder: "desc" as const,
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-media", params],
    queryFn: () => getMedia(params),
    staleTime: 30_000,
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: FileList | File[]) => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("media", files[i]);
      }
      return uploadMediaFiles(formData);
    },
    onSuccess: (uploaded) => {
      toast.success(`Successfully uploaded ${uploaded.length} asset(s).`);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Upload failed. Please check file formats.");
    },
  });

  // Update Metadata Mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, altText, caption }: { id: string; altText: string; caption: string }) => {
      return updateMediaAsset(id, { altText, caption });
    },
    onSuccess: (updated) => {
      toast.success("Media metadata updated.");
      setSelectedAsset(updated);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update media details.");
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteMediaAsset,
    onSuccess: () => {
      toast.success("Media asset deleted.");
      setIsDetailOpen(false);
      setSelectedAsset(null);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to delete media asset.");
    },
  });

  const assets = data?.data ?? [];
  const meta = data?.meta;

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openDetails = (asset: IMediaAsset) => {
    setSelectedAsset(asset);
    setEditAltText(asset.altText ?? "");
    setEditCaption(asset.caption ?? "");
    setIsDetailOpen(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadMutation.mutate(e.dataTransfer.files);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Media Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, optimize, and organize images and assets for website pages, blogs, and departments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                uploadMutation.mutate(e.target.files);
                e.target.value = "";
              }
            }}
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
            className="gap-2 shadow-xs"
          >
            {uploadMutation.isPending ? (
              <>
                <Spinner className="size-4" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="size-4" />
                <span>Upload Media</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all duration-200",
          isDragOver
            ? "border-primary bg-primary/10 scale-[0.99]"
            : "border-border/80 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
        )}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <div className="text-sm font-semibold text-foreground">
            {uploadMutation.isPending ? "Uploading media to cloud storage..." : "Drag and drop images here, or click to browse"}
          </div>
          <p className="text-xs text-muted-foreground">
            Supports JPG, PNG, WebP, GIF, SVG. Max 10MB per file.
          </p>
        </div>
      </div>

      {/* Filter and View Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search media by filename..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageNumber(1);
            }}
            className="pl-9 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {meta && (
            <span className="text-xs text-muted-foreground mr-2 font-medium">
              {meta.total} {meta.total === 1 ? "asset" : "assets"}
            </span>
          )}

          <div className="flex items-center rounded-lg border border-border p-1 bg-card">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("grid")}
              title="Grid view"
            >
              <LayoutGrid className="size-3.5" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon-xs"
              onClick={() => setViewMode("list")}
              title="List view"
            >
              <ListIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground text-sm">
          <Spinner className="size-8 text-primary" />
          <span>Loading media assets...</span>
        </div>
      ) : assets.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card/60 p-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-3">
            <ImageIcon className="size-7" />
          </div>
          <h3 className="text-base font-bold text-foreground">No media assets found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4">
            Upload images from your computer to use them on CMS pages, articles, and departments.
          </p>
          <Button
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="gap-2 text-xs"
          >
            <UploadCloud className="size-4" />
            Upload Your First Image
          </Button>
        </div>
      ) : viewMode === "grid" ? (
        /* Grid Gallery View */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assets.map((asset) => {
            const usageCount =
              (asset._count?.pageThumbnails ?? 0) +
              (asset._count?.pageOgImages ?? 0) +
              (asset._count?.blogFeaturedImages ?? 0);

            return (
              <div
                key={asset.id}
                className="group relative flex flex-col rounded-2xl border border-border/70 bg-card overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                {/* Thumbnail */}
                <div
                  onClick={() => openDetails(asset)}
                  className="relative aspect-square w-full cursor-pointer overflow-hidden bg-muted/40"
                >
                  <Image
                              height={30}
                              width={30}
                    src={asset.secureUrl || asset.url}
                    alt={asset.altText || asset.fileName}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetails(asset);
                      }}
                      title="Inspect & Edit"
                    >
                      <Edit2 className="size-3" />
                    </Button>
                    <Button
                      size="icon-xs"
                      variant="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyLink(asset.secureUrl || asset.url, asset.id);
                      }}
                      title="Copy URL"
                    >
                      {copiedId === asset.id ? (
                        <Check className="size-3 text-emerald-500" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-3 space-y-1">
                  <p
                    className="text-xs font-semibold text-foreground truncate cursor-pointer hover:text-primary transition-colors"
                    title={asset.fileName}
                    onClick={() => openDetails(asset)}
                  >
                    {asset.fileName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                    <span>{asset.format?.toUpperCase() || "IMG"}</span>
                    <span>{formatFileSize(asset.size)}</span>
                  </div>

                  {usageCount > 0 && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 border-primary/30 text-primary">
                      Used in {usageCount} {usageCount === 1 ? "page" : "pages"}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List / Table View */
        <div className="overflow-x-auto rounded-2xl border border-border/80 bg-card">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/50 text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5 pl-4">Asset</th>
                <th className="p-3.5">Filename</th>
                <th className="p-3.5">Dimensions</th>
                <th className="p-3.5">Size</th>
                <th className="p-3.5">Format</th>
                <th className="p-3.5">Uploaded</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-3.5 pl-4">
                    <div className="size-10 rounded-lg overflow-hidden border border-border bg-muted/40">
                      <Image
                              height={30}
                              width={30}
                        src={asset.secureUrl || asset.url}
                        alt={asset.altText || asset.fileName}
                        className="size-full object-cover cursor-pointer"
                        onClick={() => openDetails(asset)}
                      />
                    </div>
                  </td>
                  <td className="p-3.5">
                    <p
                      className="font-semibold text-foreground max-w-xs truncate cursor-pointer hover:text-primary"
                      onClick={() => openDetails(asset)}
                      title={asset.fileName}
                    >
                      {asset.fileName}
                    </p>
                    {asset.altText && (
                      <p className="text-[10px] text-muted-foreground truncate max-w-xs">
                        Alt: {asset.altText}
                      </p>
                    )}
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    {asset.width && asset.height ? `${asset.width} × ${asset.height}` : "—"}
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    {formatFileSize(asset.size)}
                  </td>
                  <td className="p-3.5">
                    <Badge variant="secondary" className="text-[10px]">
                      {asset.format?.toUpperCase() || "IMG"}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-muted-foreground">
                    {format(new Date(asset.createdAt), "MMM d, yyyy")}
                  </td>
                  <td className="p-3.5 pr-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="icon-xs"
                        variant="ghost"
                        onClick={() => handleCopyLink(asset.secureUrl || asset.url, asset.id)}
                        title="Copy link"
                      >
                        {copiedId === asset.id ? (
                          <Check className="size-3 text-emerald-500" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                      </Button>
                      <Button
                        size="icon-xs"
                        variant="outline"
                        onClick={() => openDetails(asset)}
                        title="Edit details"
                      >
                        <Edit2 className="size-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs">
          <span className="text-muted-foreground">
            Page {meta.page} of {meta.totalPages} ({meta.total} items)
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page <= 1 || isFetching}
              onClick={() => setPageNumber((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={meta.page >= meta.totalPages || isFetching}
              onClick={() => setPageNumber((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Media Detail & Inspection Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl flex flex-col p-6">
          <DialogHeader className="pb-3 border-b border-border/60">
            <DialogTitle className="text-lg font-bold">Asset Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Inspect file specifications, update accessibility alt text, or delete asset.
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="space-y-5 my-2">
              {/* Preview image */}
              <div className="relative max-h-72 w-full overflow-hidden rounded-xl border border-border/80 bg-muted/40 flex items-center justify-center p-2">
                <Image
                              height={30}
                              width={30}
                  src={selectedAsset.secureUrl || selectedAsset.url}
                  alt={selectedAsset.altText || selectedAsset.fileName}
                  className="max-h-68 max-w-full rounded-lg object-contain shadow-xs"
                />
              </div>

              {/* URL with quick copy */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">CDN Link</label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={selectedAsset.secureUrl || selectedAsset.url}
                    className="text-xs font-mono bg-muted/40"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 gap-1.5 text-xs"
                    onClick={() => handleCopyLink(selectedAsset.secureUrl || selectedAsset.url, selectedAsset.id)}
                  >
                    {copiedId === selectedAsset.id ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                    <span>Copy</span>
                  </Button>
                </div>
              </div>

              {/* Metadata Attributes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-xl bg-muted/30 p-3.5 text-xs border border-border/50">
                <div>
                  <span className="text-muted-foreground block text-[10px]">Format</span>
                  <span className="font-bold text-foreground">{selectedAsset.format?.toUpperCase() || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Dimensions</span>
                  <span className="font-bold text-foreground">
                    {selectedAsset.width && selectedAsset.height ? `${selectedAsset.width} × ${selectedAsset.height}` : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">File Size</span>
                  <span className="font-bold text-foreground">{formatFileSize(selectedAsset.size)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px]">Uploaded On</span>
                  <span className="font-bold text-foreground">
                    {format(new Date(selectedAsset.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
              </div>

              {/* Editable Fields: Alt text and Caption */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Alt Text (Accessibility & SEO)
                  </label>
                  <Input
                    placeholder="Brief description of the image content..."
                    value={editAltText}
                    onChange={(e) => setEditAltText(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Caption
                  </label>
                  <Input
                    placeholder="Optional image caption..."
                    value={editCaption}
                    onChange={(e) => setEditCaption(e.target.value)}
                    className="text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between sm:justify-between w-full">
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 text-xs"
              disabled={deleteMutation.isPending || !selectedAsset}
              onClick={() => {
                if (selectedAsset && confirm(`Are you sure you want to delete "${selectedAsset.fileName}"?`)) {
                  deleteMutation.mutate(selectedAsset.id);
                }
              }}
            >
              <Trash2 className="size-3.5" />
              <span>Delete Asset</span>
            </Button>

            <div className="flex items-center gap-2">
              <DialogClose render={<Button variant="outline" size="sm">Close</Button>} />
              <Button
                size="sm"
                disabled={updateMutation.isPending || !selectedAsset}
                onClick={() => {
                  if (selectedAsset) {
                    updateMutation.mutate({
                      id: selectedAsset.id,
                      altText: editAltText.trim() || "",
                      caption: editCaption.trim() || "",
                    });
                  }
                }}
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
