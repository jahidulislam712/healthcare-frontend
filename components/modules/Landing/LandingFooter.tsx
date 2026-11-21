import Link from "next/link";
import { HeartPulse, Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import { IPage } from "@/app/types/page.types";

interface LandingFooterProps {
  publicPages: IPage[];
}

export default function LandingFooter({ publicPages }: LandingFooterProps) {
  const currentYear = new Date().getFullYear();

  const specialtiesLinks = [
    { name: "Cardiology", href: "/consultation?specialty=Cardiology" },
    { name: "Neurology", href: "/consultation?specialty=Neurology" },
    { name: "Pediatrics", href: "/consultation?specialty=Pediatrics" },
    { name: "Orthopedics", href: "/consultation?specialty=Orthopedics" },
    { name: "Dermatology", href: "/consultation?specialty=Dermatology" },
    { name: "General Medicine", href: "/consultation?specialty=General Medicine" },
  ];

  const quickLinks = [
    { name: "Book Consultation", href: "/consultation" },
    { name: "Health Plans", href: "/health-plans" },
    { name: "Medicine & Pharmacy", href: "/medicine" },
    { name: "Partner NGOs", href: "/ngos" },
    { name: "Patient Portal", href: "/login" },
  ];

  return (
    <footer className="border-t border-border/70 bg-card/60 backdrop-blur-xs">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <HeartPulse className="size-5" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                HealthCare
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Empowering patients with verified healthcare specialists, digital consultations, instant scheduling, and integrated medical records on a trusted medical platform.
            </p>

            <div className="space-y-2 pt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="size-3.5 text-primary" />
                <span>24/7 Helpline: +1 (800) 555-0199</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-3.5 text-primary" />
                <span>support@healthcare-pro.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary" />
                <span>742 Medical Park Blvd, Health District</span>
              </div>
            </div>
          </div>

          {/* Col 2: Specialties */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide text-foreground mb-4">
              Specialties
            </h4>
            <ul className="space-y-2.5 text-xs">
              {specialtiesLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide text-foreground mb-4">
              Patient Services
            </h4>
            <ul className="space-y-2.5 text-xs">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Public CMS Pages */}
          <div>
            <h4 className="font-heading text-sm font-semibold tracking-wide text-foreground mb-4">
              Information & Legal
            </h4>
            <ul className="space-y-2.5 text-xs">
              {publicPages && publicPages.length > 0 ? (
                publicPages.map((page) => (
                  <li key={page.id}>
                    <Link
                      href={`/${encodeURIComponent(page.slug)}`}
                      className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span>{page.title}</span>
                      <ExternalLink className="size-2.5 opacity-60" />
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/about-us" className="text-muted-foreground hover:text-primary">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms-of-service" className="text-muted-foreground hover:text-primary">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/patient-rights" className="text-muted-foreground hover:text-primary">
                      Patient Rights
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} HealthCare Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>All Systems Operational</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
