"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, FileText, CheckCircle2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import {
  createPrescriptionApi,
  type IMedicine,
} from "@/lib/prescription.api";

interface IDoctorAppointmentItem {
  id: string;
  status: string;
  prescriptionUrl?: string | null;
  patient: {
    id: string;
    name: string;
    email: string;
  };
  schedule: {
    startDateTime: string;
  };
}

export default function DoctorPrescriptionsPage() {
  const [appointments, setAppointments] = useState<IDoctorAppointmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<IDoctorAppointmentItem | null>(null);

  const [findings, setFindings] = useState("");
  const [medicines, setMedicines] = useState<IMedicine[]>([
    { name: "", dosage: "", duration: "", instructions: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);
      const res = await apiRequest<{ data: IDoctorAppointmentItem[] }>(
        "/appointment/doctor-appointments?status=COMPLETED&limit=50",
        { method: "GET" },
      );
      setAppointments(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to load completed appointments",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", duration: "", instructions: "" },
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (
    index: number,
    field: keyof IMedicine,
    value: string,
  ) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    if (findings.trim().length < 5) {
      toast.error("Findings must be at least 5 characters long");
      return;
    }

    const cleanedMedicines = medicines.map((m) => ({
      name: m.name.trim(),
      dosage: m.dosage.trim(),
      duration: m.duration.trim(),
      ...(m.instructions?.trim() ? { instructions: m.instructions.trim() } : {}),
    }));

    const hasInvalidMedicine = cleanedMedicines.some(
      (m) => !m.name || !m.dosage || !m.duration,
    );
    if (hasInvalidMedicine) {
      toast.error("Please fill in Name, Dosage, and Duration for all medicines");
      return;
    }

    try {
      setSubmitting(true);
      await createPrescriptionApi({
        appointmentId: selectedAppointment.id,
        findings: findings.trim(),
        medicines: cleanedMedicines,
      });

      toast.success("Prescription created and emailed to patient!");
      setSelectedAppointment(null);
      setFindings("");
      setMedicines([{ name: "", dosage: "", duration: "", instructions: "" }]);
      fetchCompletedAppointments();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create prescription",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
        <p className="text-sm text-muted-foreground">
          Write and send PDF prescriptions for completed consultations.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-sm text-muted-foreground">
          No completed appointments found yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="flex flex-col justify-between rounded-xl border bg-card p-5 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{apt.patient.name}</h3>
                  {apt.prescriptionUrl ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Prescribed
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600">
                      Pending Prescription
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {apt.patient.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Date: {new Date(apt.schedule.startDateTime).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t flex justify-end">
                {apt.prescriptionUrl ? (
                  <a
                    href={apt.prescriptionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-accent"
                  >
                    View PDF <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedAppointment(apt)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
                  >
                    <FileText className="h-3.5 w-3.5" /> Write Prescription
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Write Prescription Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-background p-6 shadow-xl border">
            <div className="mb-4 flex items-center justify-between border-b pb-3">
              <div>
                <h2 className="text-lg font-semibold">Write Prescription</h2>
                <p className="text-xs text-muted-foreground">
                  Patient: {selectedAppointment.patient.name}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Diagnosis / Findings *
                </label>
                <textarea
                  rows={3}
                  required
                  value={findings}
                  onChange={(e) => setFindings(e.target.value)}
                  placeholder="Enter clinical findings and diagnosis (min 5 characters)..."
                  className="w-full rounded-lg border bg-background p-2.5 text-sm"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Medicines *</label>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Medicine
                  </button>
                </div>

                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="relative grid gap-2.5 rounded-lg border p-3 sm:grid-cols-2"
                  >
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="absolute right-2.5 top-2.5 text-destructive hover:opacity-80"
                        title="Remove medicine"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}

                    <div className="sm:col-span-2 pr-6">
                      <input
                        type="text"
                        required
                        placeholder="Medicine Name (e.g., Napa Extra 500mg)"
                        value={med.name}
                        onChange={(e) =>
                          handleMedicineChange(idx, "name", e.target.value)
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>

                    <input
                      type="text"
                      required
                      placeholder="Dosage (e.g., 1+0+1)"
                      value={med.dosage}
                      onChange={(e) =>
                        handleMedicineChange(idx, "dosage", e.target.value)
                      }
                      className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                    />

                    <input
                      type="text"
                      required
                      placeholder="Duration (e.g., 7 days)"
                      value={med.duration}
                      onChange={(e) =>
                        handleMedicineChange(idx, "duration", e.target.value)
                      }
                      className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                    />

                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        placeholder="Instructions (optional, e.g., After meal)"
                        value={med.instructions || ""}
                        onChange={(e) =>
                          handleMedicineChange(
                            idx,
                            "instructions",
                            e.target.value,
                          )
                        }
                        className="w-full rounded-md border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedAppointment(null)}
                  className="rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                >
                  {submitting
                    ? "Generating & Emailing..."
                    : "Create Prescription"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}