type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = "bg-slate-500/15 text-slate-600 dark:text-slate-300";

  if (status === "pending") {
    colorClass = "bg-amber-500/15 text-amber-600 dark:text-amber-400";
  }
  if (status === "accepted" || status === "approved") {
    colorClass = "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
  }
  if (status === "rejected") {
    colorClass = "bg-rose-500/15 text-rose-600 dark:text-rose-400";
  }

  const label = status.charAt(0).toUpperCase() + status.slice(1);

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