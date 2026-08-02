import React from "react";

interface UserRoleBadgeProps {
  role: "TENANT" | "LANDLORD" | "ADMIN" | string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  switch (role) {
    case "TENANT":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800">
          TENANT
        </span>
      );
    case "LANDLORD":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200/80 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800">
          LANDLORD
        </span>
      );
    case "ADMIN":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/80 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800">
          ADMIN
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
          {role}
        </span>
      );
  }
}
