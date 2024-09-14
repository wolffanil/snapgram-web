import { Loader } from "lucide-react";
import { useGetPostById } from "../../../hooks/useGetPostById";
import { PostDetails } from "../../ui";
import { Navigate } from "react-router-dom";

function Post() {
  const { post, isPostLoading } = useGetPostById();

  if (isPostLoading)
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <Loader className="invert-black dark:invert-white" />
      </div>
    );

  if (!post?._id) return <Navigate to="/" />;
  return <PostDetails post={post} />;
}

export default Post;
