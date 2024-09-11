import { IChat } from "@/shared/types/chat.interface";
import { IPost } from "@/shared/types/post.interface";
import { getDefaultImageProfile, getMedia } from "@/utils";
import { Dispatch, SetStateAction } from "react";
import { useRepost } from "./useRepost";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface IChatRep {
  chat: IChat;
  n: number;
  repostText: string;
  setRepostText: Dispatch<SetStateAction<string>>;
  post: IPost;
  onCloseModal?: () => void;
}

function ChatRep({
  chat,
  n,
  repostText,
  setRepostText,
  post,
  onCloseModal,
}: IChatRep) {
  const companion = chat.users[n];

  const { handleSendRepost, isSendedRepost, isSendingRepost } = useRepost(
    setRepostText,
    chat,
    post
  );

  const navigate = useNavigate();

  const { setSelectedChat } = useAuth();

  const handelClick = () => {
    if (isSendedRepost) {
      setSelectedChat(chat);
      onCloseModal?.();
      navigate("/chats");
      return;
    }
    handleSendRepost(repostText);
  };

  return (
    <li className="w-full flex bg-main-color pt-[10px] pb-[5px] px-[16px] rounded-[15px] min-h-[68px] max-sm:min-h-[58px] max-sm:rounded-[10px] max-sm:px-[10px] max-sm:pt-[8px] max-sm:pb-[2px] items-center">
      <img
        src={getMedia(companion.imageUrl)}
        alt="device"
        className=" w-[47px] h-[47px] rounded-full object-cover max-sm:w-[33px] max-sm:h-[33px]"
        onError={(e) => (e.currentTarget.src = getDefaultImageProfile)}
      />

      <div className="flex flex-col gap-y-[1px] ml-[17px] text-main-color font-medium text-[14px] max-sm:ml-[10px] max-sm:text-[12px]">
        <p>{companion.name || "user"}</p>
      </div>

      <button
        className={`flex justify-center items-center ml-auto w-[82px] h-[37px] rounded-[8px] font-semibold text-[14px] max-sm:w-[53px] max-sm:h-[23px] max-sm:rounded-[5px] max-sm:text-[9px] ${
          isSendedRepost
            ? "bg-second-color text-main-color"
            : "blue-color text-white "
        }`}
        disabled={isSendingRepost}
        onClick={handelClick}
      >
        {isSendedRepost ? "Чат" : "Отправить"}
      </button>
    </li>
  );
}

export default ChatRep;
