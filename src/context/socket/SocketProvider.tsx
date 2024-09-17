import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyChats } from "@/hooks/useMyChats";
import { createContext, useCallback, useEffect } from "react";
import io from "socket.io-client";
import { QUERY_KEYS } from "@/shared/enums/queryKeys";
import { IChat } from "@/shared/types/chat.interface";
import { IUser } from "@/shared/types/user.interface";
import { SOCKET_KEYS } from "@/shared/enums/socketKeys";
import toast from "react-hot-toast";
import { IMessage } from "@/shared/types/message.interface";
import {
  ISocketProvider,
  removeFromGroupType,
} from "./socket-provider.interface";
import { useNotification } from "@/hooks/useNotification";
import { INotification, type } from "@/shared/types/notification.interface";
import { getMedia } from "@/utils";
import { SocketAuthHelper } from "./helpers/SocketAuth";
import { create } from "mutative";
import { SocketChat } from "./helpers/SocketChat";


let socket: any;
const ENPOINT = import.meta.env.VITE_SOCKET_URL;

export const SocketContext = createContext({} as ISocketProvider);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    selectedChat,
    setSelectedChat,
    sessionId: currentSessionId,
    deleteUser,
  } = useAuth();
  const queryClient = useQueryClient();
  const { chats: existChats } = useMyChats();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getNewNotification, deleteNotification, needToSetIsView } =
    useNotification();

  const { handleSendTokenQr } = SocketAuthHelper(socket);
  const { handleStopTyping, handleTyping, handleActionMessage } =
    SocketChat(socket);

  // connect
  useEffect(() => {
    if (!user) return;

    socket = io(ENPOINT);

    // const sessionId = localStorage.getItem("sessionId") || "";
    socket.emit(SOCKET_KEYS.SETUP, { userData: user });
  }, [user]);

  // on Online
  useEffect(() => {
    if (!socket) return;
    socket.on("online", (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return chats?.map((chat) => {
          const hasUser = chat.users.some((user) => user._id === id);

          if (hasUser) {
            const fixChat = {
              ...chat,
              users: chat.users.map((user) =>
                user._id === id ? { ...user, isOnline: true } : user
              ),
            };
            if (selectedChat?._id === chat._id) {
              setSelectedChat(fixChat);
            }
            return fixChat;
          } else {
            return chat;
          }
        });
      });
    });

    return () => {
      socket.off("online");
    };
  }, [selectedChat]);

  // emit online
  useEffect(() => {
    if (!socket || !existChats) return;
    let users: IUser[] | [] = [];

    const chats: IChat[] =
      queryClient.getQueryData([QUERY_KEYS.GET_MY_CHATS]) || [];

    chats.forEach((chat) => {
      if (chat.isGroupChat) return;
      chat.users.forEach((u: IUser) => {
        if (u._id !== user?._id) {
          users.push(u);
        }
      });
    });

    socket.emit(SOCKET_KEYS.ONLINE, { users, id: user?._id });
  }, [existChats, selectedChat]);

  // on offline
  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_KEYS.OFFLINE, (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return chats.map((chat) => {
          const hasUser = chat.users.some((user) => user._id === id);

          if (hasUser) {
            const fixChat = {
              ...chat,
              users: chat.users.map((user) =>
                user._id === id
                  ? {
                      ...user,
                      isOnline: false,
                      updatedAt: new Date().toISOString(),
                    }
                  : user
              ),
            };
            if (selectedChat?._id === chat._id) {
              setSelectedChat(fixChat);
            }
            return fixChat;
          } else {
            return chat;
          }
        });
      });
    });

    return () => {
      socket.off(SOCKET_KEYS.OFFLINE);
    };
  }, [selectedChat]);

  // on signin
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.SIGNIN, () => {
      toast.success("Вошли в твой аккаунт");
      queryClient.invalidateQueries([QUERY_KEYS.GET_MY_TOKENS]);
    });

    return () => {
      socket.off(SOCKET_KEYS.SIGNIN);
    };
  }, [currentSessionId]);

  // on deleteMyDevice
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.DELETEMYDEVICE, (sessionId: string) => {
      if (currentSessionId !== sessionId) return;

      deleteUser();
      queryClient.clear();
      navigate("/login");
    });

    return () => {
      socket.off(SOCKET_KEYS.DELETEMYDEVICE);
    };
  }, [currentSessionId]);

  // on new message
  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_KEYS.MESSAGE_RECIEVED,
      ({ chatId, message }: { chatId: string; message: IMessage }) => {
        const messages: IMessage[] | undefined = queryClient.getQueryData([
          QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID,
          chatId,
        ]);

        if (
          (messages?.length && messages?.some((m) => m._id === message._id)) ||
          (message.type === "repost" && message.sender._id === user?._id)
        )
          return;

        let currentChat: IChat;

        if (selectedChat?._id === chatId && message.sender._id !== user?._id) {
          const userId = message.sender._id;

          socket.emit(SOCKET_KEYS.READ_MESSAGES, { userId, chatId });

          queryClient.setQueryData(
            [QUERY_KEYS.GET_MY_CHATS],
            (chats: IChat[]) => {
              return create(chats, (draft) => {
                const newChats = draft.map((chat) =>
                  chat._id === chatId
                    ? { ...chat, unreadMessagesCount: 0 }
                    : chat
                );
                return newChats;
              });
            }
          );
        }

        queryClient.setQueryData(
          [QUERY_KEYS.GET_MY_CHATS],
          (chats: IChat[]) => {
            const updatedChats = chats.map((chat) =>
              chat._id === chatId
                ? {
                    ...chat,
                    latestMessage: {
                      ...chat.latestMessage,
                      content: message.content,
                      sender: message.sender,
                      type: message.type === "repost" ? "repost" : "text",
                      isRead: message.sender._id === user?._id ? false : null,
                    },
                    unreadMessagesCount:
                      message.sender._id !== user?._id
                        ? chat.unreadMessagesCount + 1
                        : chat.unreadMessagesCount,
                  }
                : chat
            );

            const targetIndex = updatedChats.findIndex(
              (chat) => chat._id === chatId
            );

            currentChat = updatedChats.find((chat) => chat._id === chatId);

            if (targetIndex !== -1) {
              const targetChat = updatedChats.splice(targetIndex, 1)[0];
              updatedChats.unshift(targetChat);
            }

            return updatedChats;
          }
        );

        if (!currentChat) {
          //@ts-ignore
          queryClient.refetchQueries([QUERY_KEYS.GET_MY_CHATS]);
        }

        queryClient.setQueryData(
          [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
          (messages: IMessage[]) => {
            if (!messages) return;
            return [...messages, message];
          }
        );

        if (pathname !== "/chats" && message.sender._id !== user?._id) {
          if (pathname === "chats") return;

          const getToastId = localStorage.getItem("toastId");

          const toastId = toast(
            (t) => (
              <div className="flex justify-between items-center w-[200px] max-h-[50px] max-sm:max-h-[30px] max-sm:max-w-[180px]">
                <img
                  src={getMedia(message?.sender?.imageUrl || "")}
                  alt="photoProfile"
                  className="rounded-[60px] min-w-[40px] max-w-[40px] max-h-[40px] object-cover"
                />
                <div className="text-[20px] max-sm:text-[14px] text-white p-[5px]">
                  {/* {!currentChat
                        ? "У вас новый собеседник"
                        : message?.content?.length > 8
                        ? message?.content?.slice(1, 8) + "..."
                        : message.content} */}
                  {!currentChat ? "У вас новый собеседник" : `Новое сообщение `}
                </div>
                {currentChat && (
                  <button
                    onClick={() => {
                      setSelectedChat(currentChat);
                      navigate("/chats");
                      toast.dismiss(t.id);
                    }}
                    className="text-[15px] ml-[10px] bg-primary-600 p-[5px] rounded-[5px]"
                  >
                    Чат
                  </button>
                )}
              </div>
            ),
            {
              id: getToastId ? getToastId : undefined,
            }
          );

          localStorage.setItem("toastId", toastId);
        }
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.MESSAGE_RECIEVED);
    };
  }, [selectedChat, pathname]);

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.READ_MESSAGES, (chatId: string) => {
      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
        (oldMessages: IMessage[]) => {
          if (!oldMessages) return undefined;
          const newMessages = oldMessages.map((m) => {
            if (m.chat === chatId && m.sender?._id === user?._id) {
              return { ...m, isRead: true };
            }
            return m;
          });

          return newMessages;
        }
      );

      const updateChats = async () => {
        await new Promise((res) => setTimeout(res, 2000));

        queryClient.setQueryData(
          [QUERY_KEYS.GET_MY_CHATS],
          (chats: IChat[]) => {
            if (!chats) return undefined;

            const newChats = chats.map((chat) => {
              if (
                chat._id === chatId &&
                chat.latestMessage.sender._id === user?._id &&
                !chat.isGroupChat
              ) {
                return {
                  ...chat,
                  latestMessage: { ...chat.latestMessage, isRead: true },
                };
              }
              return chat;
            });
            return newChats;
          }
        );
      };

      updateChats();
    });

    return () => {
      socket.off(SOCKET_KEYS.READ_MESSAGES);
    };
  }, [user]);

  // emit offline
  useEffect(() => {
    const handleUnload = () => {
      if (!socket) return;

      let users: IUser[] | [] = [];

      const chats: IChat[] =
        queryClient.getQueryData([QUERY_KEYS.GET_MY_CHATS]) || [];

      chats.forEach((chat) => {
        if (chat.isGroupChat) return;
        chat.users.forEach((u: IUser) => {
          if (u._id !== user?._id) {
            users.push(u);
          }
        });
      });

      socket.emit(SOCKET_KEYS.OFFLINE, { users, id: user?._id });
      socket.emit(SOCKET_KEYS.LEAVE_ROOM, user?._id);
    };
    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // on createGroup
  useEffect(() => {
    if (!socket) return;
    socket.on(SOCKET_KEYS.CREATE_GROUP, (chatName: string) => {
      //@ts-ignore
      queryClient.refetchQueries([QUERY_KEYS.GET_MY_CHATS]);
      toast.success(`Вас добавели в группу ${chatName}`);
    });

    return () => {
      socket.off(SOCKET_KEYS.CREATE_GROUP);
    };
  }, []);

  // on addTogroup
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.ADD_TO_GROUP, (chatName: string) => {
      //@ts-ignore
      queryClient.refetchQueries([QUERY_KEYS.GET_MY_CHATS]);
      toast.success(`Вас дабавели в группу - ${chatName}`);
    });

    return () => {
      socket.off(SOCKET_KEYS.ADD_TO_GROUP);
    };
  }, []);

  // on removeFromGRoup
  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_KEYS.REMOVE_FROM_GROUP,
      ({ chatId, chatName }: removeFromGroupType) => {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_MY_CHATS],
          (chats: IChat[]) => {
            const freshChats = chats.filter((c) => c._id !== chatId);
            return freshChats;
          }
        );
        toast.success(`Вас удалили из группу - ${chatName}`);
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.REMOVE_FROM_GROUP);
    };
  }, []);

  // on new notification
  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_KEYS.GET_NEW_NOTIFICATION,
      (notification: INotification) => {
        if (!notification) return;
        getNewNotification(notification);
        if (pathname === "/notifications") {
          needToSetIsView(true);
        }
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.GET_NEW_NOTIFICATION);
    };
  }, [pathname]);

  // on delete notification
  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_KEYS.REMOVE_NOTIFICATION,
      ({ postId, type }: { postId: string; type: type }) => {
        deleteNotification({ postId, type });
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.REMOVE_NOTIFICATION);
    };
  }, []);

  // on deleteUserGromGroup and on addUserInGroup

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.NEW_USER_IN_GROUP, () => {
      //@ts-ignore
      queryClient.refetchQueries([QUERY_KEYS.GET_MY_CHATS]);
    });

    socket.on(
      SOCKET_KEYS.DELETE_USER_IN_GROUP,
      ({ chatId, userId }: { chatId: string; userId: string }) => {
        queryClient.setQueryData(
          [QUERY_KEYS.GET_MY_CHATS],
          (chats: IChat[]) => {
            return chats.map((chat) =>
              chat._id === chatId
                ? {
                    ...chat,
                    users: chat.users.filter(
                      //@ts-ignore
                      (u: IUser[]) => u._id !== userId
                    ),
                  }
                : chat
            );
          }
        );
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.NEW_USER_IN_GROUP);
      socket.off(SOCKET_KEYS.DELETE_USER_IN_GROUP);
    };
  }, []);

  /// on say hello

  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.ACCEPT_SAY_HELLO, (sessionId: string) => {
      if (currentSessionId !== sessionId) return;

      const getToastIdHello = localStorage.getItem("getToastIdHello");

      const toastId = toast("Привет", {
        icon: "👋",
        id: getToastIdHello ? getToastIdHello : undefined,
      });

      localStorage.setItem("getToastIdHello", toastId);
    });

    return () => {
      socket.off(SOCKET_KEYS.ACCEPT_SAY_HELLO);
    };
  }, [currentSessionId]);

  // emit offline
  const handleLogoutFromSocket = () => {
    let users: IUser[] | [] = [];

    const chats: IChat[] =
      queryClient.getQueryData([QUERY_KEYS.GET_MY_CHATS]) || [];

    chats.forEach((chat) => {
      if (chat.isGroupChat) return;
      chat.users.forEach((u: IUser) => {
        if (u._id !== user?._id) {
          users.push(u);
        }
      });
    });

    socket.emit(SOCKET_KEYS.OFFLINE, { users, id: user?._id });
    socket.emit(SOCKET_KEYS.LEAVE_ROOM, user?._id);
  };

  const handleDeleteDevice = (sessionId: string) => {
    if (!socket) return;

    socket.emit(SOCKET_KEYS.DELETEDEVICE, { myId: user?._id, sessionId });
  };

  // emit message
  const sendMessageToSocket = (message: IMessage, chat?: IChat) => {
    if (!socket) return;
    socket.emit(SOCKET_KEYS.NEW_MESSAGE, {
      newMessage: message,
      chat: chat?._id ? chat : selectedChat,
    });
  };

  const handleAddToGroupSocket = ({
    userId,
    chatName,
  }: {
    userId: string;
    chatName: string;
  }) => {
    if (!socket) return;

    const users = selectedChat?.users
      .filter((u) => u._id !== user?._id)
      .map((user) => user._id);

    socket.emit(SOCKET_KEYS.ADD_TO_GROUP, {
      userId,
      chatName,
      usersGroup: users,
    });
  };

  const handleRemoveFromGroupSocket = ({
    userId,
    chatId,
    chatName,
  }: removeFromGroupType) => {
    if (!socket) return;

    const users = selectedChat?.users
      .filter((user) => user._id !== user._id)
      .map((u) => u._id);

    socket.emit(SOCKET_KEYS.REMOVE_FROM_GROUP, {
      userId,
      chatId,
      chatName,
      usersGroup: users,
    });
  };

  const handleCreateGroupToSocket = ({
    users,
    chatName,
    groupAdmin,
  }: {
    users: string[];
    chatName: string;
    groupAdmin: string;
  }) => {
    if (!socket) return;

    socket.emit(SOCKET_KEYS.CREATE_GROUP, { users, chatName, groupAdmin });
  };

  const handleSendNewNotificationToSocket = ({
    notificaion,
    to,
  }: {
    notificaion: INotification;
    to: string;
  }) => {
    if (!socket) return;
    socket.emit(SOCKET_KEYS.SEND_NEW_NOTIFICATION, { notificaion, to });
  };

  const handleDeleteNotificationSocket = ({
    to,
    postId,
    type,
  }: {
    to: string;
    postId: string;
    type: type;
  }) => {
    if (!socket) return;
    socket.emit(SOCKET_KEYS.SEND_REMOVE_NOTICATION, { to, postId, type });
  };

  const handleSayHello = useCallback(
    (sessionId: string) => {
      if (!socket) return;

      socket.emit(SOCKET_KEYS.SEND_SAY_HELLO, { myId: user?._id, sessionId });
    },
    [socket, user]
  );

  const handleUpdataPasswordToSocket = useCallback(
    (sessionIds: string[]) => {
      if (!socket) return;
      socket.emit(SOCKET_KEYS.UPDATE_PASSWORD, {
        sessionIds,
        userId: user?._id,
      });
    },
    [user]
  );

  const handleReadMessages = useCallback(
    ({ userId, chatId }: { userId: string; chatId: string }) => {
      if (!socket) return;

      socket.emit(SOCKET_KEYS.READ_MESSAGES, { userId, chatId });

      queryClient.setQueryData(
        [QUERY_KEYS.GET_MESSAGES_BY_CHAT_ID, chatId],
        (messages: IMessage[]) => {
          return messages.map((message) =>
            message.sender._id === userId && !message.isRead
              ? { ...message, isRead: true }
              : message
          );
        }
      );
    },
    []
  );

  return (
    <SocketContext.Provider
      value={{
        handleAddToGroupSocket,
        handleCreateGroupToSocket,
        handleDeleteDevice,
        handleLogoutFromSocket,
        handleRemoveFromGroupSocket,
        sendMessageToSocket,
        handleSendNewNotificationToSocket,
        handleDeleteNotificationSocket,
        handleSayHello,
        handleSendTokenQr,
        handleUpdataPasswordToSocket,
        handleReadMessages,
        handleStopTyping,
        handleTyping,
        handleActionMessage,
      }}
      // value={value}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
