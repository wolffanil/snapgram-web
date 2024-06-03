import { useEffect } from "react";
import { useWriteMessage } from "./useWriteMessage";

function WriteMessage() {
  const { handleSendMessage, message, setMessage } = useWriteMessage();

  let isMobile;

  useEffect(() => {
    const changeSreen = () => {
      isMobile = window.innerWidth < 768;
    };

    document.addEventListener("resize", changeSreen);

    return () => {
      document.removeEventListener("resize", changeSreen);
    };
  }, []);

  return (
    <div className="flex items-start w-full gap-x-[7px] h-[54px] max-sm:h-[51px]">
      <div className="flex items-center px-[20px] gap-x-[10px] max-sm:gap-x-[4px] bg-main-color rounded-[10px] h-full w-full">
        <button>
          <img src="/assets/icons/clip.svg" alt="add" />{" "}
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`${
            isMobile ? "Напишите сообщение" : "Напишите свое сообщение здесь..."
          }`}
          className="w-full text-[16px] font-normal text-light-3 placeholder:text-light-3  border-[0px] bg-main-color"
        />
      </div>
      <button
        onClick={handleSendMessage}
        className="flex-center w-[54px] h-full main-color  rounded-[10px]"
      >
        <img src="/assets/icons/send.svg" alt="send" />
      </button>
    </div>
  );
}

export default WriteMessage;
