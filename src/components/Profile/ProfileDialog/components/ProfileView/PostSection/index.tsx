import { CircularProgress, Stack, Typography } from "@mui/material";
import { usePostFindByUserId } from "../../../../../../hooks";
import { PostCard } from "../../../../..";
import { mainContainerStyles } from "../styles";
import { spinnerStyles } from "./styles";

interface Props {
  userId: number;
}

export function PostSection({ userId }: Props) {
  const { data: posts = [], isLoading } = usePostFindByUserId(userId);

  return (
    <Stack sx={mainContainerStyles}>
      {posts.length ? (
        posts?.map((post) => (
          <PostCard key={post.id} post={post} width="100%" />
        ))
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
