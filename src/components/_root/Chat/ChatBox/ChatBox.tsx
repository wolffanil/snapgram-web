import { useAllMessages } from "./useAllMessages";
import MessageItem from "./MessageItem";
import WriteMessage from "./writeMessage/WriteMessage";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { useAuth } from "@/hooks/useAuth";
import { IMessage } from "@/shared/types/message.interface";
import {
  formatDateString,
  getDefaultPostImage,
  getDefaultProfileImage,
  getMedia,
  getСompanion,
} from "@/utils";
import SkeletonMessage from "./SkeletonMessage";

function ChatBox() {
  const { selectedChat, user, setSelectedChat } = useAuth();
  const { messages, isLoadingMessages } = useAllMessages(
    selectedChat?._id || ""
  );

  const Row = useMemo(
    () => (i: number, m: IMessage) => {
      return (
        <MessageItem
          isGroupChat={selectedChat?.isGroupChat || false}
          key={i}
          message={m}
          myId={user?._id || ""}
        />
      );
    },
    []
  );

  if (!selectedChat?._id)
    return (
      <div className=" w-[63%] text-main-color  text-[26px] flex-center max-xl:hidden">
        Веберите чат
      </div>
    );

  const n = getСompanion(selectedChat?.users || [], user?._id || "");

  const companion = selectedChat?.users[n];

  const handleBackForMobile = () => setSelectedChat(null);

  return (
    <div
      className={`${
        selectedChat?._id ? "flex" : "hidden"
      } xl:flex flex-col xl:max-w-[666px]  w-full border rounded-[20px] border-main-color sidebar-bg-color pl-[27px] pr-[40px] pt-[27px] pb-[38px]  max-sm:bg-main-color max-sm:border-[0px] max-sm:rounded-[0px] max-sm:pl-[0px] max-sm:pr-[0px] max-sm:py-[0px] `}
    >
      <div
        className="flex items-center gap-x-[16px]
      max-sm:gap-x-[25px] "
      >
        <div className="flex-center items-center">
          <button
            className="mr-[6px] hidden max-xl:block w-[26px] h-[17px]"
            onClick={handleBackForMobile}
          >
            <img
              src="/assets/icons/back-chat.svg"
              alt="back"
              className="!w-[26px] !h-[17px] object-cover"
            />
          </button>
          <Link to={`/profile/${companion._id}`}>
            <div className="relative w-[70px] max-sm:w-[56px]">
              <img
                src={getMedia(companion?.imageUrl || "")}
                alt="photoProfile"
                className="h-[70px] w-[70px] max-sm:h-[60px] max-sm:min-w-[60px] object-cover rounded-[45px] max-sm:rounded-[43px]"
                onError={getDefaultProfileImage}
              />
              {companion?.isOnline && (
                <div className="absolute w-[15px] h-[15px] bg-[#00ff75] border-[1.5px] border-white right-0 bottom-0 rounded-[24px]" />
              )}
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-around items-start w-full">
          <p className="text-[20px] text-main-color font-bold max-sm:text-[18px]">
            {companion?.name}
          </p>
          <p className="text-[14px] text-light-3 max-sm:text-[12px]">
            {!selectedChat?.isTyping
              ? companion?.isOnline
                ? "Онлайн"
                : `последнее посещение ${formatDateString(companion.updatedAt)}`
              : "Печетает..."}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-light-3 mt-[27px] max-sm:mt-[13px]" />

      <div className="flex flex-col  max-sm:min-h-[72%] max-sm:max-h-[72%] mt-[57px] max-sm:mt-[24px]  custom-scrollbar-without flex-1 overflow-y-auto ">
        {isLoadingMessages ? (
          <SkeletonMessage numberOfMessage={5} />
        ) : messages?.length ? (
          <ScrollableFeed className="custom-scrollbar-without !min-h-full flex-1">
            {messages?.length && messages.map((m, i) => Row(i, m))}
          </ScrollableFeed>
        ) : (
          <p className="text-main-color flex-center">Сообщении нету</p>
        )}
      </div>

      <div className="w-full h-[1px] bg-light-3 mb-[30px] max-sm:mb-[20px]" />

      <WriteMessage key={selectedChat?._id} />
    </div>
  );
}

export default ChatBox;
