import { Stack, Typography } from "@mui/material";
import { useAuth } from "../../../../context";
import { useFeedPersonalized } from "../../../../hooks";
import { PostCard } from "../../../../components";

export function Feed() {
  const { user } = useAuth();
  const { data: posts = [], isLoading } = useFeedPersonalized(
    user?.id as number
  );

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
      border="1px solid lightblue"
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
        gridTemplateColumns="repeat(auto-fill, minmax(450px, 1fr))"
        gap={2}
        p={1}
      >
        {posts.length > 0 &&
          posts.map((p) => <PostCard key={p.id} post={p} width="auto" />)}
      </Stack>
    </Stack>
  );
}
