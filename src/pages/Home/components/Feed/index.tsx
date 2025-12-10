import { useEffect, useRef } from "react";
import { Stack, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../../../context";
import { useFeedPersonalized } from "../../../../hooks";
import { PostCard } from "../../../../components";

export function Feed() {
  const { user } = useAuth();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedPersonalized(user?.id as number, 20);

  const loaderRef = useRef<HTMLDivElement | null>(null);

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

  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <Stack
        width="100%"
        height="100%"
        alignItems="center"
        justifyContent="center"
      >
        <Typography color="white">Loading feed...</Typography>
      </Stack>
    );
  }

  return (
    <Stack
      height="100%"
      width="100%"
      p={2}
      sx={{
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#444",
          borderRadius: 4,
        },
      }}
    >
      <Stack
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(500px, 1fr))"
        gap={2}
        p={1}
      >
        {allPosts.length > 0 &&
          allPosts.map((post) => (
            <PostCard
              key={post.id}
              commentId={null}
              post={post}
              width="auto"
              height="550px"
            />
          ))}
        <div ref={loaderRef} style={{ height: "40px" }}>
          {isFetchingNextPage && <CircularProgress size={35} />}
        </div>
      </Stack>
    </Stack>
  );
}
