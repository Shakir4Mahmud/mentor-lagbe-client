import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { FaXTwitter, FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa6";
import Logo from "@/components/shared/Logo";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Browse Tuitions", href: "/tuitions" },
  { name: "Pricing", href: "/pricing" },
  { name: "How It Works", href: "/#how-it-works" },
];

const accountLinks = [
  { name: "Sign In", href: "/sign-in" },
  { name: "Sign Up", href: "/sign-up" },
  { name: "Dashboard", href: "/dashboard/profile" },
];

const socialLinks = [
  { name: "X", href: "https://x.com", icon: FaXTwitter },
  { name: "Facebook", href: "https://facebook.com", icon: FaFacebookF },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FaLinkedinIn },
  { name: "Instagram", href: "https://instagram.com", icon: FaInstagram },
];

export default function Footer() {
  const year = 2026;

  return (
    <footer className="bg-[#06191a] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="[&_a>span:nth-child(2)]:text-white">
            <Logo />
          </div>
          <p className="text-sm leading-relaxed text-white/70">
            Smart tuition and mentorship platform that connects students with
            verified tutors, online and offline.
          </p>
          <div className="flex gap-3">
            {socialLinks.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-accent hover:text-black"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="transition hover:text-accent">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Account links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Account</h3>
          <ul className="space-y-2 text-sm text-white/70">
            {accountLinks.map((link) => (
              <li key={link.name}>
                <Link href={link.href} className="transition hover:text-accent">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-lg font-semibold">Contact</h3>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-accent" />
              support@mentorlagbe.com
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-accent" />
              +880 1700 000000
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-accent" />
              Dhaka, Bangladesh
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {year} MentorLagbe. All rights reserved.
      </div>
    </footer>
  );
}