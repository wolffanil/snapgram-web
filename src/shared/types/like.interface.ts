import { IComment } from "./comment.interface";
import { IPost } from "./post.interface";
import { ITimestamps } from "./timestamps.interface";
import { IUser } from "./user.interface";

export interface ILike extends ITimestamps {
  _id: string;
  userId: IUser;
  postId?: IPost;
  commentId: IComment | string;
}
