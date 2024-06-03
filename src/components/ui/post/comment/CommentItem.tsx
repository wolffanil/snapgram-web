import { useNavigate } from "react-router-dom";
import { useLike } from "../../../../hooks/useLike";
import { IComment } from "../../../../shared/types/comment.interface";
import { getMedia } from "../../../../utils";

interface ICommentItem {
  comment: IComment;
  isParent?: boolean;
}

function CommentItem({ comment, isParent }: ICommentItem) {
  const navigate = useNavigate();
  const { count, isLike, onLike } = useLike(
    comment._id,
    comment.likes,
    "",
    "",
    "comment"
  );

  return (
    <div
      className={`flex mb-2 w-[99%] items-start
${isParent ? "bg-slate-400" : ""} `}
      key={comment._id}
    >
      <div className="flex gap-[8px] w-full">
        <img
          src={getMedia(comment.author?.imageUrl || "")}
          alt="profile"
          className="h-6 w-6 rounded-full"
        />

        <div className="flex flex-col gap-y-1">
          <p className="small-medium lg:base-regular pr break-all mr-1 text-main-color max-sm:text-[10px]">
            <span className="text-light-3 max-sm:!text-[14px]">
              {comment.author.name}
            </span>{" "}
            {comment.text}
          </p>

          {/* <button
            className="text-[10px] lg:text-[13px] flex items-center gap-2"
            onClick={() => navigate(`/comments/${comment._id}`)}
          >
            <img
              src="/assets/icons/reply.svg"
              alt="icon"
              width={14}
              height={14}
            />
            ответить
          </button> */}
        </div>
      </div>

      <div className="flex items-center gap-1 mt-1">
        <img
          src={isLike ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={16}
          height={16}
          onClick={onLike}
          className="cursor-pointer"
        />

        <p className="text-[10px] text-light-3">{count || 0}</p>
      </div>
    </div>
  );
}

export default CommentItem;
