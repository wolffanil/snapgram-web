import { useGetLikedPosts } from "./useLikedPosts";
import { GridPostList, SkeletonPostV2 } from "@/components/ui";

function LikedPosts() {
  const { posts, isLoadingPosts } = useGetLikedPosts();

  if (isLoadingPosts) return <SkeletonPostV2 numberOfPosts={3} />;
  return (
    <>
      {!posts?.length && (
        <p className="text-light-4">Нет понравившегося поста</p>
      )}

      <ul className="grid-container">
        <GridPostList posts={posts || []} />
      </ul>
    </>
  );
}

export default LikedPosts;
