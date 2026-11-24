"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CalendarCheck, Loader2, Stethoscope } from "lucide-react";
import { toast } from "sonner";

import { getPublicDoctorsApi, type IDoctorApplication } from "@/lib/doctor.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DoctorProfileContent() {
  const params = useParams<{ doctorId: string }>();
  const router = useRouter();
  const [doctor, setDoctor] = useState<IDoctorApplication | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getPublicDoctorsApi({ limit: 100 })
      .then((result) => {
        if (active) {
          setDoctor(
            result.doctors.find((item) => item.id === params.doctorId) || null,
          );
        }
      })
      .catch((error) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load doctor",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.doctorId]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center">
        <h1 className="text-xl font-bold">Doctor not found</h1>
        <Button className="mt-4" variant="outline" onClick={() => router.push("/doctors")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to doctors
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Button variant="outline" onClick={() => router.push("/doctors")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card>
        <CardHeader className="flex-row items-center gap-4 space-y-0">
          <Avatar className="h-20 w-20 border-2 border-emerald-500/30">
            <AvatarImage src={doctor.profilePhoto || ""} alt={doctor.name} />
            <AvatarFallback>{doctor.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Badge className="mb-2 bg-emerald-600">{doctor.specialization}</Badge>
            <CardTitle className="text-2xl">{doctor.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{doctor.qualifications}</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {doctor.bio || "Verified specialist providing patient consultations."}
          </p>
          <div className="flex items-center justify-between rounded-xl border p-4">
            <span className="flex items-center gap-2 text-sm">
              <Stethoscope className="h-4 w-4 text-emerald-600" />
              Experience: {doctor.experienceYears} years
            </span>
            <strong className="text-emerald-600">
              {doctor.consultationFee ? `৳${doctor.consultationFee}` : "Fee Not Set"}
            </strong>
          </div>
          <Button
            className="w-full bg-emerald-600 text-white"
            onClick={() => router.push(`/patient/doctors/${doctor.id}`)}
          >
            <CalendarCheck className="mr-2 h-4 w-4" />
            Book an Available Slot
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PublicDoctorProfilePage() {
  return (
    <Suspense fallback={<div className="flex h-72 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin" /></div>}>
      <DoctorProfileContent />
    </Suspense>
  );
}
