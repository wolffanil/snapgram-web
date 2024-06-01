import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../../../shared/enums/queryKeys";
import { MessageService } from "../../../../services/message.service";

export const useAllMessages = (chatId: string) => {
  const { data: messages, isPending: isLoadingMessages } = useQuery({
    queryKey: [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
    queryFn: () => MessageService.getAll(chatId),
    enabled: !!chatId,
    staleTime: Infinity,
  });

  return { messages, isLoadingMessages };
};