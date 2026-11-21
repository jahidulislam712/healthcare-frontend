import { Search, CalendarCheck, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingHowItWorks() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Find Your Specialist",
      description: "Search by medical specialty, symptoms, doctor designation, fee, or clinical hospital to select your ideal physician.",
    },
    {
      number: "02",
      icon: CalendarCheck,
      title: "Select Time & Book Slot",
      description: "Choose between in-clinic appointment or live video consultation and confirm your appointment with instantaneous verification.",
    },
    {
      number: "03",
      icon: HeartHandshake,
      title: "Consult & Receive Care",
      description: "Meet your doctor, receive expert medical counsel, and access your digitally signed prescription and treatment plan right away.",
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-16 py-16 md:py-24 bg-muted/30 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-2.5 text-primary border-primary/30 bg-primary/5">
            Simple Process
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            How Healthcare Works for You
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Three simple steps to connect with expert medical professionals and take control of your health journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl border border-border/70 bg-card p-8 shadow-xs transition hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <IconComp className="size-7" />
                  </div>
                  <span className="font-heading text-4xl font-black text-muted-foreground/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
