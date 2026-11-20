"use client";

import React, { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  Loader2,
  Mail,
  Search,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  getNewsletterSubscribers,
  type NewsletterMeta,
  type NewsletterSubscriber,
} from "@/lib/newsletter";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [meta, setMeta] = useState<NewsletterMeta>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNewsletterSubscribers({
        page,
        limit: 15,
        searchTerm: debouncedSearch || undefined,
      });
      setSubscribers(res.data);
      setMeta(res.meta);
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load subscribers",
      );
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied ${email}`);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Newsletter Subscribers
          </h1>
          <p className="text-sm text-muted-foreground">
            View everyone who subscribed to the WellOra health newsletter.
          </p>
        </div>

        <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1.5 text-sm">
          <Users className="h-4 w-4 text-primary" />
          Total Subscribers: {meta.total}
        </Badge>
      </div>

      {/* Subscribers Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Subscriber Directory</CardTitle>
              <CardDescription>
                Search subscribers by email address and monitor sign-up dates.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Subscriber Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed On</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading subscribers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No newsletter subscribers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((sub, index) => (
                    <TableRow key={sub.id}>
                      <TableCell className="text-xs text-muted-foreground">
                        {(meta.page - 1) * meta.limit + index + 1}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center gap-2 font-medium">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{sub.email}</span>
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={sub.isActive ? "default" : "secondary"}
                        >
                          {sub.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>

                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(sub.createdAt), "dd MMM yyyy, hh:mm a")}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1.5"
                          onClick={() => handleCopyEmail(sub.email)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
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
    </div>
  );
}