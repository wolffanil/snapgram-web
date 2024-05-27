import { useParams } from "react-router-dom";
import { useGetPostById } from "../../../hooks/useGetPostById";
import { Loader, PostForm } from "../../ui";

function UpdatePost() {
  const { id } = useParams();

  const { post, isPostLoading } = useGetPostById(id || "");
  if (isPostLoading) return <Loader />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-[627px] flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
            Редактировать пост
          </h2>
        </div>

        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
}

export default UpdatePost;
