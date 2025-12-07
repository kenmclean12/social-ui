import { usePostFindOne } from "../../../hooks";
import { PostCard } from "../PostCard";
import type { PostResponseDto } from "../../../types";
import { UniversalDialog } from "../../UniversalDialog";

interface Props {
  postId: number | null;
  open: boolean;
  onClose: () => void;
}

export function PostDialog({ open, postId, onClose }: Props) {
  const { data: post, isLoading } = usePostFindOne(postId as number);

  return (
    <UniversalDialog
      open={open}
      onClose={onClose}
      title="Post"
      hasContent={!!post}
      loading={isLoading}
      emptyMessage="Post not found"
      content={<PostCard post={post as PostResponseDto} width="100%" />}
    />
  );
}
