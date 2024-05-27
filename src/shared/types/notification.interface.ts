import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export type type = "like" | "save" | "comment" | "repost";

export interface INotification extends ITimestamps {
  postId: IPost;
  to: string;
  user: IUser;
  type: type;
}
