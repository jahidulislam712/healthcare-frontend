"use client";

import type { ElementType } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import {
  Mail,
  Phone,
  MapPin,
  BriefcaseMedical,
  GraduationCap,
  Stethoscope,
  CalendarDays,
  Star,
  UserRound,
  Building2,
  ClipboardList,
  ShieldCheck,
  X,
} from "lucide-react";
import { IDoctor } from "@/app/types/doctor.types";
import { formatDate } from "date-fns";

// Reusable info item
interface InfoItemProps {
  icon: ElementType;
  label: string;
  value: string | number;
}

const InfoItem = ({ icon: Icon, label, value }: InfoItemProps) => (
  <div className="flex min-w-0 items-start gap-3">
    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4.25" />
    </div>

    <div className="min-w-0 space-y-1">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="wrap-break-words text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  </div>
);

// Section heading
const SectionHeading = ({
  icon: Icon,
  title,
}: {
  icon: ElementType;
  title: string;
}) => (
  <div className="mb-5 flex items-center gap-2.5">
    <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" />
    </div>
    <h3 className="text-sm font-bold tracking-tight text-foreground">
      {title}
    </h3>
  </div>
);

// Main component
interface DoctorProfileModalProps {
  doctor: IDoctor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ViewDoctorModal({
  doctor,
  open,
  onOpenChange,
}: DoctorProfileModalProps) {
  if (!doctor) return null;

  const updatedDate = new Date(doctor.updatedAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-[calc(100%-24px)]
          sm:max-w-4xl
          max-h-[92dvh]
          overflow-hidden
          gap-0
          border-border
          bg-background
          p-0
          sm:rounded-2xl
        "
      >
        {/* Profile Header */}
        <div className="relative overflow-hidden border-b bg-linear-to-br from-primary/10 via-background to-background px-5 py-6 sm:px-8 sm:py-7">
          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />

          <DialogHeader className="relative mb-6">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">
                  Doctor Profile
                </DialogTitle>

                <DialogDescription className="mt-1 text-xs sm:text-sm">
                  Complete professional and personal information
                </DialogDescription>
              </div>

              <Badge
                variant="outline"
                className="gap-1.5 border-primary/30 bg-primary/10 px-3 py-1 text-primary"
              >
                <ShieldCheck className="size-3.5" />
                {doctor.user.status}
              </Badge>
            </div>
          </DialogHeader>

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
            {/* Avatar */}
            <div className="relative mx-auto sm:mx-0">
              <Avatar className="size-24 border-[3px] border-background shadow-lg sm:size-28">
                <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
                <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
                  {doctor.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <span className="absolute bottom-1 right-1 size-4 rounded-full border-[3px] border-background bg-emerald-500" />
            </div>

            {/* Doctor Details */}
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
                {doctor.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {doctor.designation}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <Badge variant="secondary">{doctor.qualification}</Badge>

                <Badge variant="secondary">{doctor.user.role}</Badge>

                <Badge className="gap-1 border-0 bg-amber-500/10 text-amber-600 hover:bg-amber-500/10 dark:text-amber-400">
                  <Star className="size-3.5 fill-current" />
                  {doctor.averageRating.toFixed(1)} Rating
                </Badge>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground sm:justify-start">
                <span className="flex items-center gap-1.5">
                  <Mail className="size-3.5 text-primary" />
                  {doctor.email}
                </span>

                {doctor.contactNumber && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-primary" />
                    {doctor.contactNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Appointment Fee */}
            <div className="rounded-xl border bg-card px-5 py-3 text-center shadow-sm sm:min-w-36">
              <p className="text-xs font-medium text-muted-foreground">
                Appointment Fee
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-primary">
                ৳{doctor.appointmentFee}
              </p>

              <p className="text-[11px] text-muted-foreground">
                Per consultation
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="max-h-[calc(92dvh-245px)] overflow-y-auto p-5 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Professional Information */}
            <section>
              <SectionHeading
                icon={BriefcaseMedical}
                title="Professional Information"
              />

              <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                <InfoItem
                  icon={GraduationCap}
                  label="Qualification"
                  value={doctor.qualification}
                />

                <InfoItem
                  icon={ClipboardList}
                  label="Registration Number"
                  value={doctor.registrationNumber}
                />

                <InfoItem
                  icon={Building2}
                  label="Current Workplace"
                  value={doctor.currentWorkingPlace}
                />

                <InfoItem
                  icon={BriefcaseMedical}
                  label="Experience"
                  value={`${doctor.experience} Years`}
                />

                <InfoItem
                  icon={UserRound}
                  label="Gender"
                  value={doctor.gender}
                />

                <InfoItem
                  icon={Star}
                  label="Average Rating"
                  value={`${doctor.averageRating}/5`}
                />
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <SectionHeading icon={UserRound} title="Contact Information" />

              <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2">
                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={doctor.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={doctor.contactNumber || "N/A"}
                />

                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={doctor.address || "Not provided"}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Joined Date"
                  value={formatDate(doctor.createdAt, "dd MMM yyyy")}
                />
              </div>
            </section>
          </div>

          <Separator className="my-8" />

          {/* Specialties */}
          <section>
            <SectionHeading icon={Stethoscope} title="Medical Specialties" />

            <div className="grid gap-3 sm:grid-cols-2">
              {doctor.specialties.map(({ specialty }) => (
                <div
                  key={specialty.id}
                  className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/40"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Stethoscope className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold">{specialty.title}</p>

                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {specialty.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          {/* Account Information */}
          <section>
            <SectionHeading icon={ShieldCheck} title="Account Information" />

            <div className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              <InfoItem
                icon={ShieldCheck}
                label="Email Verification"
                value={doctor.user.emailVerified ? "Verified" : "Not Verified"}
              />

              <InfoItem
                icon={ClipboardList}
                label="Password Change Required"
                value={doctor.user.needPasswordChange ? "Yes" : "No"}
              />

              <InfoItem
                icon={CalendarDays}
                label="Last Updated"
                value={updatedDate}
              />
            </div>
          </section>

          {/* Footer */}
          <div className="mt-8 flex items-center justify-between border-t pt-5">
            <p className="hidden text-xs text-muted-foreground sm:block">
              Doctor ID: {doctor.id}
            </p>

            <Button
              variant="outline"
              className="w-full gap-2 sm:ml-auto sm:w-auto"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-4" />
              Close Profile
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
