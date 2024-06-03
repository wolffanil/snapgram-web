import ChatBox from "./ChatBox/ChatBox";
import MyChatsBox from "./MyChats/MyChatsBox";

function Chat() {
  return (
    <section className="flex flex-1 w-full h-[94%]  justify-between pl-[32px] pr-[28px] mt-[48px] mb-[38px] max-md:mt-[43px] max-md:mb-[12px] max-md:mx-[50px] max-sm:mt-[15px] max-sm:mx-[18px] max-sm:mb-[13px] max-sm:pl-[0px] max-sm:pr-[0px] overflow-x-hidden ">
      <MyChatsBox />
      <ChatBox />
    </section>
  );
}

export default Chat;
