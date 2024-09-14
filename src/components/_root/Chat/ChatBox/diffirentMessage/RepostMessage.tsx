import { IPost } from "@/shared/types/post.interface";
import {
  formatDateString,
  getDefaultPostImage,
  getDefaultProfileImage,
  getMedia,
} from "@/utils";
import { Link } from "react-router-dom";

interface IRepostMessage {
  isMyMessage: boolean;
  post: IPost;
  repostText: string;
}

function RepostMessage({ isMyMessage, post, repostText }: IRepostMessage) {
  return (
    <div
      className={`flex flex-1 flex-col justify-between py-[12px] w-[337px] max-sm:w-[239px] ${
        isMyMessage ? "!text-white" : "text-black dark:text-white"
      }`}
    >
      <div className="flex justify-start items-center gap-x-[10px] pl-[17px]">
        <Link to={`/profile/${post?.creator._id}`}>
          <img
            src={getMedia(post?.creator.imageUrl || "")}
            alt="logo"
            onError={getDefaultProfileImage}
            className="size-[37px] rounded-full object-cover cursor-pointer"
          />
        </Link>
        <div className="flex flex-col items-start">
          <p className="text-[17px] font-semibold max-sm:text-[11px]">
            {post?.creator.name}
          </p>
          <p className="text-[12px] font-medium max-sm:text-[10px] line-clamp-1">
            {formatDateString(post?.createdAt || "")} - {post?.location}
          </p>
        </div>
      </div>
      <img
        src={getMedia(post?.imageUrl || "")}
        alt="image"
        className="w-full h-[260px] max-sm:h-[215px] object-cover mt-[12px] mb-[5px]"
        onError={getDefaultPostImage}
      />
      {repostText && (
        <p className="pl-[17px] text-[16px] font-medium max-sm:text-[14px] pr-[17px]">
          Текст пользователя: {repostText}
        </p>
      )}
      <p className="font-semibold text-[16px] pl-[17px] max-sm:text-[15px] ">
        {post?.caption}
      </p>
      <Link
        to={`/posts/${post?._id}`}
        className="text-[14px] max-sm:text-[13px] underline font-medium pl-[17px]"
      >
        ссылка на пост
      </Link>
    </div>
  );
}

export default RepostMessage;
