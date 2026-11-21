import { Star, Quote, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function LandingTestimonials() {
  const testimonials = [
    {
      name: "Marcus Sterling",
      role: "Patient • Cardiology Care",
      rating: 5,
      initials: "MS",
      text: "The telemedicine experience was remarkably smooth. Dr. Jenkins went through my test reports thoroughly, explained everything with patience, and the digital prescription reached my pharmacy immediately.",
    },
    {
      name: "Elena Rostova",
      role: "Parent • Pediatric Consultation",
      rating: 5,
      initials: "ER",
      text: "Finding a reliable pediatrician on short notice used to be stressful. Here I booked a same-day slot within 2 minutes. The doctor was attentive, friendly, and truly put my child at ease.",
    },
    {
      name: "Arthur Pendelton",
      role: "Patient • Orthopedic Rehab",
      rating: 5,
      initials: "AP",
      text: "Outstanding service from start to finish. Zero wait times in clinic, professional follow-up schedules, and full access to past medical records in one clean dashboard.",
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-2.5 text-primary border-primary/30 bg-primary/5">
            Patient Stories
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Trusted by Thousands of Healthy Smiles
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            See how our platform and certified medical professionals make healthcare more accessible and compassionate.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card
              key={idx}
              className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition hover:shadow-md hover:border-primary/40"
            >
              <CardContent className="p-0 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="size-6 text-muted-foreground/30" />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground italic">
                  &ldquo;{t.text}&rdquo;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border/60">
                  <Avatar className="size-10 rounded-full border border-border">
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground">{t.name}</span>
                      <CheckCircle className="size-3.5 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground block">{t.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
