import React from "react";

interface UserStatusBadgeProps {
  status: "ACTIVE" | "BLOCKED" | string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  if (status === "ACTIVE") {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200/80 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shrink-0" />
        ACTIVE
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 shrink-0" />
      BLOCKED
    </span>
  );
}
