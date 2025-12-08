import { CircularProgress, Stack, Typography } from "@mui/material";
import { usePostFindByUserId } from "../../../../../../hooks";
import { PostCard } from "../../../../..";
import { mainContainerStyles } from "../styles";
import { spinnerStyles } from "./styles";

interface Props {
  userId: number;
}

export function PostSection({ userId }: Props) {
  const { data: posts, isLoading } = usePostFindByUserId(userId);

  if (isLoading) {
    return <CircularProgress size={40} sx={spinnerStyles} />;
  }

  return (
    <Stack sx={mainContainerStyles}>
      {posts ? (
        posts?.map((post) => (
          <PostCard key={post.id} post={post} width="100%" />
        ))
      ) : (
        <Typography align="center">No posts</Typography>
      )}
    </Stack>
  );
}
