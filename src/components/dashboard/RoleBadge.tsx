type RoleBadgeProps = {
  role: string;
};

export default function RoleBadge({ role }: RoleBadgeProps) {
  let colorClass = "bg-sky-500/15 text-sky-600 dark:text-sky-400";

  if (role === "tutor") {
    colorClass = "bg-primary/10 text-primary";
  }
  if (role === "admin") {
    colorClass = "bg-rose-500/15 text-rose-600 dark:text-rose-400";
  }

  const label = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <span
      className={
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " +
        colorClass
      }
    >
      {label}
    </span>
  );
}