import { Metadata } from "next";
import MediaLibrary from "@/components/modules/Media/MediaLibrary";

export const metadata: Metadata = {
  title: "Media Library - Digital Assets",
  description: "Manage uploaded media assets, images, and content files.",
};

export default function MediaPage() {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <MediaLibrary />
    </div>
  );
}
