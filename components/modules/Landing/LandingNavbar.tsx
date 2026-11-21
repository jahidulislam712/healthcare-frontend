"use client";

import Link from "next/link";
import { useState } from "react";
import { HeartPulse, Menu, X, ArrowRight, LogIn } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { ModeToggle } from "@/components/features/ModeToggle";
import { UserInfo } from "@/app/types/auth.types";
import { cn } from "@/lib/utils";
import UserDropdown from "../Dashboard/UserDropdown";


interface LandingNavbarProps {
  currentUser: UserInfo | null;
}

export default function LandingNavbar({ currentUser }: LandingNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Specialties", href: "/#specialties" },
    { label: "Find Doctors", href: "/#doctors" },
    { label: "Services", href: "/#services" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Consultation", href: "/consultation" },
    { label: "Health Plans", href: "/health-plans" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
            <HeartPulse className="size-6" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-lg font-bold tracking-tight text-foreground">
                HealthCare
              </span>
              <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                PRO
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground -mt-1 font-medium">
              Medical & Telehealth
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <ModeToggle />

          {currentUser ? (
            <UserDropdown user={currentUser} />
          ) : (
            <>
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 text-muted-foreground hover:text-foreground")}
              >
                <LogIn className="size-4" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/consultation"
                className={cn(buttonVariants({ variant: "default", size: "sm" }), "gap-1.5 shadow-sm")}
              >
                <span>Book Appointment</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 sm:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="border-b border-border/60 bg-background/95 px-4 pt-2 pb-6 sm:hidden animate-in fade-in slide-in-from-top-2">
          <nav className="flex flex-col gap-3 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 text-sm font-medium text-foreground/80 hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {currentUser ? (
              <UserDropdown user={currentUser} />
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full justify-center")}
                >
                  Sign In
                </Link>
                <Link
                  href="/consultation"
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(buttonVariants(), "w-full justify-center")}
                >
                  Book Appointment
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
