"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { BlogMeta, BlogPost, getPublicBlogs } from "@/lib/blogs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BLOG_BANNER_URL =
  "https://res.cloudinary.com/dnk0bvpym/image/upload/v1794323701/health1_rne4wn.jpg";

const CATEGORIES = [
  "ALL",
  "Health Tips",
  "Cardiology",
  "Mental Health",
  "Nutrition",
  "Preventive Care",
  "Medical News",
];

export default function HomeBlogsPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [meta, setMeta] = useState<BlogMeta>({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);
  const [bannerError, setBannerError] = useState(false);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPublicBlogs({
        page,
        limit: 9,
        category: selectedCategory,
        searchTerm: debouncedSearch || undefined,
      });
      setBlogs(res.data);
      setMeta(res.meta);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }, [page, selectedCategory, debouncedSearch]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner */}
   {/* Hero Banner */}
<div className="relative overflow-hidden border-b bg-slate-900 text-white">
  {!bannerError && (
    <img
      src={BLOG_BANNER_URL}
      alt="WellOra Health Journal Banner"
      onError={() => setBannerError(true)}
      className="absolute inset-0 h-full w-full object-cover object-center opacity-50"
    />
  )}
  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/65 to-slate-900/40" />

  <div className="relative mx-auto flex max-w-7xl flex-col items-center space-y-4 px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
    {/* existing badge, heading, paragraph, and search input */}
  </div>
</div>

      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => {
                setSelectedCategory(category);
                setPage(1);
              }}
            >
              {category === "ALL" ? "All Topics" : category}
            </Button>
          ))}
        </div>

        {/* Dynamic Blogs Grid */}
        {loading ? (
          <div className="flex h-64 items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading articles...</span>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed text-center">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            <h3 className="mt-3 text-base font-semibold">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Try changing the category or search keywords.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Card
                key={blog.id}
                className="group flex flex-col overflow-hidden transition-all hover:shadow-md"
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="block overflow-hidden"
                >
                  <div className="relative aspect-[16/9] w-full bg-muted">
                    {blog.coverImageUrl ? (
                      <img
                        src={blog.coverImageUrl}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/5 text-primary/40">
                        <BookOpen className="h-12 w-12" />
                      </div>
                    )}
                    <Badge className="absolute left-3 top-3 shadow-sm">
                      {blog.category}
                    </Badge>
                  </div>
                </Link>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(blog.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <Link href={`/blogs/${blog.slug}`}>
                    <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary">
                      {blog.title}
                    </CardTitle>
                  </Link>
                </CardHeader>

                <CardContent className="flex-1">
                  <p className="line-clamp-3 text-sm text-muted-foreground">
                    {blog.excerpt || blog.content.slice(0, 140) + "..."}
                  </p>
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 border">
                      <AvatarImage src={blog.author?.imageUrl || ""} />
                      <AvatarFallback className="text-[10px]">
                        {(blog.author?.name || "W").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium text-muted-foreground">
                      {blog.author?.name || "WellOra Editorial"}
                    </span>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="gap-1 px-2"
                  >
                    <Link href={`/blogs/${blog.slug}`}>
                      Read More
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page <strong className="text-foreground">{meta.page}</strong> of{" "}
              <strong className="text-foreground">{meta.totalPages}</strong>
            </span>
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
        )}
      </div>
    </div>
  );
}