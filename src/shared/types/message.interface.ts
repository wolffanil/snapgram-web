import { IChat } from "./chat.interface";
import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface IMessage extends ITimestamps {
  sender: IUser | string;
  content: string;
  chat: IChat | string;
  imageUrl: string;
  post?: IPost;
  repostText?: string;
}
