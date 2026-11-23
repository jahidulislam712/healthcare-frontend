import { ReactNode, Suspense } from "react";
import LandingNavbar from "@/components/modules/Landing/LandingNavbar";
import LandingFooter from "@/components/modules/Landing/LandingFooter";
import RagChatbot from "@/components/modules/Rag/RagChatbot";
import { getCurrentUser } from "@/lib/userUtils";
import { getPages } from "@/services/page.services";
import { IPage } from "@/app/types/page.types";

async function PublicNavbarWrapper() {
  const currentUser = await getCurrentUser();
  return (
    <>
      <LandingNavbar currentUser={currentUser} />
      {currentUser && <RagChatbot />}
    </>
  );
}

async function PublicFooterWrapper() {
  let publicPages: IPage[] = [];
  try {
    const res = await getPages({ limit: 8 });
    if (res?.data) {
      publicPages = res.data;
    }
  } catch {
    publicPages = [];
  }
  return <LandingFooter publicPages={publicPages} />;
}

export default function CommonPublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      <Suspense fallback={<div className="h-16 border-b border-border/40 bg-background/80" />}>
        <PublicNavbarWrapper />
      </Suspense>

      <main className="flex-1">{children}</main>

      <Suspense fallback={<div className="h-32 border-t border-border/40 bg-card/60" />}>
        <PublicFooterWrapper />
      </Suspense>
    </div>
  );
}
