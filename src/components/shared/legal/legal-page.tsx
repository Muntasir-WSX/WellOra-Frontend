import type { LucideIcon } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Children, isValidElement } from "react";

import Footer from "@/components/shared/footer/footer";
import Navbar from "@/components/shared/nav/navbar";

type LegalSection = {
  title: string;
  content?: React.ReactNode;
  items?: React.ReactNode[];
};

type LegalPageProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  description,
  icon: Icon,
  image,
  sections,
}: LegalPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="relative isolate min-h-72 overflow-hidden bg-slate-950">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{ backgroundImage: `url("${image}")` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-950/20" />
          <div className="relative mx-auto flex min-h-72 max-w-4xl flex-col justify-end px-6 pb-10 text-white">
            <Link
              href="/"
              className="mb-4 inline-flex w-fit items-center gap-1.5 text-xs font-medium text-emerald-400 transition hover:text-emerald-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
            </Link>
            <div className="flex items-center gap-2 text-emerald-400">
              <Icon className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                WellOra Legal &amp; Compliance
              </span>
            </div>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
          </div>
        </section>
        <div className="mx-auto max-w-4xl px-6 py-12">
          <article className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            {sections.map((section) => (
              <section key={section.title}>
                <h2 className="text-xl font-semibold text-slate-900">
                  {section.title}
                </h2>
                {section.content && (
                  <div className="mt-2 text-sm leading-relaxed text-slate-600">
                    {section.content}
                  </div>
                )}
                {section.items && (
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
                    {Children.toArray(section.items).map((item) => {
                      const itemKey =
                        isValidElement(item) && item.key != null
                          ? item.key
                          : String(item);

                      return <li key={itemKey}>{item}</li>;
                    })}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
