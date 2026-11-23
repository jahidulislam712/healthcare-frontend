import { Suspense } from "react";
import type { Metadata } from "next";
import { getSpecialties } from "@/services/specialty.services";
import { getDoctors } from "@/services/doctor.services";
import { ISpecialty } from "@/app/types/specialty.types";
import { IDoctor } from "@/app/types/doctor.types";

import LandingHero from "@/components/modules/Landing/LandingHero";
import LandingStats from "@/components/modules/Landing/LandingStats";
import LandingSpecialties from "@/components/modules/Landing/LandingSpecialties";
import LandingDoctors from "@/components/modules/Landing/LandingDoctors";
import LandingServices from "@/components/modules/Landing/LandingServices";
import LandingHowItWorks from "@/components/modules/Landing/LandingHowItWorks";
import LandingTestimonials from "@/components/modules/Landing/LandingTestimonials";
import LandingCta from "@/components/modules/Landing/LandingCta";

export const metadata: Metadata = {
  title: "HealthCare - Leading Healthcare & Online Doctor Consultation",
  description:
    "Find certified doctors across top specialties, schedule appointments, and receive quality telemedicine consultations with digital prescriptions.",
};

async function fetchPublicLandingData() {
  const [specialtiesResult, doctorsResult] = await Promise.allSettled([
    getSpecialties({ limit: 12 }),
    getDoctors(),
  ]);

  const specialties: ISpecialty[] =
    specialtiesResult.status === "fulfilled" && specialtiesResult.value?.data
      ? specialtiesResult.value.data
      : [];

  const doctors: IDoctor[] =
    doctorsResult.status === "fulfilled" && doctorsResult.value?.data
      ? doctorsResult.value.data
      : [];

  return {
    specialties,
    doctors,
  };
}

async function LandingMainContent() {
  const { specialties, doctors } = await fetchPublicLandingData();

  return (
    <>
      {/* Hero Section */}
      <LandingHero
        doctorCount={doctors.length}
        specialtyCount={specialties.length}
      />

      {/* Platform Numbers & Stats Banner */}
      <LandingStats
        doctorCount={doctors.length}
        specialtyCount={specialties.length}
      />

      {/* Medical Specialties */}
      <LandingSpecialties specialties={specialties} />

      {/* Top Verified Doctors */}
      <LandingDoctors doctors={doctors} /> 

      {/* Core Services */}
      <LandingServices />

      {/* How It Works */}
      <LandingHowItWorks />

      {/* Patient Testimonials */}
      <LandingTestimonials />

      {/* 24/7 Helpline & Emergency Consultation CTA */}
      <LandingCta />
    </>
  );
}

function LandingLoadingFallback() {
  return (
    <div className="flex flex-col bg-background text-foreground animate-pulse">
      <div className="flex-1 py-20 px-8 max-w-7xl mx-auto w-full space-y-8">
        <div className="h-12 w-2/3 bg-muted/40 rounded-lg" />
        <div className="h-6 w-1/2 bg-muted/30 rounded-lg" />
        <div className="h-14 w-full max-w-lg bg-muted/30 rounded-xl" />
        <div className="grid grid-cols-4 gap-4 pt-12">
          <div className="h-28 bg-muted/20 rounded-xl" />
          <div className="h-28 bg-muted/20 rounded-xl" />
          <div className="h-28 bg-muted/20 rounded-xl" />
          <div className="h-28 bg-muted/20 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<LandingLoadingFallback />}>
      <LandingMainContent />
    </Suspense>
  );
}
