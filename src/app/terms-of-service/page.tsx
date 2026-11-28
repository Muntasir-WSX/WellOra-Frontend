import { FileText } from "lucide-react";
import LegalPage from "@/components/shared/legal/legal-page";

export const metadata = {
  title: "Terms of Service | WellOra",
  description: "The terms that govern use of the WellOra healthcare platform.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="Last updated: November 28, 2026"
      icon={FileText}
      image="https://res.cloudinary.com/dnk0bvpym/image/upload/v1795202140/wellora/blogs/ne903oaagfu08zkhrc6b.jpg"
      sections={[
        {
          title: "1. Acceptance of Terms",
          content: (
            <p>
              By accessing or using <strong>WellOra</strong>, you agree to
              comply with these Terms of Service. If you do not agree with any
              part of these terms, please do not use the platform.
            </p>
          ),
        },
        {
          title: "2. Medical Disclaimer",
          content: (
            <p>
              WellOra connects patients with healthcare professionals for
              scheduled consultations.{" "}
              <strong>WellOra is not an emergency medical service.</strong> For
              a life-threatening emergency, immediately contact local emergency
              services or visit the nearest hospital.
            </p>
          ),
        },
        {
          title: "3. Appointments, Payments & Refunds",
          items: [
            "Appointment slots are confirmed after successful payment through our integrated payment gateway.",
            "Confirmed appointments include the relevant serial number, joining time, meeting link where applicable, and invoice.",
            <span key="refund">
              Paid appointments cancelled at least{" "}
              <strong>1 hour before</strong> the scheduled start time may be
              eligible for a refund. Cancellations within 1 hour are
              non-refundable.
            </span>,
          ],
        },
        {
          title: "4. User Responsibilities",
          content: (
            <p>
              Patients must provide accurate contact and health information.
              Doctors must maintain valid credentials and provide professional
              care. Misuse of the platform may result in account suspension.
            </p>
          ),
        },
      ]}
    />
  );
}
