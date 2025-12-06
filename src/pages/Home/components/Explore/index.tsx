import { useState } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  type SelectChangeEvent,
} from "@mui/material";
import { Public } from "@mui/icons-material";
import { useFeedExplore } from "../../../../hooks";
import { PostCard } from "../../../../components";

type FilterType = "mostLiked" | "mostReacted" | "recent" | "oldest";

export function ExploreFeed() {
  const [filter, setFilter] = useState<FilterType>("mostLiked");
  const { data: posts = [], isLoading } = useFeedExplore(filter);

  const handleChange = (event: SelectChangeEvent<FilterType>) => {
    setFilter(event.target.value as typeof filter);
  };

  if (isLoading) {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        height="100%"
        width="100%"
        p={1}
      >
        <Typography color="white">Loading explore feed...</Typography>
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
      <Stack p={1}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          p={2}
          mb={2}
          borderRadius={2}
          sx={{
            bgcolor: "#1e1e1e",
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            spacing={0.75}
          >
            <Typography color="white">Explore</Typography>
            <Public sx={{ color: "lightblue" }} />
          </Stack>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel
              sx={{
                color: "white",
                "&.Mui-focused": { color: "white" },
              }}
            >
              Filter By
            </InputLabel>
            <Select
              value={filter}
              onChange={handleChange}
              label="Filter"
              sx={{
                maxWidth: 400,
                backgroundColor: "#1e1e1e",
                color: "white",
                ".MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#666",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#444",
                },
                ".MuiSvgIcon-root": { color: "white" },
              }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#1e1e1e",
                    color: "white",
                  },
                },
              }}
            >
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="mostReacted">Most Reacted</MenuItem>
              <MenuItem value="recent">Recent</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      <Stack
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(450px, 1fr))"
        gap={2}
        p={1}
      >
        {posts.length === 0 ? (
          posts.map((p) => <PostCard key={p.id} post={p} width="auto" />)
        ) : (
          <Typography align="center" color="white">
            No posts found
          </Typography>
        )}
      </Stack>
    </Stack>
  );
}
