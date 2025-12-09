import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  type SelectChangeEvent,
} from "@mui/material";
import { Public } from "@mui/icons-material";
import { useFeedExplore } from "../../../../hooks";
import { PostCard } from "../../../../components";

type FilterType = "mostLiked" | "mostReacted" | "recent" | "oldest";

export function ExploreFeed() {
  const [filter, setFilter] = useState<FilterType>("mostLiked");

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useFeedExplore(filter, 20);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleChange = (event: SelectChangeEvent<FilterType>) => {
    setFilter(event.target.value as FilterType);
  };

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
          sx={{ bgcolor: "#0d0d0dff" }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
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
                "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#666" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                ".MuiSvgIcon-root": { color: "white" },
              }}
              MenuProps={{
                PaperProps: { sx: { backgroundColor: "black", color: "white" } },
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
      {allPosts.length > 0 ? (
        <Stack
          display="grid"
          gridTemplateColumns="repeat(auto-fill, minmax(500px, 1fr))"
          gap={2}
          p={1}
          pt={0}
        >
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              commentId={null}
              width="auto"
              height="600px"
            />
          ))}
          <div ref={loaderRef} style={{ height: "40px" }}>
            {isFetchingNextPage && <CircularProgress size={35} />}
          </div>
        </Stack>
      ) : (
        <Stack>
          {isLoading ? (
            <CircularProgress size={40} />
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
