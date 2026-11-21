import { Users, Stethoscope, Award, Calendar } from "lucide-react";

interface LandingStatsProps {
  doctorCount: number;
  specialtyCount: number;
}

export default function LandingStats({ doctorCount, specialtyCount }: LandingStatsProps) {
  const stats = [
    {
      icon: Stethoscope,
      value: doctorCount > 0 ? `${doctorCount}+` : "500+",
      label: "Verified Doctors",
      description: "Across medical specialties",
    },
    {
      icon: Award,
      value: specialtyCount > 0 ? `${specialtyCount}+` : "25+",
      label: "Specialties Covered",
      description: "Complete health spectrum",
    },
    {
      icon: Users,
      value: "50,000+",
      label: "Patients Treated",
      description: "Trusted nationwide",
    },
    {
      icon: Calendar,
      value: "99.4%",
      label: "On-Time Consultation",
      description: "Zero waiting room friction",
    },
  ];

  return (
    <section className="relative border-y border-border/60 bg-muted/30 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
          {stats.map((stat, i) => {
            const IconComp = stat.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl transition hover:bg-card/70"
              >
                <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <IconComp className="size-6" />
                </div>
                <div className="font-heading text-2xl sm:text-3xl font-extrabold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm font-semibold text-foreground/90">
                  {stat.label}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">
                  {stat.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
