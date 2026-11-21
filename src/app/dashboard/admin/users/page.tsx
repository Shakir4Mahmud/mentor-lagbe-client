import AdminUsers from "@/components/dashboard/AdminUsers";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold">Users</h1>
      <p className="mt-2 text-muted-foreground">
        All registered members. Search, filter and manage their roles.
      </p>

      <div className="mt-8">
        <AdminUsers />
      </div>
    </div>
  );
}