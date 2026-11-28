import AdminTransactions from "@/components/dashboard/AdminTransactions";

export default function AdminTransactionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Transactions</h1>
      <p className="mt-2 text-muted-foreground">
        Every Pro subscription payment made through Stripe or bKash.
      </p>

      <div className="mt-8">
        <AdminTransactions />
      </div>
    </div>
  );
}
