"use client";

import React, { useState, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/app/features/admin/actions/userActions";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { UserRow, IUser, formatDate, getUserAvatarColor } from "./UserRow";
import { UserStatusBadge } from "./UserStatusBadge";
import { UserRoleBadge } from "./UserRoleBadge";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Users,
} from "lucide-react";

interface UserTableProps {
  users?: {
    ok?: boolean;
    data?: IUser[] | { data?: IUser[]; users?: IUser[]; result?: IUser[]; payload?: IUser[] };
    users?: IUser[];
    result?: IUser[];
    message?: string;
  } | IUser[];
}


type SortField = "name" | "email" | "role" | "status" | "createdAt";
type SortOrder = "asc" | "desc";

export function UserTable({ users }: UserTableProps) {
  const router = useRouter();
  const rawUsersList = useMemo(() => {
    if (users === undefined) return [];
    if (Array.isArray(users)) return users;

    if (users && typeof users === "object") {
      if (Array.isArray(users.data)) return users.data;

      const d = users.data;
      if (d && typeof d === "object") {
        if (Array.isArray(d.data)) return d.data;
        if (Array.isArray(d.users)) return d.users;
        if (Array.isArray(d.result)) return d.result;
        if (Array.isArray(d.payload)) return d.payload;
      }

      if (Array.isArray(users.users)) return users.users;
      if (Array.isArray(users.result)) return users.result;
    }

    return [];
  }, [users]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, IUser["status"]>>({});
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const pageSize = 5;

  const usersList = useMemo(
    () => rawUsersList.map((user: IUser) => {
      const userId = user.id || user._id;
      return userId && statusOverrides[userId]
        ? { ...user, status: statusOverrides[userId] }
        : user;
    }),
    [rawUsersList, statusOverrides]
  );

  const handleStatusChange = (user: IUser) => {
    const userId = user.id || user._id;
    if (!userId || isPending) {
      if (!userId) toast.error("User ID is missing.");
      return;
    }

    const nextStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    setUpdatingUserId(userId);

    startTransition(async () => {
      const result = await updateUserStatusAction(userId, nextStatus);

      if (result.ok) {
        setStatusOverrides((current) => ({ ...current, [userId]: nextStatus }));
        toast.success(
          result.message || (nextStatus === "BANNED" ? "User banned successfully." : "User unbanned successfully.")
        );
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update user status.");
      }

      setUpdatingUserId(null);
    });
  };

  const filteredUsers = useMemo(() => {
    return usersList.filter((u: IUser) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchesStatus = statusFilter === "ALL" || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [usersList, searchTerm, roleFilter, statusFilter]);

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      let aValue: string | number = a[sortField] || "";
      let bValue: string | number = b[sortField] || "";

      if (sortField === "createdAt") {
        aValue = new Date(aValue).getTime() || 0;
        bValue = new Date(bValue).getTime() || 0;
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredUsers, sortField, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (validCurrentPage - 1) * pageSize;
    return sortedUsers.slice(startIndex, startIndex + pageSize);
  }, [sortedUsers, validCurrentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-slate-400 opacity-60 group-hover:opacity-100" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 ml-1.5 text-primary font-bold" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 ml-1.5 text-primary font-bold" />
    );
  };

  const paginationRange = useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", validCurrentPage, "...", totalPages);
      }
    }
    return pages;
  }, [totalPages, validCurrentPage]);

  const startItemIndex = (validCurrentPage - 1) * pageSize + 1;
  const endItemIndex = Math.min(validCurrentPage * pageSize, sortedUsers.length);

  return (
    <div className="w-full space-y-6">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Users Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage user accounts, roles, and status controls across the platform.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Total Users: {usersList.length}
          </span>
        </div>
      </div>


      <div className="bg-white border-0 shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none rounded-[1.5rem] p-4 sm:p-6 space-y-5">

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-1">

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-slate-400/20 focus:border-slate-400 transition-all"
            />
          </div>


          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mr-1 hidden sm:flex">
              <Filter className="w-3.5 h-3.5" />
              <span>Filters:</span>
            </div>


            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="TENANT">TENANT</option>
              <option value="LANDLORD">LANDLORD</option>
              <option value="ADMIN">ADMIN</option>
            </select>


            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 text-xs font-medium bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900/10 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="BANNED">Banned</option>
            </select>
          </div>
        </div>


        <div className="hidden md:block rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs">
          <Table>
            <TableHeader className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800">
              <TableRow className="hover:bg-transparent border-slate-200/80 dark:border-slate-800">

                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("name")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    User
                    {getSortIcon("name")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("email")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Email
                    {getSortIcon("email")}
                  </button>
                </TableHead>


                <TableHead className="hidden lg:table-cell py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  Phone
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("role")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Role
                    {getSortIcon("role")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("status")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Status
                    {getSortIcon("status")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200">
                  <button
                    type="button"
                    onClick={() => handleSort("createdAt")}
                    className="flex items-center group cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    Joined
                    {getSortIcon("createdAt")}
                  </button>
                </TableHead>


                <TableHead className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-200 text-right">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <UserRow
                    key={user.id || user._id || user.email}
                    user={user}
                    isUpdating={updatingUserId === (user.id || user._id)}
                    onStatusChange={handleStatusChange}
                  />
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-32 text-center text-slate-500 dark:text-slate-400"
                  >
                    No users match your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>


        <div className="block md:hidden space-y-3">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => {
              const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";
              const avatarBg = getUserAvatarColor(user.name || "");
              return (
                <div
                  key={user.id || user._id || user.email}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-black/5 dark:border-white/10 ${avatarBg}`}
                      >
                        {initial}
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                          {user.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div>
                      {user.status === "ACTIVE" ? (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user)}
                          disabled={updatingUserId === (user.id || user._id)}
                          className="px-3 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200/80 rounded-md transition-colors shadow-2xs"
                        >
                          {updatingUserId === (user.id || user._id) ? "Updating..." : "Ban"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(user)}
                          disabled={updatingUserId === (user.id || user._id)}
                          className="px-3 py-1 text-xs font-semibold text-green-600 bg-green-50 hover:bg-green-100 border border-green-200/80 rounded-md transition-colors shadow-2xs"
                        >
                          {updatingUserId === (user.id || user._id) ? "Updating..." : "Unban"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Role:</span>
                      <div className="mt-1">
                        <UserRoleBadge role={user.role} />
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Status:</span>
                      <div className="mt-1">
                        <UserStatusBadge status={user.status} />
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Phone:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {user.phone || "—"}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Joined:</span>
                      <span className="text-slate-700 dark:text-slate-300 font-medium">
                        {formatDate(user.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 rounded-xl">
              No users found matching your search.
            </div>
          )}
        </div>


        {sortedUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
              Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{startItemIndex}</span> to{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{endItemIndex}</span> of{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-200">{sortedUsers.length}</span> users
            </div>


            <div className="flex items-center gap-1.5">

              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={validCurrentPage === 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>


              <div className="flex items-center gap-1">
                {paginationRange.map((page, idx) => {
                  if (typeof page === "string") {
                    return (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 py-1 text-xs font-medium text-slate-400"
                      >
                        ...
                      </span>
                    );
                  }

                  const isActive = page === validCurrentPage;
                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[32px] h-8 px-2 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:border-slate-100 shadow-2xs"
                          : "bg-white text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>


              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={validCurrentPage === totalPages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
