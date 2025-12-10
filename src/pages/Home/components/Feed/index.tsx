import { useEffect, useRef, useState } from "react";
import { Stack, Typography, IconButton } from "@mui/material";
import { ArrowUpward } from "@mui/icons-material";
import { useAuth } from "../../../../context";
import { useFeedPersonalized } from "../../../../hooks";
import { PostCard } from "../../../../components";
import { mainContainerStyles, postGridStyles } from "./styles";
import { arrowUpwardButtonStyles, noPostContainerStyles } from "../styles";

export function Feed() {
  const { user } = useAuth();
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage } = useFeedPersonalized(
    user?.id as number,
    20
  );

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 300);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    containerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Stack sx={noPostContainerStyles}>
        <Typography color="white">Loading feed...</Typography>
      </Stack>
    );
  }

  if (allPosts.length === 0) {
    return (
      <Stack sx={noPostContainerStyles}>
        <Typography color="white">No posts found</Typography>
      </Stack>
    );
  }

  return (
    <Stack ref={containerRef} sx={mainContainerStyles}>
      <Stack sx={postGridStyles}>
        {allPosts.map((post) => (
          <PostCard
            key={post.id}
            commentId={null}
            post={post}
            width="auto"
            height="550px"
          />
        ))}
        <div ref={loaderRef} />
      </Stack>
      {showScrollTop && (
        <IconButton onClick={scrollToTop} sx={arrowUpwardButtonStyles}>
          <ArrowUpward />
        </IconButton>
      )}
    </Stack>
  );
}
