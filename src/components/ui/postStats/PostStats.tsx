import { Loader } from "lucide-react";
import { useLike } from "../../../hooks/useLike";
import { IPost } from "../../../shared/types/post.interface";
import { useSave } from "./useSave";

interface IPostStats {
  post: IPost;
}

function PostStats({ post }: IPostStats) {
  const { count, isLike, onLike } = useLike(post?._id, post?.likes);

  const { isSave, onSave, isLoading } = useSave(post._id, post.saves);

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-[20px]">
        <div className="flex gap-2 mr-5 lg:mr-[32px]">
          <img
            src={isLike ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={onLike}
            className="cursor-pointer"
          />

          <p className="small-medium lg:base-medium">{count || ""}</p>
        </div>

        <div className="flex gap-2 mr-5 lg:mr-[32px]">
          <img
            src="/assets/icons/comment.svg"
            alt="comment"
            width={20}
            height={20}
          />

          <p className="small-medium lg:base-medium">
            {post?.comments.length || ""}
          </p>
        </div>

        <div className="flex gap-2 mr-5 lg:mr-[32px]">
          <img
            src="/assets/icons/repost.svg"
            alt="repost"
            width={20}
            height={20}
          />

          <p className="small-medium lg:base-medium">
            {post?.countRepost || ""}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {isLoading ? (
          <Loader />
        ) : (
          <img
            src={isSave ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={onSave}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
}

export default PostStats;
