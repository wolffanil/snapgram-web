import { IMessage } from "./message.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IChat extends ITimestamps {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: IUser[];
  groupAdmin: IUser;
  latestMessage: IMessage;
  background: string;
}

export interface IEditGroup {
  chatId: string;
  users: IUser[];
  background?: string;
  chatName: string;
}
