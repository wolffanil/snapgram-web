import { IMessage } from "@/shared/types/message.interface";
import { formatDateString, getMedia } from "@/utils";
import cn from "clsx";
import RepostMessage from "./diffirentMessage/RepostMessage";
import Settings from "./Settings";

interface IMessageItem {
  message: IMessage;
  myId: string;
  isGroupChat: boolean;
}

function MessageItem({ myId, message, isGroupChat }: IMessageItem) {
  const {
    _id,
    createdAt,
    content,
    imageUrl,
    sender,
    isRead,
    post,
    repostText,
    type,
  } = message;
  const isMyMessage = sender?._id === myId;

  return (
    <li
      className={cn(
        `flex flex-col mt-[20px] max-sm:mt-[15px] items-start gap-y-[7px] max-sm:gap-y-[3px] pr-4 `,
        {
          "!items-end": isMyMessage,
          "ml-[auto]": isMyMessage,
          "mr-[auto] ": !isMyMessage,
          "max-w-[83%]": type !== "repost",
        }
      )}
    >
      <div
        className={cn(
          "flex items-end min-h-[50px] max-sm:min-h-[34px] w-full",
          {
            "!flex-row-reverse": isMyMessage,
          }
        )}
      >
        <svg
          width="19"
          height="19"
          viewBox="0 0 19 19"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-[23px] w-[28px] mr-[-22px] max-sm:mr-[-14px] max-sm:mb-[-6px] max-sm:h-[30px] max-sm:w-[17px]   ${
            isMyMessage && "ml-[-15px] max-sm:ml-[-11px]"
          }`}
        >
          <path
            d="M7.68038 1.81516C8.40283 0.290185 10.5728 0.290189 11.2952 1.81516L18.0834 16.1437C18.712 17.4706 17.7442 19 16.2759 19H2.69966C1.23138 19 0.26361 17.4706 0.892229 16.1437L7.68038 1.81516Z"
            fill="#F6F6F6"
            className={`${
              isMyMessage
                ? "fill-primary-600 dark:fill-primary-500"
                : "fill-light-5 dark:fill-dark-4 max-sm:fill-[#EFEFEF]"
            }`}
          />
        </svg>

        <div
          className={cn(
            `rounded-[10px]  flex flex-center gap-y-[10px] min-h-[50px] max-sm:min-h-[34px] max-w-full min-w-[70px]  max-sm:min-w-[80px]  ${
              isMyMessage
                ? "message-my-bg-color ml-[10px]"
                : "message-companion-bg-color max-sm:bg-[#EFEFEF] ml-[7px] max-sm:ml-[4px]"
            } 
          `,
            {
              "px-0": type === "repost",
              "max-sm:max-w-[80%] px-[24px] max-sm:px-[15px]":
                type !== "repost",
            }
          )}
        >
          {content && (
            <p
              className={`text-[16px] text-main-color font-medium  text-wrap max-sm:text-[16px] w-full max-xl:max-w-[300px]  ${
                isMyMessage && "!text-white"
              }`}
            >
              {content}
            </p>
          )}
          {imageUrl && (
            <img
              src={getMedia(imageUrl)}
              alt="photo"
              className="w-full max-h-[300px] max-sm:max-h-[200px] object-cover"
            />
          )}
          {type === "repost" && (
            <RepostMessage
              isMyMessage={isMyMessage}
              post={post}
              repostText={repostText || ""}
            />
          )}
        </div>

        {isMyMessage && <Settings message={message} />}
      </div>
      <div className="flex items-center gap-1 mr-[-14px]">
        <span className="text-light-4 text-[12px] max-sm:text-[10px]">
          {formatDateString(createdAt)}
        </span>
        {isMyMessage && !isGroupChat && (
          <img
            src={`/assets/icons/read/${isRead ? "check-all.svg" : "check.svg"}`}
            alt="status"
            className="object-contain w-[26px] h-[26px] max-sm:w-[18px] max-sm:h-[18px]"
          />
        )}
      </div>
    </li>
  );
}

export default MessageItem;
