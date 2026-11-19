"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Compass,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { findNavLocation, roleLabels } from "@/lib/dashboard-nav";
import type { DashboardUser } from "@/components/dashboard/types";

type DashboardTopbarProps = {
  user: DashboardUser;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onMenuClick: () => void;
};

export default function DashboardTopbar({
  user,
  collapsed,
  onToggleCollapse,
  onMenuClick,
}: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const location = findNavLocation(pathname, user.role);
  const pageTitle = location ? location.item.label : "Dashboard";
  const groupTitle = location ? location.group.title : "Dashboard";

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const dashboardHref = "/dashboard/" + user.role;
  const isPro = user.plan === "pro";

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    router.push("/");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Desktop collapse toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden lg:inline-flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>

        {/* Page title */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3" />
            <span className="truncate">{groupTitle}</span>
          </div>

          <p className="truncate font-heading text-lg font-semibold leading-tight">
            {pageTitle}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden rounded-full sm:inline-flex"
          >
            <Link href="/tuitions">
              <Compass className="h-4 w-4" />
              Browse
            </Link>
          </Button>

          <ThemeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label="Open user menu"
                className="flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-2 outline-none transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring/50 sm:pr-3"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.image ?? ""} alt={user.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {initial}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden text-left sm:block">
                  <span className="block max-w-[130px] truncate text-sm font-medium leading-tight">
                    {user.name}
                  </span>
                  <span className="block text-[11px] leading-tight text-muted-foreground">
                    {roleLabels[user.role]}
                  </span>
                </span>

                <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel>
                <p className="truncate text-sm font-semibold text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </p>

                <div className="mt-2 flex items-center gap-1.5">
                  <Badge variant="secondary">{roleLabels[user.role]}</Badge>

                  <Badge
                    variant={isPro ? "default" : "outline"}
                    className={isPro ? "bg-accent text-accent-foreground" : ""}
                  >
                    {isPro ? "Pro" : "Free"}
                  </Badge>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link href={dashboardHref}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserCog className="mr-2 h-4 w-4" />
                  Update Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View website
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}