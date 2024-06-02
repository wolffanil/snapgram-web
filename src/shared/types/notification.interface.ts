import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export type type = "like" | "save" | "comment" | "repost";

export interface INotification extends ITimestamps {
  postId: IPost;
  to: string;
  user: IUser;
  type: type;
  isView: boolean;
}

export interface ICreateNotificaion
  extends Omit<INotification, "isView" | "createdAt" | "updatedAt" | "user"> {
  user: {
    _id: string;
    name: string;
  };
}

export interface IDeleteNotification {
  type: type;
  postId: string;
  to: string;
}
