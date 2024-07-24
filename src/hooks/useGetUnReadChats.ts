import { useMyChats } from "./useMyChats";

export const useGetUnReadChats = () => {
  const { chats } = useMyChats();

  let countUnReadChats: number = 0;

  if (chats?.length) {
    countUnReadChats =
      chats.filter((chat) => chat?.unreadMessagesCount > 0)?.length || 0;
  }

  return { countUnReadChats };
};
