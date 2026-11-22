"use client";

import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  type AdminUserItem,
  deleteUserByAdmin,
  getAllUsersForAdmin,
  toggleUserBan,
  type UserMeta,
} from "@/lib/users";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [meta, setMeta] = useState<UserMeta>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);

  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUserItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllUsersForAdmin({
        page,
        limit: 12,
        role: roleFilter,
        searchTerm: debouncedSearch || undefined,
      });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load users",
      );
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter, debouncedSearch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const isUserBanned = (user: AdminUserItem) =>
    user.isBanned === true ||
    user.status === "BLOCKED" ||
    user.status === "BANNED";

  const handleToggleBan = async (user: AdminUserItem) => {
    const banned = isUserBanned(user);
    setActionLoadingId(user.id);
    try {
      await toggleUserBan(user.id, banned);
      toast.success(
        banned ? `${user.name} has been unbanned` : `${user.name} has been banned`,
      );
      fetchUsers();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update user status",
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUserByAdmin(deleteTarget.id);
      toast.success("User deleted permanently");
      setDeleteTarget(null);
      fetchUsers();
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform accounts, ban or unban users, and remove inactive profiles.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Users ({meta.total})</CardTitle>
              <CardDescription>
                Filter by role or search by name and email address.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select
                value={roleFilter}
                onValueChange={(val) => {
                  setRoleFilter(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="PATIENT">Patients</SelectItem>
                  <SelectItem value="DOCTOR">Doctors</SelectItem>
                  <SelectItem value="ADMIN">Admins</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search name or email..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No users found matching your criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => {
                    const banned = isUserBanned(user);
                    const busy = actionLoadingId === user.id;

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border">
                              <AvatarImage src={user.imageUrl || ""} />
                              <AvatarFallback>
                                {user.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium leading-none">
                                {user.name}
                              </p>
                              <p className="mt-1 text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>

                        <TableCell>
                          {banned ? (
                            <Badge variant="destructive" className="gap-1">
                              <ShieldAlert className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="gap-1">
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                              Active
                            </Badge>
                          )}
                        </TableCell>

                        <TableCell className="text-xs text-muted-foreground">
                          {format(new Date(user.createdAt), "dd MMM yyyy")}
                        </TableCell>

                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant={banned ? "outline" : "secondary"}
                              size="sm"
                              disabled={busy || user.role === "SUPER_ADMIN"}
                              onClick={() => handleToggleBan(user)}
                              className="gap-1.5"
                            >
                              {busy ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Ban className="h-3.5 w-3.5" />
                              )}
                              {banned ? "Unban" : "Ban"}
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={busy || user.role === "SUPER_ADMIN"}
                              onClick={() => setDeleteTarget(user)}
                              className="text-destructive hover:text-destructive"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {meta.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page <span className="font-medium">{meta.page}</span> of{" "}
                <span className="font-medium">{meta.totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= meta.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove <strong>{deleteTarget?.name}</strong>{" "}
              ({deleteTarget?.email}) and all associated records from WellOra.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}