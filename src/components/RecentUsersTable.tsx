"use client";

import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users, MoreHorizontal } from "lucide-react";

export type UserRole = "Tenant" | "Landlord" | "Admin";
export type UserStatus = "Active" | "Blocked";

export interface UserItem {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
}


interface RecentUsersTableProps {
  users?: UserItem[];
  onManage?: (id: string) => void;
}

export function RecentUsersTable({
  users,
  onManage,
}: RecentUsersTableProps) {
  const items = users ?? [];
  const displayUsers = items.slice(0, 5);

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case "Admin":
        return "purple";
      case "Landlord":
        return "info";
      case "Tenant":
      default:
        return "secondary";
    }
  };

  return (
    <Card className="rounded-[1.5rem] border-0 bg-white shadow-sm dark:border dark:border-white/15 dark:bg-transparent dark:shadow-none transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold">New Users</CardTitle>
              <CardDescription className="text-xs">
                Recently registered platform users
              </CardDescription>
            </div>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Latest registered
          </span>
        </div>
      </CardHeader>

      <CardContent className="min-w-0 p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-none bg-slate-50/50 dark:bg-muted/30">
              <TableHead className="pl-6 w-12">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right pr-6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayUsers.length > 0 ? (
              displayUsers.map((user) => {
                const initials = user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .substring(0, 2);

                return (
                  <TableRow key={user.id} className="border-b border-muted/30 hover:bg-slate-50/60 dark:hover:bg-muted/30 transition-colors">
                    <TableCell className="pl-6">
                      <Avatar
                        src={user.avatarUrl}
                        fallback={initials}
                        alt={user.name}
                      />
                    </TableCell>

                    <TableCell>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{user.name}</p>
                        <p className="text-[11px] text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)} className="border-none">
                        {user.role}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "success" : "destructive"}
                        className="capitalize border-none"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground font-medium">
                      {user.joined}
                    </TableCell>

                    <TableCell className="text-right pr-6">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 rounded-lg hover:bg-muted"
                        onClick={() => onManage?.(user.id)}
                        title="Manage User"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground text-xs font-medium">
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

