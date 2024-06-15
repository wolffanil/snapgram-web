import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface ISave extends ITimestamps {
  _id: string;
  postId: IPost | string;
  userId: IUser | string;
  post: IPost;
}
