import AdminBkashApprovals from "@/components/dashboard/AdminBkashApprovals";

export default function AdminBkashPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">bKash Payments</h1>
      <p className="mt-2 text-muted-foreground">
        Review manual bKash Send Money requests and approve or reject them.
      </p>

      <div className="mt-8">
        <AdminBkashApprovals />
      </div>
    </div>
  );
}
