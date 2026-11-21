"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Copy,
  GraduationCap,
  Receipt,
  Search,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { TransactionsResponse } from "@/types";
import OverviewStat from "@/components/dashboard/OverviewStat";
import RoleBadge from "@/components/dashboard/RoleBadge";
import { Skeleton } from "@/components/ui/skeleton";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number, currency: string) {
  let code = "BDT";
  if (currency) {
    code = currency.toUpperCase();
  }
  return amount.toLocaleString("en-US") + " " + code;
}

export default function AdminTransactions() {
  const [data, setData] = useState<TransactionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadTransactions() {
      try {
        const result = await apiFetch<TransactionsResponse>(
          "/api/admin/transactions"
        );
        setData(result);
      } catch {
        toast.error("Could not load transactions");
      }
      setLoading(false);
    }

    loadTransactions();
  }, []);

  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Transaction ID copied");
    } catch {
      toast.error("Could not copy the ID");
    }
  }

  if (loading) {
    const items = [1, 2, 3, 4];

    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <Skeleton key={item} className="h-40 rounded-3xl" />
          ))}
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
        Could not load transactions. Please refresh the page.
      </p>
    );
  }

  // Search: naam, email ba transaction id
  const searchText = search.trim().toLowerCase();

  const shown = data.payments.filter((item) => {
    if (searchText === "") {
      return true;
    }

    const name = item.userName.toLowerCase();
    const email = item.userEmail.toLowerCase();
    const transaction = item.transactionId.toLowerCase();

    return (
      name.includes(searchText) ||
      email.includes(searchText) ||
      transaction.includes(searchText)
    );
  });

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <OverviewStat
          label="Total Revenue"
          value={data.totalRevenue.toLocaleString("en-US") + " BDT"}
          sub="From all Pro subscriptions"
          icon={Wallet}
          gradient="from-yellow-400 to-amber-500"
          index={0}
        />

        <OverviewStat
          label="Transactions"
          value={data.totalTransactions}
          sub="Successful payments"
          icon={Receipt}
          gradient="from-teal-500 to-emerald-400"
          index={1}
        />

        <OverviewStat
          label="Pro Students"
          value={data.studentCount}
          sub="Student plan purchases"
          icon={GraduationCap}
          gradient="from-sky-500 to-indigo-400"
          index={2}
        />

        <OverviewStat
          label="Pro Tutors"
          value={data.tutorCount}
          sub="Tutor plan purchases"
          icon={BookOpen}
          gradient="from-amber-400 to-orange-400"
          index={3}
        />
      </div>

      {data.payments.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border bg-card px-6 py-16 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-primary">
            <Receipt className="h-8 w-8" />
          </span>
          <h3 className="mt-5 text-xl font-semibold">No transactions yet</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            When students or tutors buy a Pro plan with Stripe, every payment
            will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative w-full lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email or ID"
              className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>

          {shown.length === 0 ? (
            <p className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
              No transactions match your search.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px] text-sm">
                    <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-5 py-3 font-semibold">User</th>
                        <th className="px-5 py-3 font-semibold">Role</th>
                        <th className="px-5 py-3 font-semibold">Plan</th>
                        <th className="px-5 py-3 font-semibold">Amount</th>
                        <th className="px-5 py-3 font-semibold">
                          Transaction ID
                        </th>
                        <th className="px-5 py-3 font-semibold">Date</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y">
                      {shown.map((item) => (
                        <tr
                          key={item._id}
                          className="transition hover:bg-muted/40"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium">{item.userName}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.userEmail}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <RoleBadge role={item.userRole} />
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-medium">
                            {item.planName}
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 font-bold text-primary">
                            {formatAmount(item.amount, item.currency)}
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() => copyId(item.transactionId)}
                              title="Copy transaction ID"
                              className="flex max-w-[190px] items-center gap-2 rounded-lg bg-muted px-2.5 py-1.5 font-mono text-xs transition hover:bg-secondary"
                            >
                              <span className="truncate">
                                {item.transactionId}
                              </span>
                              <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            </button>
                          </td>

                          <td className="whitespace-nowrap px-5 py-4 text-muted-foreground">
                            {formatDate(item.paidAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="space-y-4 md:hidden">
                {shown.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border bg-card p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold">
                          {item.userName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.userEmail}
                        </p>
                      </div>
                      <RoleBadge role={item.userRole} />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm font-medium">{item.planName}</p>
                      <p className="font-heading text-lg font-bold text-primary">
                        {formatAmount(item.amount, item.currency)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyId(item.transactionId)}
                      className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg bg-muted px-3 py-2 font-mono text-xs"
                    >
                      <span className="truncate">{item.transactionId}</span>
                      <Copy className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </button>

                    <p className="mt-3 text-xs text-muted-foreground">
                      Paid on {formatDate(item.paidAt)}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}