import { useEffect, useState } from "react";
import { useWriteMessage } from "./useWriteMessage";
import { useSocket } from "@/hooks/useSocket";

function WriteMessage() {
  const { handleSendMessage, message, setMessage } = useWriteMessage();
  const { handleTyping, handleStopTyping } = useSocket();

  const [typing, setTyping] = useState(false);

  const handleClickKeyboard = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;

    handleStopTyping();
    handleSendMessage();
  };

  const typingHandler = (e: any) => {
    setMessage(e.target.value);
    if (!typing) {
      setTyping(true);

      handleTyping();
    }

    let lastTypingTime = new Date().getTime();

    const timerLength = 2000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        // socket.emit("stop typing", selectedChat._id);
        handleStopTyping();
        setTyping(false);
      }
    }, timerLength);
  };

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
          onChange={typingHandler}
          placeholder={`${
            isMobile ? "Напишите сообщение" : "Напишите свое сообщение здесь..."
          }`}
          className="w-full text-[16px] font-normal text-light-3 placeholder:text-light-3  border-[0px] bg-main-color"
          onKeyDown={handleClickKeyboard}
        />
      </div>
      <button
        onClick={() => {
          // socket.emit("stop typing", selectedChat._id);
          handleSendMessage();
        }}
        className="flex-center w-[54px] h-full main-color  rounded-[10px]"
      >
        <img src="/assets/icons/send.svg" alt="send" />
      </button>
    </div>
  );
}

export default WriteMessage;
