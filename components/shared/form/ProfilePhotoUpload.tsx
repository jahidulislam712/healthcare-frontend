
"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";

type ProfilePhotoUploadProps = {
  value: string;
  onChange: (url: string) => void;
};

export default function ProfilePhotoUpload({
  value,
  onChange,
}: ProfilePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(file?: File) {
    if (!file) return;

    setError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Choose a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setUploading(true);

    try {
      // Request a server-generated signature.
      const signatureResponse = await fetch(
        "/api/cloudinary/signature",
        { method: "POST" },
      );

      if (!signatureResponse.ok) {
        throw new Error("Unable to authorize image upload.");
      }

      const {
        timestamp,
        signature,
        folder,
        cloudName,
        apiKey,
      } = await signatureResponse.json();

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", String(timestamp));
      formData.append("signature", signature);
      formData.append("folder", folder);

      // Upload the file directly to Cloudinary.
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(
          result.error?.message || "Cloudinary upload failed.",
        );
      }

      // Store the secure URL in the form.
      onChange(result.secure_url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Upload failed.",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-3">
      {value && (
        <Image
          src={value}
          alt="Doctor profile preview"
          className="size-24 rounded-full border object-cover"
        />
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={uploading}
        onChange={(event) => {
          void handleUpload(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <Button
        type="button"
        variant="outline"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Spinner className="mr-2 size-4" />
            Uploading...
          </>
        ) : (
          value ? "Change Photo" : "Upload Profile Photo"
        )}
      </Button>

      <p className="text-xs text-muted-foreground">
        JPG, PNG, or WebP. Maximum size: 5 MB.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
