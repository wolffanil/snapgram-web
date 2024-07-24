import { useAuth } from "@/hooks/useAuth";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { SOCKET_KEYS } from "@/shared/enums/socketKeys";
import { IChat } from "@/shared/types/chat.interface";
import { useQueryClient } from "@tanstack/react-query";
import { create } from "mutative";
import { useCallback, useEffect } from "react";
import { getСompanion } from "@/utils";

export const SocketChat = (socket: any) => {
  const { selectedChat, setSelectedChat, user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.STOP_TYPING, (chatId: string) => {
      if (selectedChat?._id === chatId) {
        setSelectedChat({ ...selectedChat, isTyping: false });
      }

      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return create(chats, (draft) => {
          const newChats = draft.map((chat) =>
            chat._id === chatId ? { ...chat, isTyping: false } : chat
          );

          return newChats;
        });
      });
    });

    return () => {
      if (!socket) return;

      socket.off(SOCKET_KEYS.STOP_TYPING);
    };
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.TYPING, (chatId: string) => {
      if (selectedChat?._id === chatId) {
        setSelectedChat({ ...selectedChat, isTyping: true });
      }

      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return create(chats, (draft) => {
          const newChats = draft.map((chat) =>
            chat._id === chatId ? { ...chat, isTyping: true } : chat
          );

          return newChats;
        });
      });
    });

    return () => {
      if (!socket) return;
      socket.off(SOCKET_KEYS.TYPING);
    };
  }, [socket, selectedChat]);

  const handleStopTyping = useCallback(() => {
    if (!socket) return;
    const n = getСompanion(selectedChat?.users || [], user?._id || "");

    const companion = selectedChat?.users[n];

    socket.emit(SOCKET_KEYS.STOP_TYPING, {
      userId: companion?._id,
      chatId: selectedChat?._id,
    });
  }, [socket, selectedChat, user]);

  const handleTyping = useCallback(() => {
    if (!socket) return;
    const n = getСompanion(selectedChat?.users || [], user?._id || "");

    const companion = selectedChat?.users[n];

    socket.emit(SOCKET_KEYS.TYPING, {
      userId: companion?._id,
      chatId: selectedChat?._id,
    });
  }, [socket, selectedChat, user]);

  return { handleStopTyping, handleTyping };
};