import { IChat } from "@/shared/types/chat.interface";
import { getMedia } from "@/utils";
import { Dispatch, SetStateAction } from "react";

interface IChatItem {
  chat: IChat;
  n: number;
  setSelectedChat: Dispatch<SetStateAction<IChat | null>>;
}

function ChatItem({ chat, n, setSelectedChat }: IChatItem) {
  const companion = chat.users[n];

  return (
    <li
      className="flex w-full pb-[29px] max-sm:pb-[9px] gap-x-[10px] max-sm:gap-x-[16px] max-h-[348px] max-sm:max-h-[315px] bg-main-color items-center border-b border-main-color i"
      onClick={() => setSelectedChat(chat)}
    >
      <img
        src={getMedia(companion?.imageUrl || "")}
        alt="profileImg"
        className="w-[70px] h-[70px] max-sm:w-[56px] max-sm:h-[56px] object-cover rounded-[43px]"
      />

      <div className="flex flex-col justify-around items-start">
        <p className="text-[22px] text-main-color font-semibold max-sm:text-[18px]">
          {companion.name}
        </p>
        <p className="text-[16px] text-light-3 max-sm:text-[12px] font-normal">
          {chat?.latestMessage?.content!?.length > 15
            ? chat?.latestMessage.content?.slice(0, 15) + "..." || ""
            : chat?.latestMessage?.content || ""}
        </p>
      </div>

      <div
        className={`h-[14px] w-[14px] max-sm:h-[10px] max-sm:w-[10px] ml-auto rounded-[20px] ${
          companion.isOnline ? "bg-[#00FF75]" : "bg-light-3"
        }`}
      />
    </li>
  );
}

export default ChatItem;
