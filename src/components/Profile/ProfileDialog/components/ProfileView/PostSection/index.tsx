import { useEffect, useRef } from "react";
import { CircularProgress, Stack, Typography } from "@mui/material";
import { usePostFindByUserId } from "../../../../../../hooks";
import { PostCard } from "../../../../..";
import { mainContainerStyles } from "../styles";
import { gridStyles, spinnerStyles } from "./styles";

interface Props {
  userId: number;
}

export function PostSection({ userId }: Props) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    usePostFindByUserId(userId, 20);

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

  return (
    <Stack sx={mainContainerStyles}>
      {allPosts.length ? (
        <Stack sx={gridStyles}>
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              commentId={null}
              post={post}
              height="500px"
            />
          ))}
          <div ref={loaderRef} style={{ height: "40px" }}>
            {isFetchingNextPage && (
              <CircularProgress size={35} sx={spinnerStyles} />
            )}
          </div>
        </Stack>
      ) : (
        <Stack>
          {isLoading ? (
            <CircularProgress size={40} sx={spinnerStyles} />
          ) : (
            <Typography align="center" color="white">
              No posts
            </Typography>
          )}
        </Stack>
      )}
    </Stack>
  );
}
