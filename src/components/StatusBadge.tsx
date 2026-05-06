import React from "react";

type TimesheetStatus = "COMPLETED" | "INCOMPLETE" | "MISSING";

const styles: Record<TimesheetStatus, string> = {
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  INCOMPLETE: "bg-amber-50 text-amber-700 border-amber-100",
  MISSING: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function StatusBadge({ status }: { status: TimesheetStatus }) {
  return (
    <span
      data-testid={`status-badge-${status.toLowerCase()}`}
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold tracking-wide border ${styles[status]}`}
    >
      {status}
    </span>
  );
}
