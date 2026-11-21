"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Loader2, Search, UserX } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { AdminUser } from "@/types";
import RoleBadge from "@/components/dashboard/RoleBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const roleOptions = ["student", "tutor", "admin"];

const filterTabs = [
  { key: "all", label: "All" },
  { key: "student", label: "Students" },
  { key: "tutor", label: "Tutors" },
  { key: "admin", label: "Admins" },
];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type RoleTarget = {
  user: AdminUser;
  newRole: string;
};

export default function AdminUsers() {
  const { data: session } = authClient.useSession();

  let myEmail = "";
  if (session && session.user) {
    myEmail = session.user.email;
  }

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [roleTarget, setRoleTarget] = useState<RoleTarget | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await apiFetch<{ users: AdminUser[] }>(
          "/api/admin/users"
        );
        setUsers(data.users);
      } catch {
        toast.error("Could not load users");
      }
      setLoading(false);
    }

    loadUsers();
  }, []);

  function countByRole(role: string) {
    if (role === "all") {
      return users.length;
    }
    return users.filter((item) => item.role === role).length;
  }

  // Filter ar search ek shathe
  const searchText = search.trim().toLowerCase();

  const shown = users.filter((item) => {
    if (filter !== "all" && item.role !== filter) {
      return false;
    }

    if (searchText === "") {
      return true;
    }

    const name = item.name.toLowerCase();
    const email = item.email.toLowerCase();

    return name.includes(searchText) || email.includes(searchText);
  });

  async function handleConfirm() {
    if (!roleTarget) {
      return;
    }

    setUpdating(true);

    try {
      await apiFetch("/api/admin/users/" + roleTarget.user._id + "/role", {
        method: "PATCH",
        body: JSON.stringify({ role: roleTarget.newRole }),
      });

      const updatedList = users.map((item) => {
        if (item._id === roleTarget.user._id) {
          return { ...item, role: roleTarget.newRole };
        }
        return item;
      });
      setUsers(updatedList);

      toast.success(
        roleTarget.user.name + " is now a " + roleTarget.newRole
      );
      setRoleTarget(null);
    } catch (error) {
      const err = error as Error;
      toast.error(err.message);
    }

    setUpdating(false);
  }

  // Role change dropdown, table ar mobile card dujaygay use hoy
  function renderRoleMenu(item: AdminUser) {
    const isMe = item.email === myEmail;

    if (isMe) {
      return (
        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
          This is you
        </span>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="rounded-full">
            Change role
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-44 rounded-xl p-1.5">
          {roleOptions.map((role) => {
            const isCurrent = item.role === role;
            const label = role.charAt(0).toUpperCase() + role.slice(1);

            return (
              <DropdownMenuItem
                key={role}
                disabled={isCurrent}
                onClick={() => setRoleTarget({ user: item, newRole: role })}
                className="cursor-pointer justify-between rounded-lg"
              >
                {label}
                {isCurrent && <Check className="h-4 w-4 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (loading) {
    const items = [1, 2, 3, 4, 5];

    return (
      <div className="space-y-3">
        {items.map((item) => (
          <Skeleton key={item} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Search and filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            let tabClass =
              "rounded-full border px-4 py-1.5 text-sm font-medium transition ";
            if (filter === tab.key) {
              tabClass =
                tabClass + "border-primary bg-primary text-primary-foreground";
            } else {
              tabClass = tabClass + "bg-card hover:bg-secondary";
            }

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={tabClass}
              >
                {tab.label} ({countByRole(tab.key)})
              </button>
            );
          })}
        </div>

        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mt-6 flex flex-col items-center rounded-2xl border bg-card px-6 py-14 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-primary">
            <UserX className="h-7 w-7" />
          </span>
          <p className="mt-4 font-medium">No users found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="mt-6 hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 font-semibold">User</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Role</th>
                    <th className="px-5 py-3 font-semibold">Plan</th>
                    <th className="px-5 py-3 font-semibold">Joined</th>
                    <th className="px-5 py-3 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {shown.map((item) => (
                    <tr key={item._id} className="transition hover:bg-muted/40">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarImage src={item.image} alt={item.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {item.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {item.phone !== "" ? item.phone : "Not added"}
                      </td>

                      <td className="px-5 py-4">
                        <RoleBadge role={item.role} />
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            "rounded-full px-3 py-1 text-xs font-semibold " +
                            (item.plan === "pro"
                              ? "bg-accent/20 text-accent-foreground dark:text-accent"
                              : "bg-muted text-muted-foreground")
                          }
                        >
                          {item.plan === "pro" ? "Pro" : "Free"}
                        </span>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          {renderRoleMenu(item)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="mt-6 space-y-4 md:hidden">
            {shown.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border bg-card p-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarImage src={item.image} alt={item.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {item.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{item.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {item.email}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <RoleBadge role={item.role} />
                  <span
                    className={
                      "rounded-full px-3 py-1 text-xs font-semibold " +
                      (item.plan === "pro"
                        ? "bg-accent/20 text-accent-foreground dark:text-accent"
                        : "bg-muted text-muted-foreground")
                    }
                  >
                    {item.plan === "pro" ? "Pro" : "Free"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Joined {formatDate(item.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex justify-end">
                  {renderRoleMenu(item)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirm modal */}
      <Dialog
        open={roleTarget !== null}
        onOpenChange={(open) => {
          if (!open && !updating) {
            setRoleTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          {roleTarget && (
            <>
              <DialogHeader>
                <DialogTitle>Change role?</DialogTitle>
                <DialogDescription>
                  {roleTarget.user.name} will change from{" "}
                  <span className="font-semibold">{roleTarget.user.role}</span>{" "}
                  to{" "}
                  <span className="font-semibold">{roleTarget.newRole}</span>.
                  {roleTarget.newRole === "admin" &&
                    " This gives full admin access to the platform."}
                </DialogDescription>
              </DialogHeader>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setRoleTarget(null)}
                  disabled={updating}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={updating}
                  className="rounded-full"
                >
                  {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {updating ? "Updating..." : "Yes, change role"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}