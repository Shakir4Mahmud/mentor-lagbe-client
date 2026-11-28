"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  ChevronRight,
  Compass,
  Gem,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Route,
  Sparkles,
  UserCog,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type NavLink = {
  name: string;
  href: string;
  icon: LucideIcon;
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/", icon: Home },
  { name: "Browse Tuitions", href: "/tuitions", icon: Compass },
  { name: "Pricing", href: "/pricing", icon: Gem },
  { name: "How It Works", href: "/#how-it-works", icon: Route },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Mobile drawer: page bodlale nijei bondho hoye jabe
  const [openedAt, setOpenedAt] = useState<string | null>(null);
  const menuOpen = openedAt === pathname;

  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { data: session, isPending } = authClient.useSession();

  // user object, role ar plan
  const user = session?.user;
  const userWithRole = user as { role?: string; plan?: string } | undefined;

  let role = "student";
  if (userWithRole && userWithRole.role) {
    role = userWithRole.role;
  }

  let plan = "free";
  if (userWithRole && userWithRole.plan) {
    plan = userWithRole.plan;
  }

  const isPro = plan === "pro";
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  let userInitial = "U";
  if (user && user.name) {
    userInitial = user.name.charAt(0).toUpperCase();
  }

  let userImage = "";
  if (user && user.image) {
    userImage = user.image;
  }

  // scroll korle navbar er shadow bare — one update per frame, same look.
  useEffect(() => {
    let frame = 0;

    function update() {
      const next = window.scrollY > 10;
      setScrolled((current) => (current === next ? current : next));
      frame = 0;
    }

    function handleScroll() {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // Drawer khola thakle background scroll bondho
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [menuOpen]);

  // Escape chaple drawer bondho
  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenedAt(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function openMenu() {
    setOpenedAt(pathname);
  }

  function closeMenu() {
    setOpenedAt(null);
  }

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    closeMenu();
    router.push("/");
    router.refresh();
  }

  // je link highlight hobe: hover korle seta, noile active page
  let highlightedLink = pathname;
  if (hoveredLink) {
    highlightedLink = hoveredLink;
  }

  let navClass =
    "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border bg-card/95 px-3 backdrop-blur-none transition-all duration-300 sm:bg-card/70 sm:px-4 sm:backdrop-blur-xl";
  if (scrolled) {
    navClass = navClass + " border-primary/20 shadow-xl shadow-primary/10";
  } else {
    navClass = navClass + " border-border shadow-sm";
  }

  // Dropdown er item gulo
  const dropdownItems = [
    {
      label: "Dashboard",
      href: "/dashboard/" + role,
      icon: LayoutDashboard,
    },
    {
      label: "Update Profile",
      href: "/dashboard/profile",
      icon: UserCog,
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-6">
      <div className={navClass}>
        <div className="pl-2">
          <Logo />
        </div>

        {/* Desktop links */}
        <nav
          className="hidden items-center lg:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((link) => {
            const isHighlighted = highlightedLink === link.href;
            const isActive = pathname === link.href;

            let textClass =
              "relative rounded-full px-4 py-2 text-sm font-medium transition-colors";
            if (isActive || isHighlighted) {
              textClass = textClass + " text-primary";
            } else {
              textClass = textClass + " text-muted-foreground";
            }

            return (
              <Link
                key={link.name}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.href)}
                className={textClass}
              >
                {isHighlighted && (
                  <motion.span
                    layoutId="nav-highlight"
                    className="absolute inset-0 rounded-full bg-secondary"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          {isPending && (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          )}

          {/* Guest buttons (desktop): Sign In, Sign Up ar Become a Tutor */}
          {!isPending && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>

              <Button asChild variant="outline" className="rounded-full">
                <Link href="/sign-up">Sign Up</Link>
              </Button>

              <Button
                asChild
                className="hidden rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent/90 xl:inline-flex"
              >
                <Link href="/sign-up?role=tutor">
                  <Sparkles className="mr-1 h-4 w-4" />
                  Become a Tutor
                </Link>
              </Button>
            </div>
          )}

          {/* Avatar dropdown */}
          {!isPending && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="Open account menu"
                  className="group flex items-center gap-2 rounded-full border bg-background/60 py-1 pl-1 pr-2 outline-none transition hover:shadow-md data-[state=open]:border-primary/50 data-[state=open]:shadow-md sm:gap-3 sm:pr-3"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userImage} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>

                  <span className="hidden max-w-[110px] truncate text-sm font-medium md:block">
                    {user.name}
                  </span>

                  <span
                    className={
                      "hidden rounded-full px-2 py-0.5 text-[10px] font-semibold md:block " +
                      (isPro
                        ? "bg-accent text-accent-foreground"
                        : "bg-secondary text-primary")
                    }
                  >
                    {roleLabel}
                  </span>

                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={10}
                collisionPadding={12}
                className="w-64 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border bg-popover/95 p-0 shadow-xl shadow-black/20 backdrop-blur-xl"
              >
                {/* Compact header */}
                <div className="relative border-b px-3 pb-3 pt-4">
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary to-accent" />

                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0 ring-2 ring-primary/30">
                      <AvatarImage src={userImage} alt={user.name} />
                      <AvatarFallback className="bg-primary font-semibold text-primary-foreground">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold leading-tight">
                        {user.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      {roleLabel}
                    </span>
                    <span
                      className={
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold " +
                        (isPro
                          ? "bg-accent text-accent-foreground"
                          : "border text-muted-foreground")
                      }
                    >
                      {isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="p-1.5">
                  {dropdownItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <DropdownMenuItem
                        key={item.label}
                        asChild
                        className="group/item cursor-pointer rounded-xl px-2 py-2 focus:bg-secondary"
                      >
                        <Link
                          href={item.href}
                          className="flex items-center gap-2.5"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition group-hover/item:bg-primary group-hover/item:text-primary-foreground">
                            <Icon className="h-4 w-4" />
                          </span>

                          <span className="flex-1 text-sm font-medium">
                            {item.label}
                          </span>

                          <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover/item:translate-x-0.5" />
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}

                  <DropdownMenuSeparator className="my-1.5" />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="group/item cursor-pointer rounded-xl px-2 py-2 text-rose-600 focus:bg-rose-500/10 focus:text-rose-600"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/10">
                      <LogOut className="h-4 w-4 text-rose-600" />
                    </span>
                    <span className="text-sm font-medium">Sign out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={openMenu}
            aria-label="Open menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition active:scale-95 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* ===== Mobile drawer ===== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeMenu}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          />
        )}

        {menuOpen && (
          <motion.aside
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-[88%] max-w-sm flex-col overflow-hidden border-l bg-background shadow-2xl lg:hidden"
          >
            {/* Decoration */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

            {/* Top row */}
            <div className="relative flex shrink-0 items-center justify-between px-5 py-4">
              <Logo />

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-primary transition active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="relative flex-1 space-y-6 overflow-y-auto px-5 pb-6">
              {/* User card */}
              {user && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="relative overflow-hidden rounded-3xl bg-hero-gradient p-4 text-white shadow-lg shadow-primary/20">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-accent/30 blur-2xl" />

                    <div className="relative flex items-center gap-3">
                      <Avatar className="h-14 w-14 ring-2 ring-white/40">
                        <AvatarImage src={userImage} alt={user.name} />
                        <AvatarFallback className="bg-white/20 text-lg font-bold text-white">
                          {userInitial}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <p className="truncate font-heading text-lg font-semibold">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-white/75">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-3 flex items-center gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        {roleLabel}
                      </span>
                      <span
                        className={
                          "rounded-full px-3 py-1 text-xs font-semibold " +
                          (isPro
                            ? "bg-accent text-accent-foreground"
                            : "bg-white/15")
                        }
                      >
                        {isPro ? "Pro" : "Free"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <Link
                      href={"/dashboard/" + role}
                      onClick={closeMenu}
                      className="flex flex-col items-start gap-2 rounded-2xl border bg-card p-3 transition active:scale-95"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                        <LayoutDashboard className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">Dashboard</span>
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="flex flex-col items-start gap-2 rounded-2xl border bg-card p-3 transition active:scale-95"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                        <UserCog className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-semibold">Profile</span>
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* Nav links */}
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Menu
                </p>

                <div className="space-y-2.5">
                  {navLinks.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;

                    let rowClass =
                      "group flex items-center gap-4 rounded-2xl border p-3 transition active:scale-[0.98] ";
                    let iconBoxClass =
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition ";

                    if (isActive) {
                      rowClass =
                        rowClass +
                        "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25";
                      iconBoxClass =
                        iconBoxClass + "bg-white/20 text-primary-foreground";
                    } else {
                      rowClass = rowClass + "bg-card hover:border-primary/40";
                      iconBoxClass = iconBoxClass + "bg-secondary text-primary";
                    }

                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: 28 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.12 + index * 0.06 }}
                      >
                        <Link
                          href={link.href}
                          onClick={closeMenu}
                          className={rowClass}
                        >
                          <span className={iconBoxClass}>
                            <Icon className="h-5 w-5" />
                          </span>

                          <span className="flex-1 text-base font-semibold">
                            {link.name}
                          </span>

                          <ChevronRight className="h-5 w-5 opacity-60 transition group-hover:translate-x-0.5" />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom actions */}
            <div className="relative shrink-0 space-y-3 border-t bg-background/80 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur">
              {!user && (
                <>
                  <Button
                    asChild
                    size="lg"
                    className="w-full rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/30 hover:bg-accent/90"
                  >
                    <Link href="/sign-up?role=tutor" onClick={closeMenu}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Become a Tutor
                    </Link>
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="rounded-full"
                    >
                      <Link href="/sign-in" onClick={closeMenu}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild size="lg" className="rounded-full">
                      <Link href="/sign-up" onClick={closeMenu}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </>
              )}

              {user && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSignOut}
                  className="w-full rounded-full border-rose-500/30 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </header>
  );
}