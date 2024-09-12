import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { MessageService } from "@/services/message.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IMessage, IUpdateMessage } from "@/shared/types/message.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

interface IUseActionMessage {
  messageId: string;
  onCloseModal?: () => void;
}

export const useActionMessage = ({
  messageId,
  onCloseModal,
}: IUseActionMessage) => {
  const queryClient = useQueryClient();

  const { selectedChat } = useAuth();

  const { handleActionMessage } = useSocket();

  const { mutate: updateMessage, isPending: isUpdatingMessage } = useMutation({
    mutationKey: ["update message"],
    mutationFn: (data: IUpdateMessage) => MessageService.edit(messageId, data),
    onSuccess(data, variables) {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, selectedChat?._id],
        (oldMessages: IMessage[]) => {
          if (!oldMessages?.length) return [];

          return oldMessages.map((message) =>
            message._id === messageId
              ? message.type === "repost"
                ? { ...message, repostText: variables.text }
                : { ...message, content: variables.text }
              : message
          );
        }
      );

      handleActionMessage({ messageId, text: variables.text, type: "update" });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MY_CHATS],
      });
      onCloseModal?.();
    },
  });

  const { mutate: deleteMessage, isPending: isDeletingMessage } = useMutation({
    mutationKey: ["delete message"],
    mutationFn: () =>
      MessageService.delete(messageId, { chatId: selectedChat?._id || "" }),
    onSuccess() {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, selectedChat?._id],
        (oldMessages: IMessage[]) => {
          if (!oldMessages?.length) return [];

          return oldMessages.filter((message) => message._id !== messageId);
        }
      );

      handleActionMessage({ messageId, text: "", type: "delete" });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_MY_CHATS],
      });
      onCloseModal?.();
    },
  });

  const onClickButton = (type: "update" | "delete", data?: IUpdateMessage) => {
    if (type === "update") {
      if (!data) return;
      updateMessage(data);
      return;
    }

    if (type === "delete") {
      deleteMessage();
      return;
    }
  };

  return useMemo(
    () => ({
      onClickButton,
      isLoading: isDeletingMessage || isUpdatingMessage,
    }),
    [isDeletingMessage, isUpdatingMessage, onClickButton]
  );
};
