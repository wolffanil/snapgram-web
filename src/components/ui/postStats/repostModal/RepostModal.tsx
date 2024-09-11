import { useMyChats } from "@/hooks/useMyChats";
import Loader from "../../Loader";
import { useAuth } from "@/hooks/useAuth";
import ChatRep from "./ChatRep";
import { getСompanion } from "@/utils";
import { IPost } from "@/shared/types/post.interface";
import { useState } from "react";

interface IRepostModal {
  post: IPost;
  onCloseModal?: () => void;
}

function RepostModal({ post, onCloseModal }: IRepostModal) {
  const { chats, isLoadingChats } = useMyChats();

  const { user } = useAuth();

  const [respostText, setRepostText] = useState("");

  return (
    <div className="w-full h-full flex flex-col">
      <label className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-second-color mb-[9px] ">
        Написать сообщение
      </label>
      <input
        onChange={(e) => setRepostText(e.target.value)}
        value={respostText || ""}
        className="shad-input bg-main-color text-main-color w-full disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-dark-2  dark:placeholder:text-light-1 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-primary-600 dark:ring-offset-primary-500 max-sm:placeholder:text-[15px] !important"
        placeholder="Сообщение"
      />

      <ul className="flex flex-col flex-1 h-[400px] max-h-[400px] overflow-y-scroll gap-y-[14px] custom-scrollbar max-sm:max-h-[275px] max-sm:h-[275px] mt-4">
        {isLoadingChats ? (
          <Loader />
        ) : chats?.length ? (
          chats.map((chat) => {
            const n = chat?.isGroupChat
              ? 0
              : getСompanion(chat?.users, user?._id || "");
            return (
              <ChatRep
                key={chat._id}
                chat={chat}
                n={n}
                post={post}
                repostText={respostText}
                setRepostText={setRepostText}
                onCloseModal={onCloseModal}
              />
            );
          })
        ) : (
          <h3 className="text-main-color text-[23px]">Нету чатов</h3>
        )}
      </ul>
    </div>
  );
}

export default RepostModal;

// const n = chat?.isGroupChat
//               ? 0
//               : getСompanion(chat?.users, user?._id || "");
