import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ISpecialty } from "@/app/types/specialty.types";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Icon from "@/lib/iconMapper";
import { cn } from "@/lib/utils";

interface LandingSpecialtiesProps {
  specialties: ISpecialty[];
}

const FALLBACK_SPECIALTIES: ISpecialty[] = [
  {
    id: "spec-1",
    title: "Cardiology",
    description: "Heart and vascular disease management, ECG, hypertension and cardiovascular diagnostics.",
    icon: "Heart",
    _count: { doctorSpecialties: 24 },
  },
  {
    id: "spec-2",
    title: "Neurology",
    description: "Brain, nervous system, migraine, stroke recovery, and neuromuscular disorder care.",
    icon: "Activity",
    _count: { doctorSpecialties: 18 },
  },
  {
    id: "spec-3",
    title: "Pediatrics",
    description: "Infant, child and adolescent health, immunizations, and developmental wellness.",
    icon: "Baby",
    _count: { doctorSpecialties: 32 },
  },
  {
    id: "spec-4",
    title: "Orthopedics",
    description: "Bones, joint restoration, fracture repair, spine care, and sports trauma rehabilitation.",
    icon: "Bone",
    _count: { doctorSpecialties: 21 },
  },
  {
    id: "spec-5",
    title: "Dermatology",
    description: "Comprehensive skin, hair, and nail pathology treatments and medical aesthetics.",
    icon: "Sparkles",
    _count: { doctorSpecialties: 19 },
  },
  {
    id: "spec-6",
    title: "Dentistry",
    description: "Oral care, endodontics, orthodontics, oral hygiene, and restorative dental surgery.",
    icon: "Smile",
    _count: { doctorSpecialties: 15 },
  },
  {
    id: "spec-7",
    title: "Ophthalmology",
    description: "Vision care, cataract treatment, retina consultation, and eye microsurgery.",
    icon: "Eye",
    _count: { doctorSpecialties: 16 },
  },
  {
    id: "spec-8",
    title: "General Medicine",
    description: "Primary healthcare, preventive medicine, chronic illnesses, and overall diagnostics.",
    icon: "Stethoscope",
    _count: { doctorSpecialties: 45 },
  },
];

export default function LandingSpecialties({ specialties }: LandingSpecialtiesProps) {
  const displaySpecialties = specialties && specialties.length > 0 ? specialties : FALLBACK_SPECIALTIES;

  return (
    <section id="specialties" className="scroll-mt-16 py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <Badge variant="outline" className="mb-2.5 text-primary border-primary/30 bg-primary/5">
              Medical Departments
            </Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Specialized Care for Every Health Need
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Explore specialized departments staffed by certified doctors ready to provide personalized consultations.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/consultation"
              className={cn(buttonVariants({ variant: "outline" }), "gap-2 group")}
            >
              <span>View All Departments</span>
              <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Grid of Specialties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displaySpecialties.slice(0, 8).map((specialty) => {
            const docCount = specialty._count?.doctorSpecialties ?? 0;
            return (
              <Card
                key={specialty.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
              >
                <CardHeader className="p-6 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon name={specialty.icon || "Stethoscope"} className="size-6" />
                    </div>
                    {docCount > 0 && (
                      <Badge variant="secondary" className="text-[11px] font-medium">
                        {docCount} {docCount === 1 ? "Doctor" : "Doctors"}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {specialty.title}
                  </CardTitle>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {specialty.description || `Expert medical consultation and therapeutic care in ${specialty.title}.`}
                  </p>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <Link
                    href={`/consultation?specialty=${encodeURIComponent(specialty.title)}`}
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "sm" }),
                      "w-full justify-between p-0 h-8 text-xs font-semibold text-primary hover:text-primary hover:bg-transparent"
                    )}
                  >
                    <span>Consult Specialist</span>
                    <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
