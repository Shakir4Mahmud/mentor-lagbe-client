"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, X } from "lucide-react";
import Logo from "@/components/shared/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  accountNav,
  dashboardNav,
  isNavItemActive,
  roleLabels,
} from "@/lib/dashboard-nav";
import type { DashboardUser } from "@/components/dashboard/types";

type DashboardSidebarProps = {
  user: DashboardUser;
  mobileOpen: boolean;
  collapsed: boolean;
  onClose: () => void;
};

export default function DashboardSidebar({
  user,
  mobileOpen,
  collapsed,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const groups = [...dashboardNav[user.role], accountNav];

  const isPro = user.plan === "pro";
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <>
      {/* Mobile backdrop */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={mobileOpen ? 0 : -1}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r bg-card transition-all duration-300 ease-out lg:translate-x-0",
          collapsed ? "lg:w-20" : "lg:w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo + mobile close */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center justify-between border-b px-5",
            collapsed && "lg:justify-center lg:px-2"
          )}
        >
          <div className={cn(collapsed && "lg:[&_a>span:nth-child(2)]:hidden")}>
            <Logo />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User profile summary */}
        <div className="shrink-0 border-b px-3 py-4">
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5",
              collapsed &&
                "lg:justify-center lg:bg-transparent lg:px-0 lg:py-1"
            )}
          >
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className={cn("min-w-0 flex-1", collapsed && "lg:hidden")}>
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-1.5 flex flex-wrap items-center gap-1">
                <Badge variant="secondary">{roleLabels[user.role]}</Badge>

                <Badge
                  variant={isPro ? "default" : "outline"}
                  className={isPro ? "bg-accent text-accent-foreground" : ""}
                >
                  {isPro ? "Pro" : "Free"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav
          className={cn(
            "flex-1 space-y-6 overflow-y-auto overflow-x-hidden px-3 py-5",
            collapsed && "lg:px-2"
          )}
        >
          {groups.map((group) => (
            <div key={group.title}>
              <p
                className={cn(
                  "px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                  collapsed && "lg:hidden"
                )}
              >
                {group.title}
              </p>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isNavItemActive(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      title={item.label}
                      aria-label={item.label}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        collapsed && "lg:justify-center lg:px-0",
                        active
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />

                      <span
                        className={cn(
                          "truncate",
                          collapsed && "lg:hidden"
                        )}
                      >
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t p-3">
          <Link
            href="/"
            onClick={onClose}
            title="Back to website"
            aria-label="Back to website"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              collapsed && "lg:justify-center lg:px-0"
            )}
          >
            <Home className="h-4 w-4 shrink-0" />

            <span className={cn("truncate", collapsed && "lg:hidden")}>
              Back to website
            </span>
          </Link>
        </div>
      </aside>
    </>
  );
}