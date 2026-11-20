"use client";

import { format } from "date-fns";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
import { type BlogPost, getPublicBlogs } from "@/lib/blogs";

export default function HomeBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch all published blogs for the slider
  useEffect(() => {
    let active = true;

    getPublicBlogs({ page: 1, limit: 50 })
      .then((response) => {
        if (active) setBlogs(response.data);
      })
      .catch((error: unknown) => {
        if (active) {
          toast.error(
            error instanceof Error ? error.message : "Failed to load blogs",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Responsive visible cards per slide
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const maxIndex = Math.max(0, blogs.length - visibleCount);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide every 4 seconds (pauses on hover)
  useEffect(() => {
    if (isPaused || blogs.length <= visibleCount) return;

    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, blogs.length, visibleCount, handleNext]);

  const slideStepPercent = 100 / visibleCount;

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header + Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="secondary" className="gap-1.5 px-3 py-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            WellOra Health Journal
          </Badge>
          <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            Latest health articles
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Trusted wellness advice and preventive healthcare tips.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {blogs.length > visibleCount && (
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handlePrev}
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={handleNext}
                aria-label="Next slide"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button variant="outline" asChild className="w-fit gap-1">
            <Link href="/blogs">
              View all articles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Slider Content */}
      {loading ? (
        <div className="flex h-56 items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading articles...</span>
        </div>
      ) : blogs.length === 0 ? (
        <div className="rounded-xl border border-dashed p-10 text-center text-sm text-muted-foreground">
          No published articles yet.
        </div>
      ) : (
        // biome-ignore lint/a11y/noStaticElementInteractions: <explanation>
<div
          className="space-y-5"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="-mx-3 flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * slideStepPercent}%)`,
              }}
            >
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="w-full shrink-0 px-3 sm:w-1/2 lg:w-1/3"
                >
                  <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-md">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="block overflow-hidden"
                    >
                      <div className="relative aspect-[16/9] w-full bg-muted">
                        {blog.coverImageUrl ? (
                          // biome-ignore lint/performance/noImgElement: Blog covers are remote URLs managed by the backend.
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
                        {blog.excerpt || `${blog.content.slice(0, 140)}...`}
                      </p>
                    </CardContent>

                    <CardFooter className="flex items-center justify-between gap-2 border-t pt-4">
                      <div className="flex min-w-0 items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0 border">
                          <AvatarImage src={blog.author?.imageUrl || ""} />
                          <AvatarFallback className="text-[10px]">
                            {(blog.author?.name || "W")
                              .slice(0, 2)
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-xs font-medium text-muted-foreground">
                          {blog.author?.name || "WellOra Editorial"}
                        </span>
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        asChild
                        className="shrink-0 gap-1.5"
                      >
                        <Link href={`/blogs/${blog.slug}`}>
                          Details
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicator Dots */}
          {maxIndex > 0 && (
            <div className="flex items-center justify-center gap-2">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    currentIndex === idx
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}