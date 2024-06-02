import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatService } from "../services/chat.service";
import { IChat } from "../shared/types/chat.interface";
import { QUERY_KEYS } from "../shared/enums/queryKeys";
import { getErrorMessage } from "../services/api/getErrorMessage";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import toast from "react-hot-toast";

export const useCreateChat = (userId: string, name: string) => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const { setSelectedChat } = useAuth();

  const { mutateAsync: createChat, isPending: isCreatingChat } = useMutation({
    mutationKey: ["create chat"],
    mutationFn: () => ChatService.create(userId),

    onSuccess: (newChat: IChat) => {
      toast.success(`Связь с ${name} подключена`);

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MY_CHATS],
        (oldChats: IChat[]) => {
          if (oldChats.find((chat) => chat._id === newChat._id)) return;
          return [newChat, ...oldChats];
        }
      );
    },
    onError: (error: string) => {
      toast.error(getErrorMessage(error));
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
