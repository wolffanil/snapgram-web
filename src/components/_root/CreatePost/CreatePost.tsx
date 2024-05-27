import { useTheme } from "../../../hooks/useTheme";
import { PostForm } from "../../ui";
import cn from "clsx";

const CreatePost = () => {
  const { isDarkMode } = useTheme();
  return (
    <div className="flex flex-1">
      <div className="common-container ">
        <div className="max-w-[627px] flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
            className={cn("", {
              "!fill-black": !isDarkMode,
            })}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
            Создать пост
          </h2>
        </div>

        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
