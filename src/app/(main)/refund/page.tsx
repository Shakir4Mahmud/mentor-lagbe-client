import LegalPage from "@/components/shared/LegalPage";

export const metadata = {
  title: "Refund & Cancellation Policy | MentorLagbe",
  description: "How to request a refund for a MentorLagbe Pro plan.",
};

export default function RefundPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      updated="27 November 2026"
      intro="Pro access is a one-time payment. This policy explains when a payment can be cancelled or refunded and how to ask for one."
      sections={[
        {
          heading: "1. Before you pay",
          bullets: [
            "You can leave the payment page at any time before confirming. No charge is made when you cancel.",
            "Check that you are logged in with the account that should receive Pro, and that the price matches your role: 99 BDT for students, 199 BDT for tutors.",
          ],
        },
        {
          heading: "2. Current payment modes",
          paragraphs: [
            "Stripe is currently used in test mode, so test card payments are simulated and do not move real money. SSLCommerz uses sandbox credentials until live store credentials are configured. If you see a real charge on your statement, contact us immediately with the transaction ID.",
          ],
        },
        {
          heading: "3. When we refund",
          bullets: [
            "Duplicate charge for the same order or a technical error that charged you without granting Pro.",
            "You request a refund within 7 days of purchase and have not used the Pro benefits of the plan.",
            "A payment was taken but the plan was not activated after you contacted support.",
          ],
        },
        {
          heading: "4. When a refund is usually not available",
          bullets: [
            "You changed your mind after actively using Pro features such as unlimited tutor posts or priority booking.",
            "The request is made more than 7 days after the transaction date.",
            "The payment relates to an offline arrangement between a student and a tutor — that money is handled outside MentorLagbe.",
          ],
        },
        {
          heading: "5. How to request",
          paragraphs: [
            "Email support@mentorlagbe.com or call 01747740061 with your account email, transaction ID and a short reason. We review requests within 3 working days. Approved refunds are sent back through the original payment method and may take 7–14 working days to appear, depending on your bank or provider.",
          ],
        },
        {
          heading: "6. Cancelling Pro",
          paragraphs: [
            "Pro is not recurring, so there is nothing to cancel. If you no longer want the badge or extra features, contact us and we can remove the Pro flag from your account. Removing Pro does not automatically create a refund.",
          ],
        },
      ]}
    />
  );
}
