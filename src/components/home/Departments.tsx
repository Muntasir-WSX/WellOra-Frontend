"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CalendarCheck,
  HeartPulse,
  Loader2,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { getDepartmentsApi, type IDepartment } from "@/lib/department.api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const DEPARTMENT_FEATURED_IMAGE =
  "https://res.cloudinary.com/dnk0bvpym/image/upload/v1794323701/health2_ui7j8l.jpg";

export default function Departments() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getDepartmentsApi()
      .then((data) => {
        if (active) setDepartments(data);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to load departments",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const visibleDepartments = departments.slice(0, 5);

  const totalDoctors = departments.reduce(
    (sum, dept) => sum + (dept._count?.doctors ?? 0),
    0,
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="mb-12 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="max-w-2xl space-y-3">
          <Badge
            variant="secondary"
            className="gap-1.5 border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400"
          >
            <HeartPulse className="h-3.5 w-3.5 text-emerald-600" />
            Medical Departments
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Explore Specialized Clinical Departments
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Choose from our dedicated medical specialties and connect directly
            with BMDC-verified doctors for personalized care.
          </p>
        </div>

        <Button
          asChild
          variant="outline"
          className="w-fit gap-2 rounded-xl border-slate-300 font-semibold"
        >
          <Link href="/doctors">
            Browse All Specialists
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Main Grid: Left 5 Department Cards + Right Featured Image Card */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Dynamic Department Cards (Max 5) */}
        <div className="order-2 lg:order-1 lg:col-span-7">
          {loading ? (
            <div className="flex h-full min-h-[320px] items-center justify-center gap-2 rounded-3xl border border-dashed text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
              <span>Loading medical departments...</span>
            </div>
          ) : visibleDepartments.length === 0 ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed p-8 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40" />
              <h3 className="mt-3 text-base font-semibold">
                No departments available yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Clinical departments will appear here once added by the admin.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {visibleDepartments.map((dept, idx) => {
                const doctorCount = dept._count?.doctors ?? 0;

                return (
                  <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                  >
                    <Card className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border-slate-200/80 transition-all hover:border-emerald-500/40 hover:shadow-md">
                      <div>
                        {dept.imageUrl && (
                          <div className="relative h-32 w-full overflow-hidden bg-muted">
                            <img
                              src={dept.imageUrl}
                              alt={dept.name}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <CardHeader className="space-y-3 pb-3">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                              <Stethoscope className="h-5 w-5" />
                            </div>
                            <Badge
                              variant="secondary"
                              className="gap-1 text-[11px]"
                            >
                              <Users className="h-3 w-3 text-emerald-600" />
                              {doctorCount}{" "}
                              {doctorCount === 1 ? "Doctor" : "Doctors"}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-bold leading-snug text-slate-900 dark:text-slate-100">
                            {dept.name}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pb-4">
                          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                            {dept.description ||
                              `Specialized diagnosis, consultation, and treatment services under the ${dept.name} department.`}
                          </p>
                        </CardContent>
                      </div>

                      <CardFooter className="pt-0">
                        <Link
                          href={`/doctors?departmentId=${dept.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
                        >
                          <span>View Specialists</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Featured Card with Provided Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-1 lg:order-2 lg:col-span-5"
        >
          <Card className="group flex h-full flex-col overflow-hidden rounded-3xl border-slate-200/80 shadow-md transition-all hover:shadow-xl">
            <div className="relative h-64 w-full overflow-hidden bg-slate-900 sm:h-72">
              <img
                src={DEPARTMENT_FEATURED_IMAGE}
                alt="WellOra Clinical Departments"
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent" />

              <Badge className="absolute left-4 top-4 border-emerald-400/30 bg-emerald-600 text-white shadow-sm">
                <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                Multi-Specialty Care
              </Badge>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="text-xs font-medium uppercase tracking-wider text-emerald-300">
                  Clinical Excellence
                </p>
                <h3 className="mt-1 text-xl font-bold leading-snug">
                  Dedicated Units Led by Experienced Specialists
                </h3>
              </div>
            </div>

            <CardContent className="flex-1 pt-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every department at WellOra is staffed by verified specialists
                offering focused 20-minute consultations and digital follow-up
                care.
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl border bg-slate-50/80 p-3.5 text-xs dark:bg-slate-900/50">
                <div>
                  <span className="block font-bold text-slate-900 dark:text-slate-100">
                    {loading ? "..." : `${departments.length} Departments`}
                  </span>
                  <span className="text-muted-foreground">
                    Active clinical units
                  </span>
                </div>
                <div>
                  <span className="block font-bold text-emerald-600">
                    {loading ? "..." : `${totalDoctors}+ Doctors`}
                  </span>
                  <span className="text-muted-foreground">
                    Ready for consultation
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-wrap items-center gap-3 border-t pt-4">
              <Button
                asChild
                className="flex-1 gap-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <Link href="/doctors">
                  <CalendarCheck className="h-4 w-4" />
                  Find a Doctor
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 gap-1.5 rounded-xl"
              >
                <Link href="/available-today">
                  Available Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}