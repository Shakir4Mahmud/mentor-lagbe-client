import Logo from "@/components/shared/Logo";

type StatusScreenProps = {
  code: string;
  title: string;
  message: string;
  children: React.ReactNode;
};

export default function StatusScreen({
  code,
  title,
  message,
  children,
}: StatusScreenProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-hero-gradient px-6 text-center text-white">
      <div className="absolute -right-24 -top-24 hidden h-72 w-72 rounded-full bg-accent/20 blur-3xl sm:block" />
      <div className="absolute -bottom-24 -left-24 hidden h-72 w-72 rounded-full bg-white/10 blur-3xl sm:block" />

      <div className="absolute left-6 top-6 [&_a>span:nth-child(2)]:text-white">
        <Logo />
      </div>

      <div className="relative">
        <p className="text-gold-gradient font-heading text-8xl font-bold md:text-9xl">
          {code}
        </p>
        <h1 className="mt-4 text-3xl font-semibold md:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-md text-white/75">{message}</p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {children}
        </div>
      </div>
    </div>
  );
}