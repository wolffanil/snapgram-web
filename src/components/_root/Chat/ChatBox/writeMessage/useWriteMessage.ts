import { useAuth } from "@/hooks/useAuth";
import { useSocket } from "@/hooks/useSocket";
import { MessageService } from "@/services/message.service";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IChat } from "@/shared/types/chat.interface";
import { IMessage } from "@/shared/types/message.interface";
import { IUser } from "@/shared/types/user.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "mutative";
import { useState } from "react";

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
        chat: chatId,
        content,
        createdAt: String(date),
      } as IMessage;

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
        (oldMessages: IMessage[]) => {
          if (!oldMessages) return [...oldMessages, newMessage];
          return create(oldMessages, (draft) => {
            draft.push(newMessage);
          });
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
        return create(chats, (draft) => {
          draft.forEach((chat, index) => {
            if (chat._id === chatId) {
              chat.latestMessage = chat.latestMessage || {};
              chat.latestMessage.content = message.content;
              chat.latestMessage.sender = { ...user } || {};
              chat.latestMessage.isRead = false;

              const [targetChat] = draft.splice(index, 1);
              draft.unshift(targetChat);
            }
          });
        });
      });
    },
  });

  const handleSendMessage = async () => {
    if (message.length < 1) return;

    setMessage("");
    const newMessageData: IMessage = {
      content: message,
      chat: chatId,
      createdAt: new Date().toISOString(),
      sender: {
        ...user,
      },
    } as IMessage;

    sendMessageToSocket(newMessageData);
    const newMessage = await sendMessage({
      content: message,
    });
    // sendMessageToSocket(newMessage);
  };

  // useEffect(() => {
  //   setMessage("");
  // }, [selectedChat]);

  return { handleSendMessage, message, setMessage };
};
