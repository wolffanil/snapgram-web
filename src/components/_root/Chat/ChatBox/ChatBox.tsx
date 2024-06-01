import { useAuth } from "../../../../hooks/useAuth";
import { useAllMessages } from "./useAllMessages";
import { getMedia, getСompanion } from "../../../../utils";
import MessageItem from "./MessageItem";
import WriteMessage from "./writeMessage/WriteMessage";
import { Link } from "react-router-dom";

function ChatBox() {
  const { selectedChat, user, setSelectedChat } = useAuth();
  const { messages, isLoadingMessages } = useAllMessages(
    selectedChat?._id || ""
  );

  if (!selectedChat?._id)
    return (
      <div className=" w-[63%] text-main-color  text-[26px] flex-center max-sm:hidden">
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
      } md:flex flex-col w-[61%] max-md:w-[67%] max-sm:w-full border rounded-[20px] border-main-color sidebar-bg-color pl-[27px] pr-[40px] pt-[27px] pb-[38px]  max-sm:bg-main-color max-sm:border-[0px] max-sm:rounded-[0px] max-sm:pl-[0px] max-sm:pr-[0px] max-sm:py-[0px] `}
    >
      <div
        className="flex items-center gap-x-[16px]
      max-sm:gap-x-[25px]"
      >
        <div className="flex items-center">
          <button
            className="mr-[6px] hidden max-sm:block"
            onClick={handleBackForMobile}
          >
            <img
              src="/assets/icons/back-chat.svg"
              alt="back"
              className="bg-primary-600 dark:bg-primary-500 w-[26px] h-[17px]"
            />
          </button>
          <Link to={`/profile/${companion._id}`}>
            <div className="relative">
              <img
                src={getMedia(companion?.imageUrl || "")}
                alt="photoProfile"
                className="h-[70px] w-[70px] max-sm:h-[60px] max-sm:w-[56px] object-cover rounded-[45px] max-sm:rounded-[43px]"
              />
              {companion?.isOnline && (
                <div className="absolute w-[15px] h-[15px] bg-[#00ff75] border-[1.5px] border-white right-0 bottom-0 rounded-[24px]" />
              )}
            </div>
          </Link>
        </div>
        <div className="flex flex-col justify-around items-start">
          <p className="text-[20px] text-main-color font-bold max-sm:text-[18px]">
            {companion?.name}
          </p>
          <p className="text-[14px] text-light-3 max-sm:text-[12px]">
            {companion?.isOnline ? "Онлайн" : "Оффлайн"}
          </p>
        </div>
      </div>

      <div className="w-full h-[1px] bg-light-3 mt-[27px] max-sm:mt-[13px]" />

      <div className="flex flex-col w-full min-h-[550px] max-h-[550px] max-sm:min-h-[445px] max-sm:max-h-[445px] mt-[57px] max-sm:mt-[24px] overflow-y-scroll custom-scrollbar-without">
        {isLoadingMessages ? (
          <p>Загрузка сообщений</p>
        ) : (
          messages?.map((m, i) => (
            <MessageItem key={i} message={m} myId={user?._id || ""} />
          ))
        )}
      </div>

      <div className="w-full h-[1px] bg-light-3 mb-[30px] max-sm:mb-[20px]" />

      <WriteMessage key={selectedChat?._id} />
    </div>
  );
}

export default ChatBox;
