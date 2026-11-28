import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Terms & Conditions | GuruLagbe",
  description: "The rules for using the GuruLagbe platform.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="28 November 2026"
      intro="By creating an account or using GuruLagbe you agree to these terms. They are written for students, tutors and visitors using this website."
      sections={[
        {
          heading: "1. Who can use the service",
          paragraphs: [
            "You must provide accurate account information and be old enough to enter an agreement in your jurisdiction. Tutors are responsible for the accuracy of their profile, qualifications and tuition details. Students are responsible for checking a tutor before making any offline arrangement.",
          ],
        },
        {
          heading: "2. Accounts and roles",
          bullets: [
            "One person should maintain one account. Sharing login credentials is not allowed.",
            "You must verify your email address before you can sign in or use a dashboard. A new verification link can be requested at any time from the verification page.",
            "Roles are assigned at sign-up and can only be changed by an administrator. Google sign-in never grants an admin role.",
            "We may suspend accounts used for spam, harassment, fraud, fake qualifications or attempts to bypass platform rules.",
          ],
        },
        {
          heading: "3. Tuitions and applications",
          paragraphs: [
            "Tutors may post tuitions subject to approval and the limits of their plan. Students may apply to tuitions and track application status. GuruLagbe facilitates contact between the parties but does not employ tutors, guarantee learning outcomes, or control offline meetings and payments between them.",
          ],
        },
        {
          heading: "4. Pro plans and payments",
          bullets: [
            "Pro Student costs 99 BDT and Pro Tutor costs 199 BDT. This is a one-time activation, not an auto-renewing subscription.",
            "Payments are processed by Stripe (currently in test mode) or SSLCommerz (sandbox by default). Your plan becomes active only after the payment is verified by the server.",
            "bKash is a manual Send Money method, not an automated gateway. You send money to the account shown on the payment page, then submit a confirmation. Pro access is granted only after an administrator approves the request.",
            "Submitting a bKash confirmation does not guarantee approval. Duplicate, fake or unconfirmed requests may be rejected.",
            "Prices and plan features may change, but a verified purchase keeps the Pro access already granted.",
          ],
        },
        {
          heading: "5. Acceptable use",
          bullets: [
            "Do not upload illegal, misleading or harmful content, or attempt to probe, scrape or attack the service.",
            "Do not publish another person's private information without permission.",
            "Do not use automated scripts to create accounts or submit applications.",
          ],
        },
        {
          heading: "6. Content ownership",
          paragraphs: [
            "You keep ownership of the text and images you submit. By posting them you give GuruLagbe permission to display them on the platform so the service can function. You are responsible for having the right to share anything you upload.",
          ],
        },
        {
          heading: "7. Availability and liability",
          paragraphs: [
            "We work to keep the service available, but maintenance, provider outages or network problems may interrupt it. To the extent permitted by law, GuruLagbe is not liable for indirect losses, offline arrangements between users, or decisions made based on a listing.",
          ],
        },
        {
          heading: "8. Termination and contact",
          paragraphs: [
            "You may stop using the service at any time and may request account deletion. We may suspend or remove accounts that break these terms. Questions can be sent to support@mentorlagbe.com or 01747740061, Jamalpur, Bangladesh.",
          ],
        },
      ]}
    />
  );
}
