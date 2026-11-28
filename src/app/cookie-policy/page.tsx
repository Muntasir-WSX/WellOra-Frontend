import { Cookie } from "lucide-react";
import LegalPage from "@/components/shared/legal/legal-page";

export const metadata = {
  title: "Cookie Policy | WellOra",
  description: "How WellOra uses cookies and similar browser storage.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      description="Last updated: November 28, 2026"
      icon={Cookie}
      image="https://res.cloudinary.com/dnk0bvpym/image/upload/v1795438357/Orthopaedics_rtxils.jpg"
      sections={[
        {
          title: "1. What Are Cookies?",
          content: (
            <p>
              Cookies and similar browser storage tokens are small files placed
              on your device when you visit <strong>WellOra</strong>. They help
              us keep you signed in, remember preferences, and provide a smooth
              booking experience.
            </p>
          ),
        },
        {
          title: "2. Types of Cookies We Use",
          items: [
            <span key="essential">
              <strong>Essential authentication:</strong> Required for secure
              login, sessions, and dashboard access.
            </span>,
            <span key="security">
              <strong>Security and payment integrity:</strong> Help protect
              checkout and payment redirects from unauthorized requests.
            </span>,
            <span key="preference">
              <strong>Preference and performance:</strong> Remember UI
              preferences and improve page performance.
            </span>,
          ],
        },
        {
          title: "3. Managing Cookies",
          content: (
            <p>
              You can clear or block cookies through your browser settings at
              any time. Disabling essential cookies may sign you out and stop
              you from booking appointments or accessing your dashboard.
            </p>
          ),
        },
      ]}
    />
  );
}
