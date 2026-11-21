import PageForm from "@/components/modules/Admin/PageManagement/PageForm";
import Link from "next/link";

export default function CreatePage() {
  return (
    <section className="mx-auto max-w-7xl space-y-6">
      <div>
        <Link
          href="/pages"
          className="text-sm text-muted-foreground hover:underline"
        >
          Back to pages
        </Link>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Create page
        </h1>
      </div>
      <PageForm />
    </section>
  );
}
