import Logo from "@/components/shared/Logo";

// Password/verification routes must stay reachable even when a stale session
// cookie exists, so they are outside the (auth) RedirectIfLoggedIn group.
export default function PasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <div className="px-6 py-6">
        <Logo />
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  );
}
