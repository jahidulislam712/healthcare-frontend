import { ApiClientError } from "@/lib/axios/httpClient";
import { getPageBySlug } from "@/services/page.services";
import PageContent from "@/components/modules/Admin/PageManagement/PageContent";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";

type PublicPageProps = {
  params: Promise<{ slug: string }>;
};

const getCachedPage = cache(async (slug: string) => {
  try {
    return await getPageBySlug(slug);
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      notFound();
    }
    throw error;
  }
});

export async function generateMetadata({
  params,
}: PublicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getCachedPage(slug);
  const socialImage = page.ogImageMedia?.secureUrl || page.thumbnailMedia?.secureUrl;

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.excerpt || undefined,
    alternates: page.canonicalUrl
      ? { canonical: page.canonicalUrl }
      : undefined,
    robots: page.noIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.excerpt || undefined,
      images: socialImage ? [{ url: socialImage }] : undefined,
    },
  };
}

export default function PublicPage({ params }: PublicPageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-4xl px-6 py-12">Loading page...</main>
      }
    >
      <PublicPageContent params={params} />
    </Suspense>
  );
}

async function PublicPageContent({
  params,
}: PublicPageProps) {
  const { slug } = await params;
  const page = await getCachedPage(slug);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {page.parent && (
        <Link
          className="mb-6 inline-block text-sm text-muted-foreground hover:underline"
          href={`/${encodeURIComponent(page.parent.slug)}`}
        >
          {page.parent.title}
        </Link>
      )}
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">{page.title}</h1>
        {page.subtitle && (
          <p className="mt-3 text-xl text-muted-foreground">{page.subtitle}</p>
        )}
        {page.excerpt && (
          <p className="mt-5 text-lg text-muted-foreground">{page.excerpt}</p>
        )}
      </header>
      {page.thumbnailMedia?.secureUrl && (
        <div className="mb-10 overflow-hidden rounded-2xl border border-border/80 bg-muted/30 shadow-md">
          <Image
            width={846}
            height={476}
            src={page.thumbnailMedia.secureUrl}
            alt={page.thumbnailMedia.altText || page.title}
            className="w-full max-h-120 object-cover"
          />
          {page.thumbnailMedia.caption && (
            <p className="p-3 text-center text-xs text-muted-foreground bg-card/60 border-t border-border/50">
              {page.thumbnailMedia.caption}
            </p>
          )}
        </div>
      )}
      <article className="leading-7">
        <PageContent contentJson={page.contentJson} fallback={page.content} />
      </article>
      {page.children && page.children.length > 0 && (
        <nav className="mt-10 border-t pt-6" aria-label="Related pages">
          <h2 className="mb-3 font-semibold">Related pages</h2>
          <ul className="space-y-2">
            {page.children.map((child) => (
              <li key={child.id}>
                <Link
                  className="text-primary hover:underline"
                  href={`/${encodeURIComponent(child.slug)}`}
                >
                  {child.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </main>
  );
}
