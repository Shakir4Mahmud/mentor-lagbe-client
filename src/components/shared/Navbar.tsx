"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Menu,
  X,
  LayoutDashboard,
  UserCog,
  LogOut,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import Logo from "@/components/shared/Logo";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/#how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const { data: session, isPending } = authClient.useSession();

  // user object and role
  const user = session?.user;
  const userWithRole = user as { role?: string } | undefined;
  let role = "student";
  if (userWithRole && userWithRole.role) {
    role = userWithRole.role;
  }
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  let userInitial = "U";
  if (user && user.name) {
    userInitial = user.name.charAt(0).toUpperCase();
  }

  // scroll korle navbar er shadow bare
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("Signed out successfully");
    setMenuOpen(false);
    router.push("/");
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  // je link highlight hobe: hover korle seta, noile active page
  let highlightedLink = pathname;
  if (hoveredLink) {
    highlightedLink = hoveredLink;
  }

  let navClass =
    "mx-auto flex h-16 max-w-7xl items-center justify-between rounded-full border bg-card/70 px-3 backdrop-blur-xl transition-all duration-300 sm:px-4";
  if (scrolled) {
    navClass = navClass + " border-primary/20 shadow-xl shadow-primary/10";
  } else {
    navClass = navClass + " border-border shadow-sm";
  }

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
        <div className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />

          {isPending && (
            <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
          )}

          {!isPending && !user && (
            <div className="hidden items-center gap-2 sm:flex">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-accent text-accent-foreground shadow-md shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent/90"
              >
                <Link href="/sign-up?role=tutor">
                  <Sparkles className="mr-1 h-4 w-4" />
                  Become a Tutor
                </Link>
              </Button>
            </div>
          )}

          {!isPending && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-full border bg-background py-1 pl-1 pr-3 outline-none transition hover:shadow-md">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || ""} alt={user.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium md:block">
                    {user.name}
                  </span>
                  <Badge className="hidden md:inline-flex">{roleLabel}</Badge>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={"/dashboard/" + role}>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl rounded-3xl border bg-card/95 p-3 shadow-xl backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-2xl px-4 py-3 text-sm font-medium transition hover:bg-secondary"
                >
                  {link.name}
                </Link>
              ))}

              {!user && (
                <div className="mt-2 flex flex-col gap-2">
                  <Button
                    asChild
                    className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Link href="/sign-up?role=tutor" onClick={closeMenu}>
                      <Sparkles className="mr-1 h-4 w-4" />
                      Become a Tutor
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="outline"
                      className="flex-1 rounded-full"
                    >
                      <Link href="/sign-in" onClick={closeMenu}>
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild className="flex-1 rounded-full">
                      <Link href="/sign-up" onClick={closeMenu}>
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}