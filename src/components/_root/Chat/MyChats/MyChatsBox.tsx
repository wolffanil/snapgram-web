import { useTheme } from "../../../../hooks/useTheme";
import cn from "clsx";
import ChatItem from "./ChatItem";
import { useAuth } from "../../../../hooks/useAuth";
import { getСompanion } from "../../../../utils";
import { useMyChats } from "../../../../hooks/useMyChats";

function MyChatsBox() {
  const { chats, isLoadingChats } = useMyChats();
  const { isDarkMode } = useTheme();
  const { selectedChat, setSelectedChat, user } = useAuth();

  return (
    <div
      className={`${
        selectedChat ? "hidden" : "flex"
      } md:flex flex-col items-start gap-y-[64px] max-sm:gap-y-[25px] md:mt-[46px] w-[35%] max-sm:w-full`}
    >
      <div className="w-full flex-start gap-3 justify-start">
        <img
          src="/assets/icons/chat.svg"
          alt="add"
          width={32}
          height={32}
          className={cn("invert-white", {
            "invert-black": !isDarkMode,
          })}
        />
        <h2 className="h3-bold md:h2-bold text-left w-full text-main-color">
          Чаты
        </h2>
      </div>

      {isLoadingChats ? (
        <h3 className="text-main-color text-[23px]">Загрузка чатов</h3>
      ) : chats?.length ? (
        <div className="flex flex-col gap-y-[27px] max-sm:gap-y-[8px] items-start w-full">
          {chats.map((chat, index) => {
            const n = chat.isGroupChat
              ? 0
              : getСompanion(chat?.users, user?._id || "");
            return (
              <ChatItem
                key={index}
                chat={chat}
                setSelectedChat={setSelectedChat}
                n={n}
              />
            );
          })}
        </div>
      ) : (
        <h3 className="text-main-color text-[23px]">Нету чатов</h3>
      )}
    </div>
  );
}

export default MyChatsBox;
