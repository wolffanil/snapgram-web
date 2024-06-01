import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAuth } from "../../../../../hooks/useAuth";
import { MessageService } from "../../../../../services/message.service";
import { IMessage } from "../../../../../shared/types/message.interface";
import { QUERY_KEYS } from "../../../../../shared/enums/queryKeys";
import { IUser } from "../../../../../shared/types/user.interface";
import { IChat } from "../../../../../shared/types/chat.interface";
import { useSocket } from "../../../../../hooks/useSocket";

export const useWriteMessage = () => {
  const [message, setMessage] = useState("");
  const { selectedChat, user } = useAuth();
  const queryClient = useQueryClient();
  const { sendMessageToSocket } = useSocket();
  const chatId = selectedChat?._id || "";

  const { mutateAsync: sendMessage } = useMutation({
    mutationKey: ["send message"],
    mutationFn: ({ content }: { content: string }) =>
      MessageService.create({ chat: chatId, content }),
    onMutate: ({ content }: { content: string }) => {
      const oldMessages: IMessage[] =
        queryClient.getQueryData([
          QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID,
          chatId,
        ]) || [];

      const date = new Date();

      date.toISOString();

      const newMessage: IMessage = {
        _id: String(Date.now()),
        sender: {
          ...user,
        } as IUser,
        content,
        createdAt: String(date),
      } as IMessage;

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
        (oldMessages: IMessage[]) => {
          return [...oldMessages, newMessage];
        }
      );

      return { oldMessages };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
        context
      );
    },
    onSuccess: (message: IMessage, variables) => {
      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        const updatedChats = chats.map((chat) =>
          chat._id === chatId
            ? {
                ...chat,
                latestMessage: {
                  ...chat.latestMessage,
                  content: message.content,
                },
              }
            : chat
        );

        const targetIndex = updatedChats.findIndex(
          (chat) => chat._id === chatId
        );

        if (targetIndex !== -1) {
          const targetChat = updatedChats.splice(targetIndex, 1)[0];
          updatedChats.unshift(targetChat);
        }

        return updatedChats;
      });
    },
  });

  const handleSendMessage = async () => {
    if (message.length < 1) return;

    setMessage("");
    const newMessage = await sendMessage({
      content: message,
    });

    const newMessageData: IMessage = {
      content: newMessage.content,
      chat: chatId,
      createdAt: newMessage.createdAt,
      sender: {
        ...user,
      },
    } as IMessage;

    sendMessageToSocket(newMessageData);
  };

  // useEffect(() => {
  //   setMessage("");
  // }, [selectedChat]);

  return { handleSendMessage, message, setMessage };
};
