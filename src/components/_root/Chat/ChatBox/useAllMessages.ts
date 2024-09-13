import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { MessageService } from "@/services/message.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IChat } from "@/shared/types/chat.interface";
import { IMessage } from "@/shared/types/message.interface";
import { Query, useQuery, useQueryClient } from "@tanstack/react-query";
import { create } from "mutative";

export const useAllMessages = (chatId: string) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { handleReadMessages } = useSocket();

  const { data: messages, isPending: isLoadingMessages } = useQuery({
    queryKey: [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
    queryFn: () => MessageService.getAll(chatId),
    enabled: !!chatId,
    staleTime: Infinity,
  });

  if (messages?.length) {
    const existUnReadMessages: IMessage[] =
      messages?.filter(
        (message) => message.sender._id !== user?._id && !message.isRead
      ) ?? [];

    if (existUnReadMessages?.length) {
      handleReadMessages({
        userId: existUnReadMessages[0].sender._id,
        chatId: existUnReadMessages[0].chat.toString(),
      });

      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return create(chats, (draft) => {
          const newChats = draft.map((chat) =>
            chat._id === existUnReadMessages[0].chat
              ? { ...chat, unreadMessagesCount: 0 }
              : chat
          );
          return newChats;
        });
      });
    }
  }

  return { messages, isLoadingMessages };
};
