"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { IMediaAsset } from "@/app/types/media.types";
import { getMedia, uploadMediaFiles } from "@/services/media.services";
import { Search, UploadCloud, CheckCircle2, Image as ImageIcon, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface MediaSelectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (asset: IMediaAsset) => void;
  selectedId?: string | null;
  title?: string;
  description?: string;
}

export function MediaSelectModal({
  open,
  onOpenChange,
  onSelect,
  selectedId,
  title = "Select Media Asset",
  description = "Choose an image from your library or upload a new one to assign to this page.",
}: MediaSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<IMediaAsset | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-media-select", { searchTerm }],
    queryFn: () => getMedia({ searchTerm, limit: 30, sortBy: "createdAt", sortOrder: "desc" }),
    enabled: open,
    staleTime: 30_000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (files: FileList) => {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("media", files[i]);
      }
      return uploadMediaFiles(formData);
    },
    onSuccess: (uploaded) => {
      toast.success(`Uploaded ${uploaded.length} image(s).`);
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      queryClient.invalidateQueries({ queryKey: ["admin-media-select"] });
      if (uploaded[0]) {
        setSelectedAsset(uploaded[0]);
      }
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to upload file.");
    },
  });

  const assets = data?.data ?? [];

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl flex flex-col p-6">
        <DialogHeader className="pb-3 border-b border-border/60">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        {/* Toolbar: Search and Upload */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 my-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search media by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div>
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
              type="button"
              size="sm"
              variant="outline"
              className="gap-2 text-xs h-9"
              disabled={uploadMutation.isPending}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadMutation.isPending ? (
                <>
                  <Spinner className="size-3.5" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Plus className="size-3.5" />
                  <span>Upload Image</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 min-h-64 max-h-[50vh] overflow-y-auto rounded-xl border border-border/70 bg-muted/20 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground text-sm">
              <Spinner className="size-6 text-primary" />
              <span>Loading media library...</span>
            </div>
          ) : assets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                <ImageIcon className="size-6" />
              </div>
              <p className="text-sm font-medium text-foreground">No media assets found</p>
              <p className="text-xs text-muted-foreground max-w-xs">
                Upload images from your computer to use them as featured thumbnails and social previews.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 text-xs"
              >
                <UploadCloud className="size-3.5" />
                Upload New Image
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {assets.map((asset) => {
                const isCurrentSelected =
                  selectedAsset?.id === asset.id ||
                  (!selectedAsset && selectedId === asset.id);

                return (
                  <button
                    type="button"
                    key={asset.id}
                    onClick={() => setSelectedAsset(asset)}
                    className={cn(
                      "group relative flex flex-col rounded-xl border overflow-hidden bg-card text-left transition-all hover:border-primary/60 hover:shadow-sm focus:outline-hidden",
                      isCurrentSelected
                        ? "border-primary ring-2 ring-primary/40 bg-primary/5"
                        : "border-border/70"
                    )}
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-muted/50 flex items-center justify-center">
                      <Image
                        height={109}
                        width={193}
                        src={asset.secureUrl || asset.url}
                        alt={asset.altText || asset.fileName}
                        className="size-full object-cover transition-transform group-hover:scale-105"
                      />
                      {isCurrentSelected && (
                        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] flex items-center justify-center">
                          <CheckCircle2 className="size-7 text-primary fill-background shadow-xs" />
                        </div>
                      )}
                    </div>

                    <div className="p-2 space-y-1">
                      <p className="text-xs font-semibold text-foreground truncate" title={asset.fileName}>
                        {asset.fileName}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>{asset.format?.toUpperCase() || "IMG"}</span>
                        <span>{(asset.size / 1024).toFixed(0)} KB</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected asset brief */}
        {selectedAsset && (
          <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/50 p-2.5 text-xs border border-border/50">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-foreground">Selected:</span>
              <span className="text-muted-foreground truncate">{selectedAsset.fileName}</span>
            </div>
            {selectedAsset.width && selectedAsset.height && (
              <Badge variant="secondary" className="text-[10px]">
                {selectedAsset.width} × {selectedAsset.height}
              </Badge>
            )}
          </div>
        )}

        <DialogFooter className="mt-4 pt-3 border-t border-border/60">
          <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>} />
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedAsset && !selectedId}
          >
            Assign Selected Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
