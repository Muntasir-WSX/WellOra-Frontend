import { ShieldCheck } from "lucide-react";
import LegalPage from "@/components/shared/legal/legal-page";

export const metadata = {
  title: "Privacy Policy | WellOra",
  description: "How WellOra collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="Last updated: November 28, 2026"
      icon={ShieldCheck}
      image="https://res.cloudinary.com/dnk0bvpym/image/upload/v1795438357/Internal_Medicine_vhcway.jpg"
      sections={[
        {
          title: "1. Information We Collect",
          content: (
            <p>
              When you register, book a consultation, or use our services, we
              may collect account and profile details, doctor credentials,
              appointment and consultation records, prescription information,
              and payment references. We do not store raw card details or mobile
              banking PINs.
            </p>
          ),
        },
        {
          title: "2. How We Use Your Information",
          items: [
            "To schedule, confirm, and manage online or in-person appointments.",
            "To deliver invoices, prescriptions, service notifications, and support.",
            "To verify healthcare professional credentials and protect platform safety.",
          ],
        },
        {
          title: "3. Data Security & Sharing",
          content: (
            <p>
              We use appropriate safeguards and trusted service providers for
              storage and payments. Your medical records are shared only as
              needed to provide the requested service. We do not sell or rent
              your personal information.
            </p>
          ),
        },
        {
          title: "4. Your Rights & Contact",
          content: (
            <p>
              You can update your profile or request access to your WellOra
              records through your dashboard. For privacy questions, contact{" "}
              <a
                className="ml-1 font-medium text-emerald-700 hover:underline"
                href="mailto:support@wellora.health"
              >
                support@wellora.health
              </a>
              .
            </p>
          ),
        },
      ]}
    />
  );
}
