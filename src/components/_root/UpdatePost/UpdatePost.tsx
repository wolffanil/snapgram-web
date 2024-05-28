import { useGetPostById } from "../../../hooks/useGetPostById";
import { useTheme } from "../../../hooks/useTheme";
import { Loader, PostForm } from "../../ui";

function UpdatePost() {
  const { post, isPostLoading } = useGetPostById();
  if (isPostLoading) return <Loader />;
  const { isDarkMode } = useTheme();

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-[627px] flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
            className={`${!isDarkMode && "invert-black"}`}
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
