import { IChat } from "./chat.interface";
import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export type typeMessage = "text" | "image" | "repost" | "answer";

export interface IMessage extends ITimestamps {
  _id: string;
  sender: IUser;
  content?: string;
  chat: IChat | string;
  imageUrl?: string;
  post?: Pick<
    IPost,
    "_id" | "creator" | "caption" | "imageUrl" | "location" | "createdAt"
  >;
  repostText?: string;
  isRead: boolean;
  type: typeMessage;
}

export interface IEditMessage extends Pick<IMessage, "chat" | "content"> {}

export interface ISendMessage
  extends Omit<
    IMessage,
    "_id" | "sender" | "isRead" | "post" | "createdAt" | "updatedAt"
  > {
  post?: string;
}
