import Link from "next/link";
import { Star, ShieldCheck, CalendarCheck, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { IDoctor, Gender, UserStatus } from "@/app/types/doctor.types";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface LandingDoctorsProps {
  doctors: IDoctor[];
}

const FALLBACK_DOCTORS: IDoctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Jenkins",
    email: "sarah.jenkins@healthcare.org",
    gender: Gender.FEMALE,
    registrationNumber: "REG-89210",
    appointmentFee: 80,
    qualification: "MBBS, MD (Cardiology), FACC",
    currentWorkingPlace: "Metro Heart Institute & Hospital",
    designation: "Senior Consultant Cardiologist",
    averageRating: 4.9,
    experience: 14,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      status: UserStatus.ACTIVE,
      role: "DOCTOR",
      emailVerified: true,
      needPasswordChange: false,
    },
    specialties: [
      {
        specialtyId: "spec-1",
        docorId: "doc-1",
        specialty: {
          id: "spec-1",
          title: "Cardiology",
          description: "Heart Care",
          icons: "Heart",
        },
      },
    ],
  },
  {
    id: "doc-2",
    name: "Dr. Michael Chen",
    email: "michael.chen@healthcare.org",
    gender: Gender.MALE,
    registrationNumber: "REG-78192",
    appointmentFee: 90,
    qualification: "MBBS, MS, PhD (Neurology)",
    currentWorkingPlace: "National Neurosciences Center",
    designation: "Chief Neurosurgeon & Specialist",
    averageRating: 4.95,
    experience: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      status: UserStatus.ACTIVE,
      role: "DOCTOR",
      emailVerified: true,
      needPasswordChange: false,
    },
    specialties: [
      {
        specialtyId: "spec-2",
        docorId: "doc-2",
        specialty: {
          id: "spec-2",
          title: "Neurology",
          description: "Brain and Spine",
          icons: "Activity",
        },
      },
    ],
  },
  {
    id: "doc-3",
    name: "Dr. Emily Rodriguez",
    email: "emily.rodriguez@healthcare.org",
    gender: Gender.FEMALE,
    registrationNumber: "REG-65431",
    appointmentFee: 65,
    qualification: "MBBS, DCH, FAAP (Pediatrics)",
    currentWorkingPlace: "Children's Health Pavilion",
    designation: "Pediatric Specialist & Neonatologist",
    averageRating: 4.88,
    experience: 11,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      status: UserStatus.ACTIVE,
      role: "DOCTOR",
      emailVerified: true,
      needPasswordChange: false,
    },
    specialties: [
      {
        specialtyId: "spec-3",
        docorId: "doc-3",
        specialty: {
          id: "spec-3",
          title: "Pediatrics",
          description: "Child Health",
          icons: "Baby",
        },
      },
    ],
  },
  {
    id: "doc-4",
    name: "Dr. David Patel",
    email: "david.patel@healthcare.org",
    gender: Gender.MALE,
    registrationNumber: "REG-99120",
    appointmentFee: 75,
    qualification: "MBBS, MS (Orthopedics), FRCS",
    currentWorkingPlace: "Apex Orthopedic Trauma Institute",
    designation: "Joint Replacement & Spine Consultant",
    averageRating: 4.92,
    experience: 15,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      status: UserStatus.ACTIVE,
      role: "DOCTOR",
      emailVerified: true,
      needPasswordChange: false,
    },
    specialties: [
      {
        specialtyId: "spec-4",
        docorId: "doc-4",
        specialty: {
          id: "spec-4",
          title: "Orthopedics",
          description: "Bone and Joint",
          icons: "Bone",
        },
      },
    ],
  },
];

export default function LandingDoctors({ doctors }: LandingDoctorsProps) {
  const displayDoctors = doctors && doctors.length > 0 ? doctors : FALLBACK_DOCTORS;

  const getInitials = (name: string) => {
    return name
      .replace(/^Dr\.\s*/i, "")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <section id="doctors" className="scroll-mt-16 py-16 md:py-24 bg-muted/20 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-2.5 text-primary border-primary/30 bg-primary/5">
            Verified Specialists
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Meet Leading Healthcare Specialists
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Connect with board-certified medical professionals equipped with deep clinical experience and stellar patient ratings.
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayDoctors.slice(0, 8).map((doc) => {
            const specialtyNames = doc.specialties?.map((s) => s.specialty?.title).filter(Boolean) || [];

            return (
              <Card
                key={doc.id}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="relative">
                      <Avatar className="size-16 rounded-full shadow-xs">
                        {doc.profilePhoto && <AvatarImage src={doc.profilePhoto} alt={doc.name} />}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                          {getInitials(doc.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs" title="Verified Doctor">
                        <ShieldCheck className="size-3.5" />
                      </span>
                    </div>

                    <div className="flex items-center gap-1 rounded-lg bg-amber-500/10 px-2 py-1 text-xs font-bold text-amber-600 dark:text-amber-400">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{doc.averageRating > 0 ? doc.averageRating.toFixed(1) : "5.0"}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs font-medium text-primary mt-0.5 line-clamp-1">
                      {doc.designation || "Senior Medical Consultant"}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-3">
                  <div className="space-y-1.5 text-xs text-muted-foreground border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2 line-clamp-1">
                      <GraduationCap className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{doc.qualification || "MBBS"}</span>
                    </div>
                    <div className="flex items-center gap-2 line-clamp-1">
                      <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span className="truncate">{doc.currentWorkingPlace || "General Hospital"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="size-3.5 shrink-0 text-muted-foreground/70" />
                      <span>{doc.experience > 0 ? `${doc.experience} Years Experience` : "Experienced"}</span>
                    </div>
                  </div>

                  {/* Specialty Tags */}
                  {specialtyNames.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {specialtyNames.slice(0, 2).map((name) => (
                        <Badge key={name} variant="secondary" className="text-[10px] font-medium px-2 py-0">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-5 pt-0 border-t border-border/50 flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Consultation</span>
                    <span className="text-sm font-bold text-foreground">
                      ${doc.appointmentFee || 50}
                    </span>
                  </div>

                  <Link
                    href={`/consultation?doctor=${encodeURIComponent(doc.id)}`}
                    className={cn(buttonVariants({ size: "sm" }), "gap-1.5 shadow-2xs")}
                  >
                    <CalendarCheck className="size-3.5" />
                    <span>Book</span>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/consultation"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 px-8")}
          >
            <span>View All Doctors & Schedule Online</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
