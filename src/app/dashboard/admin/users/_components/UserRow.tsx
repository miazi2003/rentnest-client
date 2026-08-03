import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserRoleBadge } from "./UserRoleBadge";

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  phone: string;
  role: "TENANT" | "LANDLORD" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  createdAt: string;
  updatedAt: string;
}

interface UserRowProps {
  user: IUser;
  isUpdating?: boolean;
  onStatusChange: (user: IUser) => void;
}

export function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(date);
  } catch {
    return dateStr;
  }
}

export function getUserAvatarColor(name: string) {
  const colors = [
    "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300",
    "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300",
    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    "bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function UserRow({ user, isUpdating = false, onStatusChange }: UserRowProps) {
  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
  const avatarBg = getUserAvatarColor(user.name || "");

  return (
    <TableRow className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
      {/* 1. User (Avatar + Name) */}
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-black/5 dark:border-white/10 ${avatarBg}`}
          >
            {initial}
          </div>
          <span className="font-semibold text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
            {user.name}
          </span>
        </div>
      </TableCell>

      {/* 2. Email */}
      <TableCell className="text-slate-600 dark:text-slate-400">
        {user.email}
      </TableCell>

      {/* 3. Phone (Hide on Tablet) */}
      <TableCell className="hidden lg:table-cell text-slate-600 dark:text-slate-400">
        {user.phone || "—"}
      </TableCell>

      {/* 4. Role */}
      <TableCell>
        <UserRoleBadge role={user.role} />
      </TableCell>

      {/* 5. Status */}
      <TableCell>
        <UserStatusBadge status={user.status} />
      </TableCell>

      {/* 6. Joined */}
      <TableCell className="text-slate-600 dark:text-slate-400 text-sm whitespace-nowrap">
        {formatDate(user.createdAt)}
      </TableCell>

      {/* 7. Action */}
      <TableCell className="text-right">
        {user.status === "ACTIVE" ? (
          <button
            type="button"
            onClick={() => onStatusChange(user)}
            disabled={isUpdating}
            className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer dark:bg-red-950/40 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/50"
          >
            {isUpdating ? "Updating..." : "Ban"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onStatusChange(user)}
            disabled={isUpdating}
            className="inline-flex items-center justify-center px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 border border-green-200/80 rounded-md transition-all shadow-xs active:scale-95 cursor-pointer dark:bg-green-950/40 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/50"
          >
            {isUpdating ? "Updating..." : "Unban"}
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}
