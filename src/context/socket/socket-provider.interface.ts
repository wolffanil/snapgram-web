import { IMessage } from "../../shared/types/message.interface";

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

export interface ISocketProvider {
  sendMessageToSocket: (message: IMessage) => void;
  handleLogoutFromSocket: () => void;
  handleDeleteDevice: (sessionId: string) => void;
  handleCreateGroupToSocket: (data: createGroupType) => void;
  handleRemoveFromGroupSocket: (data: removeFromGroupType) => void;
  handleAddToGroupSocket: (data: addToGroupType) => void;
}
