import { CircularProgress, Stack, Typography } from "@mui/material";
import { usePostFindByUserId } from "../../../../../hooks";
import { PostCard } from "../../../..";

interface PostSectionProps {
  userId: number;
}

export function PostSection({ userId }: PostSectionProps) {
  const { data: posts, isLoading } = usePostFindByUserId(userId);

  if (isLoading) {
    return (
      <CircularProgress size={40} sx={{ alignSelf: "center", mt: 2, color: "lightblue" }} />
    );
  }

  return (
    <Stack spacing={2} maxHeight="600px" sx={{ p: 1, paddingInline: .5, overflowY: "auto" }}>
      {posts ? posts?.map((post) => (
        <PostCard key={post.id} post={post} width="100%" />
      )) : (
        <Typography align="center">No posts.</Typography>
      )}
    </Stack>
  );
}
