import { Video, Calendar, FileText, HeartHandshake, ShieldCheck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function LandingServices() {
  const services = [
    {
      icon: Video,
      title: "Telehealth & Video Visits",
      description: "Secure, high-definition audio/video consultations with certified medical doctors right from your home or office.",
    },
    {
      icon: Calendar,
      title: "In-Clinic Scheduling",
      description: "Browse verified doctor schedules, select convenient time slots, and experience prioritized reception with zero waiting room hassle.",
    },
    {
      icon: FileText,
      title: "Digital Prescriptions",
      description: "Instantly receive digitally signed, QR-verifiable prescriptions accessible on any device for fast pharmacy fulfillment.",
    },
    {
      icon: HeartHandshake,
      title: "Family Care Plans",
      description: "Holistic healthcare coverage tailored for young children, working adults, and senior family members.",
    },
    {
      icon: ShieldCheck,
      title: "Encrypted Health Records",
      description: "Keep all your medical history, diagnostic reports, and past prescriptions securely stored with role-based privacy.",
    },
    {
      icon: Clock,
      title: "24/7 Medical Assistance",
      description: "Continuous helpline and emergency triage support to guide you through medical emergencies anytime, day or night.",
    },
  ];

  return (
    <section id="services" className="scroll-mt-16 py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <Badge variant="outline" className="mb-2.5 text-primary border-primary/30 bg-primary/5">
            Platform Capabilities
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Modern Healthcare Built Around Your Life
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            A comprehensive digital healthcare ecosystem designed for seamless patient care, from initial diagnosis to long-term recovery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComp = service.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl border border-border/70 bg-card p-7 transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <IconComp className="size-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
