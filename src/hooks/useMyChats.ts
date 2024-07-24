import { useQuery } from "@tanstack/react-query";
import { ChatService } from "../services/chat.service";
import { QUERY_KEYS } from "../shared/enums/queryKeys";

export const useMyChats = () => {
  const { data: chats, isPending: isLoadingChats } = useQuery({
    queryKey: [QUERY_KEYS.GET_MY_CHATS],
    queryFn: () => ChatService.getAll(),
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  return {
    chats,
    isLoadingChats,
  };
};
