import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Privacy Policy | MentorLagbe",
  description:
    "How MentorLagbe collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="28 November 2026"
      intro="MentorLagbe connects students with tutors. This policy explains what information we collect, why we need it, who can see it and how you can ask us to remove it."
      sections={[
        {
          heading: "1. Information we collect",
          bullets: [
            "Account details: name, email address, password hash, role (student, tutor or admin), profile bio and phone number if you add one.",
            "Activity: tuitions you post, applications you send, saved tuitions, reviews and messages related to a tuition.",
            "Payment details: plan, amount, currency, transaction ID and payment status. Full card numbers are handled by Stripe or SSLCommerz and never stored on our servers.",
            "bKash requests: your name, email, chosen plan, amount and approval status. We do not collect your bKash PIN or app credentials.",
            "Technical data: IP address, browser type and request logs with a request ID, used to debug and secure the service.",
          ],
        },
        {
          heading: "2. How we use it",
          bullets: [
            "To create and secure your account, and to show the correct student, tutor or admin dashboard.",
            "To match students with tutors and to let you manage applications and listings.",
            "To activate a Pro plan after a successful payment or an approved bKash request, and to show receipts in your account.",
            "To send service emails such as password resets and email verification links.",
          ],
        },
        {
          heading: "3. Who we share with",
          paragraphs: [
            "We do not sell your personal information. We use infrastructure providers to run the service: MongoDB Atlas (database), Vercel (website), Render (API), Resend (transactional email), Stripe and SSLCommerz (payments), and ImgBB (profile images). Each provider only receives the data needed for its function.",
            "Other users only see the profile and tuition information you choose to publish. Your email and payment records are not shown publicly.",
          ],
        },
        {
          heading: "4. Cookies and sessions",
          paragraphs: [
            "We use cookies to keep you signed in and to remember your role and session. Session cookies are issued by Better Auth and are required for private pages. You can delete them in your browser, but you will need to sign in again.",
          ],
        },
        {
          heading: "5. Retention and your choices",
          bullets: [
            "Account and tuition data stay until you ask us to delete them or we remove inactive test data.",
            "Payment records are retained for accounting and dispute handling.",
            "You may request access, correction or deletion by emailing support@mentorlagbe.com or calling 01747740061.",
          ],
        },
        {
          heading: "6. Security",
          paragraphs: [
            "Passwords are hashed by Better Auth, private API calls require a signed token, roles and prices are always read from the server, and every request is logged with a request ID. No system is perfectly secure, so please use a unique password and tell us immediately if you suspect unauthorised access.",
          ],
        },
        {
          heading: "7. Changes to this policy",
          paragraphs: [
            "We may update this page as the service grows. The date at the top always shows the latest version. Continued use after an update means you accept the revised policy.",
          ],
        },
      ]}
    />
  );
}
