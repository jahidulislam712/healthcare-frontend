"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarCheck,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  Stethoscope,
  Video,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LandingHeroProps {
  doctorCount: number;
  specialtyCount: number;
}

export default function LandingHero({ doctorCount, specialtyCount }: LandingHeroProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/consultation?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push("/consultation");
    }
  };

  return (
    <section className="relative overflow-hidden bg-radial from-primary/10 via-background to-background pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-28 lg:pb-32">
      {/* Decorative background glow */}
      <div className="pointer-events-none absolute -top-40 right-1/4 -z-10 size-96 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 -z-10 size-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline and Actions */}
          <div className="flex flex-col gap-6 lg:col-span-7">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/30 bg-primary/5 px-3 py-1 text-primary text-xs font-semibold gap-1.5 shadow-2xs">
                <Sparkles className="size-3.5 text-primary" />
                Verified Specialist Doctors & Care
              </Badge>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.12]">
              Compassionate Care, <br />
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                World-Class Medicine
              </span>, <br />
              Closer to You.
            </h1>

            <p className="max-w-2xl text-base text-muted-foreground sm:text-lg sm:leading-relaxed">
              Find verified doctors across {specialtyCount > 0 ? `${specialtyCount}+` : "25+"} departments. Schedule seamless in-clinic or instant video consultations with digital prescriptions and 24/7 patient assistance.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} className="mt-2 flex w-full max-w-xl flex-col gap-2 rounded-2xl border border-border/70 bg-card p-2 shadow-lg sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by doctor, specialty, or hospital..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 border-0 bg-transparent pl-10 pr-4 text-sm shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/70"
                />
              </div>
              <Button type="submit" size="lg" className="h-11 px-6 shadow-sm gap-2">
                <span>Find Doctors</span>
                <ArrowRight className="size-4" />
              </Button>
            </form>

            {/* Popular Specialty Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground/80">Popular:</span>
              {["Cardiology", "Neurology", "Pediatrics", "Dermatology", "Orthopedics"].map((spec) => (
                <Link
                  key={spec}
                  href={`/consultation?specialty=${encodeURIComponent(spec)}`}
                  className="rounded-md border border-border/60 bg-muted/50 px-2.5 py-1 text-muted-foreground transition hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                >
                  {spec}
                </Link>
              ))}
            </div>

            {/* Trust points */}
            <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-3 sm:gap-6 border-t border-border/60">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="size-5 shrink-0 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">Verified Medical Board</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-5 shrink-0 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">Zero Wait Queue</span>
              </div>
              <div className="flex items-center gap-2.5 col-span-2 sm:col-span-1">
                <Video className="size-5 shrink-0 text-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">HD Teleconsultation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card */}
          <div className="relative flex justify-center lg:col-span-5">
            <div className="relative w-full max-w-md">
              {/* Back card highlight */}
              <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-tr from-primary/30 to-accent/30 opacity-70 blur-xl" />

              {/* Main Card */}
              <div className="relative rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between border-b border-border/50 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Stethoscope className="size-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-foreground">Dr. Sarah Jenkins</h4>
                      <p className="text-xs text-muted-foreground">Chief Cardiologist • MBBS, MD</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Available Today
                  </Badge>
                </div>

                <div className="my-5 space-y-3">
                  <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                    <span className="text-xs font-medium text-muted-foreground">Patient Satisfaction</span>
                    <div className="flex items-center gap-1 font-bold text-foreground text-xs">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>4.9 / 5.0 (420+ reviews)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                    <span className="text-xs font-medium text-muted-foreground">Experience</span>
                    <span className="text-xs font-bold text-foreground">14+ Years in Clinical Practice</span>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-muted/60 p-3">
                    <span className="text-xs font-medium text-muted-foreground">Next Available Slot</span>
                    <span className="text-xs font-semibold text-primary">Today at 4:30 PM</span>
                  </div>
                </div>

                <Link
                  href="/consultation"
                  className={cn(buttonVariants({ size: "lg" }), "w-full gap-2 shadow-xs")}
                >
                  <CalendarCheck className="size-4" />
                  <span>Instant Booking</span>
                </Link>

                {/* Floating Micro Badge */}
                <div className="absolute -bottom-5 -left-4 flex items-center gap-2 rounded-xl border border-border bg-card p-3 shadow-lg">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Verified Doctors</p>
                    <p className="text-[11px] text-muted-foreground">{doctorCount > 0 ? `${doctorCount}+ on duty` : "200+ on duty"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
