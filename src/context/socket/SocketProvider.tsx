import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyChats } from "../../hooks/useMyChats";
import { createContext, useEffect } from "react";
import io from "socket.io-client";
import { QUERY_KEYS } from "../../shared/enums/queryKeys";
import { IChat } from "../../shared/types/chat.interface";
import { IUser } from "../../shared/types/user.interface";
import { SOCKET_KEYS } from "../../shared/enums/socketKeys";
import toast from "react-hot-toast";
import { IMessage } from "../../shared/types/message.interface";
import {
  ISocketProvider,
  removeFromGroupType,
} from "./socket-provider.interface";
import { useNotification } from "../../hooks/useNotification";
import { INotification, type } from "../../shared/types/notification.interface";
import { getMedia } from "../../utils";

let socket: string;
const ENPOINT = import.meta.env.VITE_SOCKET_URL;

export const SocketContext = createContext({} as ISocketProvider);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, selectedChat, setSelectedChat, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { chats: existChats } = useMyChats();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { getNewNotification, deleteNotification, needToSetIsView } =
    useNotification();

  // connect
  useEffect(() => {
    if (!user) return;

    socket = io(ENPOINT);

    const sessionId = localStorage.getItem("sessionId") || "";
    socket.emit(SOCKET_KEYS.SETUP, { userData: user, sessionId });
  }, [user]);

  // on Online
  useEffect(() => {
    if (!socket) return;
    socket.on("online", (id: string) => {
      queryClient.setQueryData([QUERY_KEYS.GET_MY_CHATS], (chats: IChat[]) => {
        return chats.map((chat) => {
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
                user._id === id ? { ...user, isOnline: false } : user
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

    socket.on(SOCKET_KEYS.SIGNIN, (sessionId: string) => {
      if (!localStorage.getItem("sessionId")) return;
      if (sessionId === localStorage.getItem("sessionId")) return;
      //   toast.success("Вошли в твой аккаунт");
      //   queryClient.refetchQueries([QUERY_KEYS.GET_MY_TOKENS]);
    });

    return () => {
      socket.off(SOCKET_KEYS.SIGNIN);
    };
  }, []);

  // on deleteMyDevice
  useEffect(() => {
    if (!socket) return;

    socket.on(SOCKET_KEYS.DELETEMYDEVICE, (sessionId: string) => {
      if (sessionId !== localStorage.getItem("sessionId")) return;

      setUser(null);
      setSelectedChat(null);
      queryClient.clear();
      localStorage.removeItem("token");
      localStorage.removeItem("sessionId");
      navigate("/signin");
      toast.success("Вас удалил из устройств");
    });

    return () => {
      socket.off(SOCKET_KEYS.DELETEMYDEVICE);
    };
  }, []);

  // on new message
  useEffect(() => {
    if (!socket) return;

    socket.on(
      SOCKET_KEYS.MESSAGE_RECIEVED,
      ({ chatId, message }: { chatId: string; message: IMessage }) => {
        let currentChat: IChat;

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
                    },
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

        if (pathname !== "/chats") {
          if (pathname === "chats") return;
          toast((t) => (
            <div className="flex justify-between items-center w-[200px] max-h-[50px] max-sm:max-h-[30px] max-sm:max-w-[180px]">
              <img
                src={getMedia(message?.sender?.imageUrl || "")}
                alt="photoProfile"
                className="rounded-[60px] min-w-[40px] max-w-[40px] max-h-[40px] object-cover"
              />
              <div className="text-[20px] max-sm:text-[18px] text-white p-[5px]">
                {!currentChat
                  ? "У вас новый собеседник"
                  : message?.content?.length > 8
                  ? message?.content?.slice(1, 8) + "..."
                  : message.content}
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
          ));
        }
      }
    );

    return () => {
      socket.off(SOCKET_KEYS.MESSAGE_RECIEVED);
    };
  }, [selectedChat, pathname]);

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
    window.addEventListener("blur", handleUnload);

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

    socket.emit(SOCKET_KEYS.DELETEMYDEVICE, { myId: user?._id, sessionId });
  };

  // emit message
  const sendMessageToSocket = (message: IMessage) => {
    if (!socket) return;
    socket.emit(SOCKET_KEYS.NEW_MESSAGE, {
      newMessage: message,
      chat: selectedChat,
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
