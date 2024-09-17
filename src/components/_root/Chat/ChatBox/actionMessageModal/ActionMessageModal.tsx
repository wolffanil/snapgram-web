import { IMessage } from "@/shared/types/message.interface";
import { useState } from "react";
import { useActionMessage } from "./useActionMessage";

interface IActionMessageModal {
  onCloseModal?: () => void;
  message: IMessage;
}

function ActionMessageModal({ onCloseModal, message }: IActionMessageModal) {
  const isRepostMessage = message.type === "repost";

  const initailState = isRepostMessage
    ? message?.repostText
      ? message?.repostText
      : ""
    : message?.content
    ? message.content
    : "";

  const [text, setText] = useState(initailState);

  const { onClickButton, isLoading } = useActionMessage({
    messageId: message._id,
    onCloseModal,
  });

  const handleDeleteMessage = () => onClickButton("delete");

  const handleUpdateMessage = () => {
    if (initailState === text) return;
    onClickButton("update", {
      type: isRepostMessage ? "repost" : "text",
      text,
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-start">
      <label className=" text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-second-color mb-[9px] ">
        {isRepostMessage ? "Редактировать репост" : "Редактировать сообщение"}
      </label>
      <input
        onChange={(e) => setText(e.target.value)}
        value={text || ""}
        className="shad-input bg-main-color text-main-color w-full disabled:cursor-not-allowed disabled:opacity-50 placeholder:text-dark-2  dark:placeholder:text-light-1 focus-visible:ring-1 focus-visible:ring-offset-1 ring-offset-primary-600 dark:ring-offset-primary-500 max-sm:placeholder:text-[15px] !important"
        placeholder="сообщение"
        required
      />
      <div className=" mt-[10px] flex gap-x-[20px] max-sm:gap-x-[10px]">
        <button
          onClick={handleUpdateMessage}
          disabled={isLoading}
          className="flex justify-center items-center ml-auto w-[120px] h-[37px] rounded-[8px] font-semibold text-[14px] max-sm:min-w-[53px] max-sm:h-[40px] max-sm:rounded-[5px] max-sm:text-[13px] blue-color text-white"
        >
          {isLoading ? "Загрузка..." : "Редактировать"}
        </button>
        <button
          className="flex justify-center items-center ml-auto w-[82px] h-[37px] rounded-[8px] font-semibold text-[14px] max-sm:min-w-[53px] max-sm:h-[40px] max-sm:rounded-[5px] max-sm:text-[13px] bg-red text-white"
          onClick={handleDeleteMessage}
          disabled={isLoading}
        >
          {isLoading ? "Загрузка..." : "Удалить"}
        </button>
      </div>
    </div>
  );
}

export default ActionMessageModal;
