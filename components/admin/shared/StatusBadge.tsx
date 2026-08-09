interface StatusBadgeProps {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
}

export function StatusBadge({ active, activeLabel, inactiveLabel }: StatusBadgeProps) {
  return (
    <span
      className={`admin-status-badge ${active ? "admin-status-active" : "admin-status-inactive"}`}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
