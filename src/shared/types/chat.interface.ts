import { IMessage } from "./message.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IChat extends ITimestamps {
  chatName: string;
  isGroupChat: boolean;
  users: IUser[];
  groupAdmin: IUser;
  lastestMessage: IMessage;
}
