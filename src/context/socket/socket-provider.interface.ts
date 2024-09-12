import { IChat } from "@/shared/types/chat.interface";
import { IMessage } from "@/shared/types/message.interface";
import { INotification, type } from "@/shared/types/notification.interface";

export type createGroupType = {
  users: string[];
  chatName: string;
  groupAdmin: string;
};

export type removeFromGroupType = {
  userId: string;
  chatId: string;
  chatName: string;
};

export type addToGroupType = {
  userId: string;
  chatName: string;
};

export type ActionMessage = {
  type: "delete" | "update";
  messageId: string;
  text: string;
};

export interface ISocketProvider {
  sendMessageToSocket: (message: IMessage, chat?: IChat) => void;
  handleLogoutFromSocket: () => void;
  handleDeleteDevice: (sessionId: string) => void;
  handleCreateGroupToSocket: (data: createGroupType) => void;
  handleRemoveFromGroupSocket: (data: removeFromGroupType) => void;
  handleAddToGroupSocket: (data: addToGroupType) => void;
  handleDeleteNotificationSocket: ({
    to,
    postId,
    type,
  }: {
    to: string;
    postId: string;
    type: type;
  }) => void;
  handleSendNewNotificationToSocket: ({
    notificaion,
    to,
  }: {
    notificaion: INotification;
    to: string;
  }) => void;
  handleSayHello: (sessionId: string) => void;
  handleSendTokenQr: (code: string, token: string) => void;
  handleUpdataPasswordToSocket: (sessionIds: string[]) => void;
  handleReadMessages: ({
    userId,
    chatId,
  }: {
    userId: string;
    chatId: string;
  }) => void;

  handleStopTyping: () => void;
  handleTyping: () => void;
  handleActionMessage: ({ messageId, text, type }: ActionMessage) => void;
}
