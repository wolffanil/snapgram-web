import { IChat } from "./chat.interface";
import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IMessage extends ITimestamps {
  _id: string;
  sender: IUser;
  content?: string;
  chat: IChat | string;
  imageUrl?: string;
  post?: IPost;
  repostText?: string;
}

export interface IEditMessage extends Pick<IMessage, "chat" | "content"> {}
