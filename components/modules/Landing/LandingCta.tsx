import Link from "next/link";
import { PhoneCall, CalendarCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function LandingCta() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 px-6 py-12 sm:px-12 sm:py-16 text-primary-foreground shadow-xl">
          {/* Subtle background circles */}
          <div className="pointer-events-none absolute -right-16 -top-16 size-80 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 size-80 rounded-full bg-black/10 blur-2xl" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold backdrop-blur-xs mb-4">
              <ShieldAlert className="size-3.5" />
              <span>24/7 Priority Medical Triage</span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl lg:leading-tight">
              Need Immediate Medical Consultation?
            </h2>

            <p className="mt-4 text-base sm:text-lg opacity-90 leading-relaxed max-w-2xl">
              Connect with on-duty physicians right now for urgent care guidance, prescriptions, and immediate appointments without delay.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/consultation"
                className={cn(
                  buttonVariants({ size: "lg", variant: "secondary" }),
                  "gap-2 font-semibold shadow-sm h-12 px-6"
                )}
              >
                <CalendarCheck className="size-4" />
                <span>Book Consultation Now</span>
                <ArrowRight className="size-4" />
              </Link>

              <a
                href="tel:+18005550199"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "gap-2 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white h-12 px-6"
                )}
              >
                <PhoneCall className="size-4" />
                <span>Helpline: +1 (800) 555-0199</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
