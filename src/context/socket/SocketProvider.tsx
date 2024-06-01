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

let socket: string;
const ENPOINT = import.meta.env.VITE_SOCKET_URL;

export const SocketContext = createContext({} as ISocketProvider);

const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, selectedChat, setSelectedChat, setUser } = useAuth();
  const queryClient = useQueryClient();
  const { chats: existChats } = useMyChats();
  const navigate = useNavigate();
  const { pathname } = useLocation();

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
  }, []);

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
  }, [existChats]);

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
              console.log("fix");
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
        console.log(chatId, "chatId");
        console.log(message, "newMessage");
        let currentChat;

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

        if (chatId !== selectedChat?._id || pathname !== "/chats") {
          //   toast((t) => (
          //     <MessageBlock>
          //       <MessageImg
          //         src={message.sender?.photoProfile}
          //         alt="photoProfile"
          //       />
          //       <MessageContent>
          //         {!currentChat
          //           ? "У вас новый собеседник"
          //           : message.content.length > 10
          //           ? message.content.slice(1, 10) + "..."
          //           : message.content}
          //       </MessageContent>
          //       {currentChat && (
          //         <MessageButton
          //           onClick={() => {
          //             setSelectedChat(currentChat);
          //             navigate("/chat");
          //             toast.dismiss(t.id);
          //           }}
          //         >
          //           Чат
          //         </MessageButton>
          //       )}
          //     </MessageBlock>
          //   ));
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

  return (
    <SocketContext.Provider
      value={{
        handleAddToGroupSocket,
        handleCreateGroupToSocket,
        handleDeleteDevice,
        handleLogoutFromSocket,
        handleRemoveFromGroupSocket,
        sendMessageToSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
