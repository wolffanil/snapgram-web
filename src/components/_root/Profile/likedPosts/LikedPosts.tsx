import { Loader } from "lucide-react";
import { useGetLikedPosts } from "./useLikedPosts";
import { GridPostList } from "../../../ui";

function LikedPosts() {
  const { posts, isLoadingPosts } = useGetLikedPosts();

  if (isLoadingPosts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
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
