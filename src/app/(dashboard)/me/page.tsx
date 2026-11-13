"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, router, user]);

  if (loading || !user) {
    return null;
  }

  return (
    <section className="max-w-xl rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="font-semibold text-slate-500">Name</dt>
          <dd className="text-slate-900">{user.name}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Email</dt>
          <dd className="text-slate-900">{user.email}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-500">Role</dt>
          <dd className="text-slate-900">{user.role}</dd>
        </div>
      </dl>
    </section>
  );
}
