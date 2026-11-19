"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { cn } from "@/lib/utils";
import type { DashboardUser } from "@/components/dashboard/types";

type DashboardShellProps = {
  user: DashboardUser;
  children: React.ReactNode;
};

export default function DashboardShell({
  user,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();

  // Desktop sidebar collapse
  const [collapsed, setCollapsed] = useState(false);

  // Mobile drawer: pathname change hole nijei bondho hobe
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const mobileOpen = openedAt === pathname;

  function toggleCollapse() {
    setCollapsed((value) => !value);
  }

  function openMenu() {
    setOpenedAt(pathname);
  }

  function closeMenu() {
    setOpenedAt(null);
  }

  // Drawer khola thakle background scroll bondho
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  // Escape chaple drawer bondho
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeMenu();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

  return (
    <div className="min-h-screen bg-muted/40">
      <DashboardSidebar
        user={user}
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onClose={closeMenu}
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-out",
          collapsed ? "lg:pl-20" : "lg:pl-72"
        )}
      >
        <DashboardTopbar
          user={user}
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
          onMenuClick={openMenu}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}