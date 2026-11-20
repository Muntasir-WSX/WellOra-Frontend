"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  BlogMeta,
  BlogPost,
  createBlog,
  deleteBlog,
  getAllBlogsForAdmin,
  updateBlog,
} from "@/lib/blogs";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

const BLOG_CATEGORIES = [
  "Health Tips",
  "Cardiology",
  "Mental Health",
  "Nutrition",
  "Preventive Care",
  "Medical News",
];

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [meta, setMeta] = useState<BlogMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  // Create / Edit Modal State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    category: "Health Tips",
    excerpt: "",
    content: "",
    isPublished: true,
  });

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchAdminBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllBlogsForAdmin({
        page,
        limit: 10,
        searchTerm: debouncedSearch || undefined,
      });
      setBlogs(res.data);
      setMeta(res.meta);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    fetchAdminBlogs();
  }, [fetchAdminBlogs]);

  const openCreateModal = () => {
    setEditingBlog(null);
    setCoverFile(null);
    setCoverPreview("");
    setFormData({
      title: "",
      category: "Health Tips",
      excerpt: "",
      content: "",
      isPublished: true,
    });
    setDialogOpen(true);
  };

  const openEditModal = (blog: BlogPost) => {
    setEditingBlog(blog);
    setCoverFile(null);
    setCoverPreview(blog.coverImageUrl || "");
    setFormData({
      title: blog.title,
      category: blog.category || "Health Tips",
      excerpt: blog.excerpt || "",
      content: blog.content,
      isPublished: blog.isPublished,
    });
    setDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }
    if (formData.content.trim().length < 20) {
      toast.error("Content must be at least 20 characters");
      return;
    }

    setSubmitting(true);
    try {
      if (editingBlog) {
        await updateBlog(editingBlog.id, {
          title: formData.title.trim(),
          category: formData.category,
          excerpt: formData.excerpt.trim(),
          content: formData.content.trim(),
          isPublished: formData.isPublished,
          coverImage: coverFile,
        });
        toast.success("Blog post updated!");
      } else {
        await createBlog({
          title: formData.title.trim(),
          category: formData.category,
          excerpt: formData.excerpt.trim() || undefined,
          content: formData.content.trim(),
          isPublished: formData.isPublished,
          coverImage: coverFile,
        });
        toast.success("Blog post created!");
      }

      setDialogOpen(false);
      fetchAdminBlogs();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save blog post");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTogglePublish = async (blog: BlogPost) => {
    try {
      await updateBlog(blog.id, { isPublished: !blog.isPublished });
      toast.success(
        !blog.isPublished ? "Blog published!" : "Blog moved to drafts",
      );
      fetchAdminBlogs();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget.id);
      toast.success("Blog deleted permanently");
      setDeleteTarget(null);
      fetchAdminBlogs();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          <p className="text-sm text-muted-foreground">
            Create, edit, publish, and manage health journal articles.
          </p>
        </div>

        <Button onClick={openCreateModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>All Articles ({meta.total})</CardTitle>
              <CardDescription>
                Manage published posts and unpublished drafts.
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title..."
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
                  <TableHead>Article</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-40 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading articles...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : blogs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-40 text-center text-muted-foreground"
                    >
                      No blog articles found. Click &quot;New Article&quot; to
                      create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  blogs.map((blog) => (
                    <TableRow key={blog.id}>
                      {/* Cover + Title */}
                      <TableCell className="max-w-md">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            {blog.coverImageUrl ? (
                              <img
                                src={blog.coverImageUrl}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-muted-foreground/50">
                                <BookOpen className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-medium">{blog.title}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              /{blog.slug}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      {/* Category */}
                      <TableCell>
                        <Badge variant="outline">{blog.category}</Badge>
                      </TableCell>

                      {/* Publish Switch */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={blog.isPublished}
                            onCheckedChange={() => handleTogglePublish(blog)}
                          />
                          <Badge
                            variant={blog.isPublished ? "default" : "secondary"}
                          >
                            {blog.isPublished ? "Published" : "Draft"}
                          </Badge>
                        </div>
                      </TableCell>

                      {/* Date */}
                      <TableCell className="text-xs text-muted-foreground">
                        {format(new Date(blog.createdAt), "dd MMM yyyy")}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {blog.isPublished && (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              title="View Public Post"
                            >
                              <Link href={`/blogs/${blog.slug}`} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit Article"
                            onClick={() => openEditModal(blog)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            title="Delete Article"
                            onClick={() => setDeleteTarget(blog)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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

      {/* Create / Edit Blog Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBlog ? "Edit Blog Article" : "Create New Blog Article"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below. Cover images are uploaded directly to
              Cloudinary.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveBlog} className="space-y-4">
            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label>Cover Image</Label>
              {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
<div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed bg-muted/30 p-4 transition-colors hover:bg-muted/50"
              >
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="max-h-48 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-6 text-muted-foreground">
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-xs font-medium">
                      Click to upload cover image (JPG, PNG, WebP)
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Article Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. 5 Daily Habits for a Stronger Heart"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(val) =>
                    setFormData({ ...formData, category: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {BLOG_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Short Excerpt (Summary)</Label>
              <Textarea
                id="excerpt"
                rows={2}
                placeholder="Brief summary shown on blog cards..."
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Full Content *</Label>
              <Textarea
                id="content"
                rows={8}
                placeholder="Write the complete medical article here..."
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <Label className="text-sm font-medium">Publish Immediately</Label>
                <p className="text-xs text-muted-foreground">
                  Make this article visible to public visitors right away.
                </p>
              </div>
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(val) =>
                  setFormData({ ...formData, isPublished: val })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {editingBlog ? "Save Changes" : "Publish Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this blog post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove &quot;{deleteTarget?.title}&quot; and
              its cover image from Cloudinary. This action cannot be undone.
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}