import { Loader } from "lucide-react";
import { useLike } from "../../../hooks/useLike";
import { IPost } from "../../../shared/types/post.interface";
import { useSave } from "./useSave";
import { useLocation } from "react-router-dom";
import cn from "clsx";
import Modal from "../Modal";
import RepostModal from "./repostModal/RepostModal";
import WrapperModal from "../WrapperModal";

interface IPostStats {
  post: IPost;
}

const changeStyle = ["/saved", "/explore"];

function PostStats({ post }: IPostStats) {
  const { count, isLike, onLike } = useLike(
    post?._id,
    post?.likes,
    post?.creator._id || "",
    post
  );

  const { isSave, onSave, isLoading } = useSave(
    post._id,
    post.saves,
    post?.creator._id || "",
    post
  );

  const { pathname } = useLocation();
  const change = changeStyle.includes(pathname);

  return (
    <div className="flex justify-between items-center z-20">
      <div className={`flex ${!change && "gap-[20px]"}`}>
        <div className="flex gap-2 mr-5 lg:mr-[32px]">
          <img
            src={isLike ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
            alt="like"
            width={20}
            height={20}
            onClick={onLike}
            className="cursor-pointer"
          />

          <p
            className={cn("small-medium lg:base-medium text-main-color", {
              "!text-white": change,
            })}
          >
            {count || 0}
          </p>
        </div>

        <div className="flex gap-2 mr-5 lg:mr-[32px]">
          <img
            src="/assets/icons/comment.svg"
            alt="comment"
            width={20}
            height={20}
          />

          <p
            className={cn("small-medium lg:base-medium text-main-color", {
              "!text-white": change,
            })}
          >
            {post?.comments?.length || post?.commentsCount || 0}
          </p>
        </div>

        {!change && (
          <Modal>
            <Modal.Open opens="repost">
              <div className="flex gap-2 mr-5 lg:mr-[32px] cursor-pointer">
                <img
                  src="/assets/icons/repost.svg"
                  alt="repost"
                  width={20}
                  height={20}
                />

                <p className="small-medium lg:base-medium text-main-color">
                  {post?.countRepost || 0}
                </p>
              </div>
            </Modal.Open>

            <Modal.Window name="repost">
              <WrapperModal title="Репост" containerStyle="w-[600px]">
                <RepostModal post={post} />
              </WrapperModal>
            </Modal.Window>
          </Modal>
        )}
      </div>

      <div className="flex gap-2">
        {isLoading ? (
          <Loader className="invert-black dark:invert-white" />
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
