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
import { useAuth } from "../../../../context";

type FilterType = "mostLiked" | "mostReacted" | "recent" | "oldest";

export function ExploreFeed() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterType>("mostLiked");
  const { data: posts = [] } = useFeedExplore(user?.id as number, filter);

  const handleChange = (event: SelectChangeEvent<FilterType>) => {
    setFilter(event.target.value as typeof filter);
  };

  return (
    <Stack
      alignSelf="center"
      height="100%"
      width="100%"
      pt={1}
      boxSizing="border-box"
      sx={{
        overflowY: "auto",
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#444",
          borderRadius: 4,
        },
      }}
    >
      <Stack p={1} pb={0}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          p={1.5}
          paddingInline={2}
          mb={2}
          border="1px solid #444"
          borderRadius={2}
          sx={{
            bgcolor: "#0d0d0dff",
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
                backgroundColor: "black",
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
                    backgroundColor: "black",
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
        gridTemplateColumns="repeat(auto-fill, minmax(500px, 1fr))"
        gap={2}
        p={1}
        pt={0}
      >
        {posts.length > 0 &&
          posts.map((p) => <PostCard key={p.id} post={p} width="auto" height="600px" />)}
      </Stack>
    </Stack>
  );
}
