"use client";

import { format } from "date-fns";
import { ArrowLeft, BookOpen, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type BlogPost, getSingleBlogBySlug } from "@/lib/blogs";

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    let active = true;
    getSingleBlogBySlug(slug)
      .then((response) => {
        if (active) setBlog(response);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load article",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        Loading article...
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-4 text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
        <h1 className="text-2xl font-bold">Article not found</h1>
        <Button asChild>
          <Link href="/blogs">Back to articles</Link>
        </Button>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Button variant="ghost" asChild className="mb-6 gap-2">
        <Link href="/blogs">
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>
      </Button>

      <div className="space-y-5">
        <Badge className="w-fit">{blog.category}</Badge>
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          {blog.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(blog.createdAt), "dd MMM yyyy")}
          </span>
          <span className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border">
              <AvatarImage src={blog.author?.imageUrl || ""} />
              <AvatarFallback>
                {(blog.author?.name || "W").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {blog.author?.name || "WellOra Editorial"}
          </span>
        </div>

        {blog.coverImageUrl && (
          // biome-ignore lint/performance/noImgElement: Blog covers are remote URLs managed by the backend.
          <img
            src={blog.coverImageUrl}
            alt={blog.title}
            className="mt-8 aspect-[16/8] w-full rounded-2xl object-cover"
          />
        )}

        <div className="whitespace-pre-wrap pt-4 text-base leading-8 text-foreground/85">
          {blog.content}
        </div>
      </div>
    </article>
  );
}
