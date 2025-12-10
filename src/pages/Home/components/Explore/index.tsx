import { useState, useEffect, useRef } from "react";
import {
  Stack,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  type SelectChangeEvent,
} from "@mui/material";
import { Public, ArrowUpward } from "@mui/icons-material";
import { useFeedExplore } from "../../../../hooks";
import { PostCard } from "../../../../components";
import {
  exploreTopBarContainerStyles,
  gridContainerStyles,
  inputLabelStyles,
  mainContainerStyles,
  paperPropStyles,
  selectStyles,
} from "./styles";
import { arrowUpwardButtonStyles, noPostContainerStyles } from "../styles";

type FilterType = "mostLiked" | "mostReacted" | "recent" | "oldest";

export function ExploreFeed() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [filter, setFilter] = useState<FilterType>("mostLiked");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { data, isLoading, fetchNextPage, hasNextPage } = useFeedExplore(
    filter,
    2
  );
  const allPosts = data?.pages.flatMap((page) => page.data) ?? [];

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

  const handleChange = (event: SelectChangeEvent<FilterType>) => {
    setFilter(event.target.value as FilterType);
  };

  return (
    <Stack ref={containerRef} sx={mainContainerStyles}>
      <Stack p={1} pb={0}>
        <Stack sx={exploreTopBarContainerStyles}>
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Typography color="white">Explore</Typography>
            <Public sx={{ color: "lightblue" }} />
          </Stack>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel sx={inputLabelStyles}>Filter By</InputLabel>
            <Select
              value={filter}
              onChange={handleChange}
              label="Filter"
              sx={selectStyles}
              MenuProps={{ PaperProps: { sx: paperPropStyles } }}
            >
              <MenuItem value="mostLiked">Most Liked</MenuItem>
              <MenuItem value="mostReacted">Most Reacted</MenuItem>
              <MenuItem value="recent">Recent</MenuItem>
              <MenuItem value="oldest">Oldest</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
      {isLoading && (
        <Stack sx={noPostContainerStyles}>
          <Typography color="white">Loading feed...</Typography>
        </Stack>
      )}
      {allPosts.length > 0 && (
        <Stack sx={gridContainerStyles}>
          {allPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              commentId={null}
              width="auto"
              height="600px"
            />
          ))}
          <div ref={loaderRef} />
        </Stack>
      )}
      {showScrollTop && (
        <IconButton onClick={scrollToTop} sx={arrowUpwardButtonStyles}>
          <ArrowUpward />
        </IconButton>
      )}
    </Stack>
  );
}
