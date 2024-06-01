import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../services/chat.service";
import { IChat } from "../shared/types/chat.interface";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { useToast } from "./useToast";
import { getErrorMessage } from "../services/api/getErrorMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export const useCreateChat = (userId: string, name: string) => {
  const queryClient = useQueryClient();
  const { loadingToast, errorToast, successToast } = useToast();
  const navigate = useNavigate();
  const { setSelectedChat } = useAuth();

  const { mutateAsync: createChat, isPending: isCreatingChat } = useMutation({
    mutationKey: ["create chat"],
    mutationFn: () => ChatService.create(userId),
    onMutate: () => {
      loadingToast("Создание чата...");
    },
    onSuccess: (newChat: IChat) => {
      successToast(`Связь с ${name} подключена`);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MY_CHATS],
        (oldChats: IChat[]) => {
          if (oldChats.find((chat) => chat._id === newChat._id)) return;
          return [newChat, ...oldChats];
        }
      );
    },
    onError: (error: string) => {
      errorToast(getErrorMessage(error));
    },
  });

  const handleCreateChat = async () => {
    const newChat = await createChat();

    if (newChat) {
      navigate("/chats");

      setSelectedChat(newChat);
    }
  };

  return {
    handleCreateChat,
    isCreatingChat,
  };
};
